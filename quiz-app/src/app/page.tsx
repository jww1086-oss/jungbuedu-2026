import fs from 'fs';
import path from 'path';
import HomePageClient from '@/components/HomePageClient';

export default async function Home() {
  // 퀴즈 목록 로드 (Server-side)
  const quizzesPath = path.join(process.cwd(), 'data', 'quizzes.json');
  let quizzes: any[] = [];
  try {
    quizzes = JSON.parse(fs.readFileSync(quizzesPath, 'utf8'));
  } catch (e) {
    console.error('Failed to load quizzes:', e);
  }

  return <HomePageClient quizzes={quizzes} />;
}

