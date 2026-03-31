export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createPool } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const surveysPath = path.join(dataDir, 'application_surveys.json');

const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
// 로컬 dev.db 등의 설정을 무시하고 실제 Postgres 연결일 때만 DB 모드 활성화하도록 조건 강화
const hasDbConfig = !!dbUrl && dbUrl.startsWith('postgres');

export async function GET() {
  try {
    if (hasDbConfig) {
      const db = createPool({ connectionString: dbUrl });
      await db.sql`
        CREATE TABLE IF NOT EXISTS application_surveys (
          id SERIAL PRIMARY KEY,
          department VARCHAR(255),
          position VARCHAR(255),
          experience VARCHAR(50),
          ratings JSONB,
          q3_changes JSONB,
          q4_barriers JSONB,
          suggestions JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      const { rows } = await db.sql`
        SELECT 
          id, 
          department, 
          position,
          experience,
          ratings, 
          q3_changes as "q3Changes",
          q4_barriers as "q4Barriers",
          suggestions,
          created_at as "createdAt" 
        FROM application_surveys 
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
    console.error('Application Survey GET Error:', err);
    return NextResponse.json({ error: 'Failed to read surveys' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { department, position, experience, ratings, q3_changes, q4_barriers, suggestions } = body;

    if (hasDbConfig) {
      const db = createPool({ connectionString: dbUrl });
      
      await db.sql`
        CREATE TABLE IF NOT EXISTS application_surveys (
          id SERIAL PRIMARY KEY,
          department VARCHAR(255),
          position VARCHAR(255),
          experience VARCHAR(50),
          ratings JSONB,
          q3_changes JSONB,
          q4_barriers JSONB,
          suggestions JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      await db.sql`
        INSERT INTO application_surveys (department, position, experience, ratings, q3_changes, q4_barriers, suggestions)
        VALUES (
          ${department}, 
          ${position}, 
          ${experience}, 
          ${JSON.stringify(ratings)}::jsonb, 
          ${JSON.stringify(q3_changes)}::jsonb, 
          ${JSON.stringify(q4_barriers)}::jsonb, 
          ${JSON.stringify(suggestions)}::jsonb
        )
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
        position,
        experience,
        ratings,
        q3_changes,
        q4_barriers,
        suggestions,
        createdAt: new Date().toISOString()
      };
      
      surveys.push(newSurvey);
      fs.writeFileSync(surveysPath, JSON.stringify(surveys, null, 2), 'utf8');

      return NextResponse.json(newSurvey);
    }
  } catch (err) {
    console.error('Application Survey POST Error:', err);
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
        await db.sql`TRUNCATE TABLE application_surveys RESTART IDENTITY`;
        return NextResponse.json({ success: true, message: 'All application surveys deleted' });
      } else if (id) {
        await db.sql`DELETE FROM application_surveys WHERE id = ${id}`;
        return NextResponse.json({ success: true, id });
      }
    } else {
      // 로컬 파일 기반 삭제/초기화 (Fallback)
      if (action === 'reset') {
        fs.writeFileSync(surveysPath, JSON.stringify([], null, 2), 'utf8');
        console.log('Local reset success (application surveys)');
        return NextResponse.json({ success: true, message: 'All application surveys deleted' });
      } else if (id) {
        if (!fs.existsSync(surveysPath)) return NextResponse.json({ success: true, id });

        const contents = fs.readFileSync(surveysPath, 'utf8');
        let surveysList = [];
        try {
          surveysList = JSON.parse(contents);
        } catch (e) {
          console.error('JSON parse error, resetting surveys file');
          surveysList = [];
        }

        const initialLength = surveysList.length;
        surveysList = surveysList.filter((s: any) => String(s.id) !== String(id));
        
        fs.writeFileSync(surveysPath, JSON.stringify(surveysList, null, 2), 'utf8');
        console.log(`Deleted application survey ${id}. Count: ${initialLength} -> ${surveysList.length}`);
        return NextResponse.json({ success: true, id });
      }
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (err) {
    console.error('Application Survey DELETE Error:', err);
    return NextResponse.json({ 
      error: 'Failed to delete surveys', 
      details: err instanceof Error ? err.message : String(err) 
    }, { 
      status: 500,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  }
}
