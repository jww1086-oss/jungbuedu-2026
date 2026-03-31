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
          관리감독자 역량강화 평가
        </h1>
        <p className="text-slate-500 text-lg mb-10 leading-relaxed">
          원하시는 평가 과목을 선택하여 응시해 주세요. (현재 {quizzes.length}과목)
        </p>

        {/* 설문조사 배너 */}
        <div className="mb-10 text-left">
          <Link href="/survey" className="block w-full rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 p-8 sm:px-10 py-8 text-white shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black mb-2 flex items-center leading-none">
                  <svg className="w-8 h-8 mr-3 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                  교육 만족도 조사
                </h3>
                <p className="text-emerald-50 font-medium">
                  더 나은 교육을 위해 귀하의 소중한 의견을 들려주세요.
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="bg-white/20 rounded-full p-3 group-hover:bg-white/30 transition-colors shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 mb-10 text-center">
          {quizzes.map((quiz) => (
            <Link key={quiz.id} href={`/quiz/${quiz.id}`} className="group flex items-center justify-center py-10 px-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                {quiz.title}
              </h3>
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
