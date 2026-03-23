import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export default async function Home() {
  // 퀴즈 목록 로드
  const quizzesPath = path.join(process.cwd(), 'data', 'quizzes.json');
  let quizzes: any[] = [];
  try {
    quizzes = JSON.parse(fs.readFileSync(quizzesPath, 'utf8'));
  } catch (e) {
    console.error('Failed to load quizzes:', e);
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-140px)] bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl w-full mx-4 p-8 sm:p-12 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-8">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mb-4">
          안전관리감독자 역량강화 평가
        </h1>
        <p className="text-slate-500 text-lg mb-10 leading-relaxed">
          원하시는 평가 과목을 선택하여 응시해 주세요. (현재 {quizzes.length}과목)
        </p>

        <div className="grid gap-6 sm:grid-cols-2 mb-10 text-left">
          {quizzes.map((quiz) => (
            <Link key={quiz.id} href={`/quiz/${quiz.id}`} className="group relative flex flex-col p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-400 hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-8 right-8 w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                &rarr;
              </div>
              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg mb-4 w-max">
                과목 {quiz.id}
              </span>
              <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">
                {quiz.title}
              </h3>
              <p className="text-slate-500 mb-6 flex-grow line-clamp-2">
                {quiz.description}
              </p>
              <div className="text-indigo-600 font-bold border-t pt-4 mt-auto">
                이 퀴즈 풀기
              </div>
            </Link>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-100">
          <Link href="/admin" className="inline-flex items-center justify-center px-5 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors shadow-inner">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            관리자 결과조회 로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
