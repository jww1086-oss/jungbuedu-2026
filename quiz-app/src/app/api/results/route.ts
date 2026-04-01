export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createPool } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const quizzesPath = path.join(dataDir, 'quizzes.json');
const resultsPath = path.join(dataDir, 'results.json');

// Neon 통합은 DATABASE_URL을, Vercel 기본은 POSTGRES_URL을 사용합니다.
const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
// 로컬 dev.db 등의 설정을 무시하고 실제 Postgres 연결일 때만 DB 모드 활성화하도록 조건 강화
const hasDbConfig = !!dbUrl && dbUrl.startsWith('postgres');

export async function GET() {
  try {
    if (hasDbConfig) {
      const db = createPool({ connectionString: dbUrl });
      // Postgres DB 연결이 감지되면 서버 시작/호출 시 테이블 자동 생성
      await db.sql`
        CREATE TABLE IF NOT EXISTS results (
          id SERIAL PRIMARY KEY,
          quiz_id INTEGER,
          student_name VARCHAR(255),
          session INTEGER,
          score INTEGER,
          total INTEGER,
          details JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      // 결과 조회 시 page.tsx 렌더링에 맞게 카멜케이스로 별칭(Alias) 설정
      const { rows } = await db.sql`
        SELECT 
          id, 
          quiz_id as "quizId", 
          student_name as "studentName", 
          session,
          score, 
          total, 
          details, 
          created_at as "createdAt" 
        FROM results 
        ORDER BY created_at DESC;
      `;
      return NextResponse.json(rows);
    } else {
      // 로컬 개발 환경용 파일 기반 로딩 (Fallback)
      if (!fs.existsSync(resultsPath)) return NextResponse.json([]);
      const fileContents = fs.readFileSync(resultsPath, 'utf8');
      const results = JSON.parse(fileContents);
      return NextResponse.json(results, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (err) {
    console.error('DB GET Error:', err);
    return NextResponse.json({ error: 'Failed to read results' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentName: rawName, quizId, answers, session } = body;
    const studentName = rawName.trim();

    // 시험 정답 검증 로직
    const quizContents = fs.readFileSync(quizzesPath, 'utf8');
    const quizzes = JSON.parse(quizContents);
    const quiz = quizzes.find((q: any) => q.id === Number(quizId));

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    let score = 0;
    const total = quiz.questions.length;
    const details = quiz.questions.map((q: any, i: number) => {
      const isCorrect = q.answerIndex === answers[i];
      if (isCorrect) score++;
      return {
        questionId: q.id,
        isCorrect,
        selectedAnswer: answers[i],
        correctAnswer: q.answerIndex,
        explanation: q.explanation
      };
    });

    if (hasDbConfig) {
      const db = createPool({ connectionString: dbUrl });
      
      // 혹시 관리자 페이지 접속 전이라 테이블이 없을 수 있으므로 강력 방어
      await db.sql`
        CREATE TABLE IF NOT EXISTS results (
          id SERIAL PRIMARY KEY,
          quiz_id INTEGER,
          student_name VARCHAR(255),
          session INTEGER,
          score INTEGER,
          total INTEGER,
          details JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // 기존 테이블에 session 컬럼이 없을 경우를 대비하여 추가 시도 (Safe migration)
      try {
        await db.sql`ALTER TABLE results ADD COLUMN IF NOT EXISTS session INTEGER;`;
      } catch (e) {
        console.log('Session column might already exist or migration error:', e);
      }

      // 중복 응시 방지 체크
      const { rowCount } = await db.sql`
        SELECT 1 FROM results 
        WHERE quiz_id = ${quizId} AND student_name = ${studentName} AND session = ${session}
      `;
      if (rowCount && rowCount > 0) {
        return NextResponse.json({ error: '이미 이번 회차의 해당 과목 평가를 완료하셨습니다.' }, { status: 400 });
      }

      // Vercel Postgres에 Insert
      const detailsJson = JSON.stringify(details);
      await db.sql`
        INSERT INTO results (quiz_id, student_name, session, score, total, details)
        VALUES (${quizId}, ${studentName}, ${session}, ${score}, ${total}, ${detailsJson}::jsonb)
      `;
      return NextResponse.json({ 
        success: true, 
        studentName, 
        session,
        score, 
        total, 
        details 
      });
    } else {
      // 로컬 환경 저장 로직 (app/admin/page.tsx 역순 정렬 대응)
      let results = [];
      if (fs.existsSync(resultsPath)) {
        results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
      }
      
      // 중복 응시 방지 체크
      const isDuplicate = results.some((r: any) => 
        String(r.quizId) === String(quizId) && 
        r.studentName === studentName && 
        Number(r.session) === Number(session)
      );
      if (isDuplicate) {
        return NextResponse.json({ error: '이미 이번 회차의 해당 과목 평가를 완료하셨습니다.' }, { status: 400 });
      }
      
      const newResult = {
        id: Date.now(),
        studentName,
        quizId,
        session: Number(session),
        score,
        total,
        details,
        createdAt: new Date().toISOString()
      };
      
      results.push(newResult);
      fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2), 'utf8');

      return NextResponse.json(newResult);
    }
  } catch (err) {
    console.error('DB POST Error:', err);
    return NextResponse.json({ 
      error: 'Failed to save result',
      details: err instanceof Error ? err.message : String(err)
    }, { 
      status: 500,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');
    
    console.log(`[DELETE] action=${action}, id=${id}, hasDbConfig=${hasDbConfig}`);

    if (hasDbConfig) {
      const db = createPool({ connectionString: dbUrl });
      if (action === 'reset') {
        await db.sql`TRUNCATE TABLE results RESTART IDENTITY`;
        return NextResponse.json({ success: true, message: 'All results deleted' });
      } else if (id) {
        await db.sql`DELETE FROM results WHERE id = ${id}`;
        return NextResponse.json({ success: true, id });
      }
    } else {
      // 로컬 파일 기반 삭제/초기화 (Fallback)
      if (action === 'reset') {
        fs.writeFileSync(resultsPath, JSON.stringify([], null, 2), 'utf8');
        console.log('Local reset success');
        return NextResponse.json({ success: true, message: 'All results deleted' });
      } else if (id) {
        if (!fs.existsSync(resultsPath)) return NextResponse.json({ success: true, id });

        const contents = fs.readFileSync(resultsPath, 'utf8');
        let resultsList = [];
        try {
          resultsList = JSON.parse(contents);
        } catch (e) {
          console.error('JSON parse error, resetting results file');
          resultsList = [];
        }

        const initialLength = resultsList.length;
        // id가 숫자형 또는 문자열형일 수 있으므로 두 가지 경우 모두 체크
        resultsList = resultsList.filter((r: any) => String(r.id) !== String(id));
        
        fs.writeFileSync(resultsPath, JSON.stringify(resultsList, null, 2), 'utf8');
        console.log(`Deleted result ${id}. Count: ${initialLength} -> ${resultsList.length}`);
        return NextResponse.json({ success: true, id });
      }
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (err) {
    console.error('API DELETE Error:', err);
    return NextResponse.json({ 
      error: 'Failed to delete results', 
      details: err instanceof Error ? err.message : String(err) 
    }, { 
      status: 500,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  }
}
