export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createPool } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

const surveysPath = path.join(process.cwd(), 'data', 'surveys.json');

const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const hasDbConfig = !!dbUrl;

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
      return NextResponse.json(surveys);
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
      if (fs.existsSync(surveysPath)) {
        if (action === 'reset') {
          fs.writeFileSync(surveysPath, JSON.stringify([], null, 2), 'utf8');
          return NextResponse.json({ success: true, message: 'All surveys deleted' });
        } else if (id) {
          const contents = fs.readFileSync(surveysPath, 'utf8');
          let surveysList = JSON.parse(contents);
          surveysList = surveysList.filter((s: any) => s.id !== Number(id) && s.id !== id);
          fs.writeFileSync(surveysPath, JSON.stringify(surveysList, null, 2), 'utf8');
          return NextResponse.json({ success: true, id });
        }
      }
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (err) {
    console.error('Survey DELETE Error:', err);
    return NextResponse.json({ error: 'Failed to delete surveys' }, { status: 500 });
  }
}
