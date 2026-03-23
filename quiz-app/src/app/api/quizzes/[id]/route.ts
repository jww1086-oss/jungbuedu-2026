export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const filePath = path.join(process.cwd(), 'data', 'quizzes.json');
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const quizzes = JSON.parse(fileContents);
    const quiz = quizzes.find((q: any) => q.id === parseInt(id));

    if (quiz) {
      return NextResponse.json(quiz);
    } else {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}
