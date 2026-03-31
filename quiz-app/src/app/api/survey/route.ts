export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createPool } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const surveysPath = path.join(dataDir, 'surveys.json');

const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
// 로컬 dev.db 등의 설정을 무시하고 실제 Postgres 연결일 때만 DB 모드 활성화하도록 조건 강화
const hasDbConfig = !!dbUrl && dbUrl.startsWith('postgres');

export async function GET() {
  try {
    if (hasDbConfig) {
      const db = createPool({ connectionString: dbUrl });
      await db.sql`
        CREATE TABLE IF NOT EXISTS surveys (
          id SERIAL PRIMARY KEY,
          department VARCHAR(255),
          survey_date VARCHAR(50),
          ratings JSONB,
          answers JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      const { rows } = await db.sql`
        SELECT 
          id, 
          department, 
          survey_date as "surveyDate", 
          ratings, 
          answers, 
          created_at as "createdAt" 
        FROM surveys 
        ORDER BY created_at DESC;
      `;
      return NextResponse.json(rows);
    } else {
      if (!fs.existsSync(surveysPath)) return NextResponse.json([]);
      const fileContents = fs.readFileSync(surveysPath, 'utf8');
      const surveys = JSON.parse(fileContents);
      return NextResponse.json(surveys, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (err) {
    console.error('Survey GET Error:', err);
    return NextResponse.json({ error: 'Failed to read surveys' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { department, surveyDate, ratings, answers } = body;

    if (hasDbConfig) {
      const db = createPool({ connectionString: dbUrl });
      
      await db.sql`
        CREATE TABLE IF NOT EXISTS surveys (
          id SERIAL PRIMARY KEY,
          department VARCHAR(255),
          survey_date VARCHAR(50),
          ratings JSONB,
          answers JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      const ratingsJson = JSON.stringify(ratings);
      const answersJson = JSON.stringify(answers);
      
      await db.sql`
        INSERT INTO surveys (department, survey_date, ratings, answers)
        VALUES (${department}, ${surveyDate}, ${ratingsJson}::jsonb, ${answersJson}::jsonb)
      `;
      return NextResponse.json({ success: true });
    } else {
      let surveys = [];
      if (!fs.existsSync(path.dirname(surveysPath))) {
        fs.mkdirSync(path.dirname(surveysPath), { recursive: true });
      }
      if (fs.existsSync(surveysPath)) {
        surveys = JSON.parse(fs.readFileSync(surveysPath, 'utf8'));
      }
      
      const newSurvey = {
        id: Date.now(),
        department,
        surveyDate,
        ratings,
        answers,
        createdAt: new Date().toISOString()
      };
      
      surveys.push(newSurvey);
      fs.writeFileSync(surveysPath, JSON.stringify(surveys, null, 2), 'utf8');

      return NextResponse.json(newSurvey);
    }
  } catch (err) {
    console.error('Survey POST Error:', err);
    return NextResponse.json({ error: 'Failed to save survey' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');

    if (hasDbConfig) {
      const db = createPool({ connectionString: dbUrl });
      if (action === 'reset') {
        await db.sql`TRUNCATE TABLE surveys RESTART IDENTITY`;
        return NextResponse.json({ success: true, message: 'All surveys deleted' });
      } else if (id) {
        await db.sql`DELETE FROM surveys WHERE id = ${id}`;
        return NextResponse.json({ success: true, id });
      }
    } else {
      // 로컬 파일 기반 삭제/초기화 (Fallback)
      if (action === 'reset') {
        fs.writeFileSync(surveysPath, JSON.stringify([], null, 2), 'utf8');
        console.log('Local reset success (surveys)');
        return NextResponse.json({ success: true, message: 'All surveys deleted' });
      } else if (id) {
        if (!fs.existsSync(surveysPath)) return NextResponse.json({ success: true, id });

        const contents = fs.readFileSync(surveysPath, 'utf8');
        let surveysList = [];
        try {
          surveysList = JSON.parse(contents);
        } catch (e) {
          console.error('JSON parse error (surveys), resetting surveys file');
          surveysList = [];
        }

        const initialLength = surveysList.length;
        // id가 숫자형 또는 문자열형일 수 있으므로 두 가지 경우 모두 체크
        surveysList = surveysList.filter((s: any) => String(s.id) !== String(id));
        
        fs.writeFileSync(surveysPath, JSON.stringify(surveysList, null, 2), 'utf8');
        console.log(`Deleted survey ${id}. Count: ${initialLength} -> ${surveysList.length}`);
        return NextResponse.json({ success: true, id });
      }
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (err) {
    console.error('Survey DELETE Error:', err);
    return NextResponse.json({ 
      error: 'Failed to delete surveys', 
      details: err instanceof Error ? err.message : String(err) 
    }, { 
      status: 500,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  }
}
