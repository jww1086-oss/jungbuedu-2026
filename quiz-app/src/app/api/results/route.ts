export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createPool } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

const quizzesPath = path.join(process.cwd(), 'data', 'quizzes.json');
const resultsPath = path.join(process.cwd(), 'data', 'results.json');

// Neon 통합은 DATABASE_URL을, Vercel 기본은 POSTGRES_URL을 사용합니다.
const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const hasDbConfig = !!dbUrl;

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
      return NextResponse.json(results);
    }
  } catch (err) {
    console.error('DB GET Error:', err);
    return NextResponse.json({ error: 'Failed to read results' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentName, quizId, answers } = body;

    // 퀴즈 정답 검증 로직
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
          score INTEGER,
          total INTEGER,
          details JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // Vercel Postgres에 Insert
      const detailsJson = JSON.stringify(details);
      await db.sql`
        INSERT INTO results (quiz_id, student_name, score, total, details)
        VALUES (${quizId}, ${studentName}, ${score}, ${total}, ${detailsJson}::jsonb)
      `;
      return NextResponse.json({ 
        success: true, 
        studentName, 
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
      
      const newResult = {
        id: Date.now(),
        studentName,
        quizId,
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
    return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
  }
}
