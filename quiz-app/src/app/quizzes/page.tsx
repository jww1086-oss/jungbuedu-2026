import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default async function QuizzesPage() {
  const quizzesPath = path.join(process.cwd(), 'data', 'quizzes.json');
  let quizzes: any[] = [];
  try {
    quizzes = JSON.parse(fs.readFileSync(quizzesPath, 'utf8'));
  } catch (e) {
    console.error('Failed to load quizzes:', e);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-semibold bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 hover:shadow-md">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            홈으로 돌아가기
          </Link>
        </div>
        
        {/* 헤더 섹션 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-50 rounded-full blur-2xl opacity-60"></div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tight flex items-center">
            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-xl mr-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            </span>
            시험 과목 선택
          </h1>
          <p className="text-slate-500 text-lg ml-2 font-medium">관리감독자 평가를 진행할 과목을 확인하고 선택해 주세요.</p>
        </div>

        {/* 과목 리스트 그리드 */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, index) => (
            <Link 
              key={quiz.id} 
              href={`/quiz/${quiz.id}`} 
              className="group flex flex-col justify-between p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500 hover:-translate-y-2 transition-all duration-300 min-h-[180px] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-slate-100 group-hover:bg-indigo-500 transition-colors"></div>
              
              <div>
                <div className="text-sm font-bold text-indigo-500 mb-2 tracking-wide">
                  과제 {index + 1}
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors break-keep leading-snug">
                  {quiz.title}
                </h3>
              </div>
              
              <div className="mt-6 flex justify-end">
                <span className="inline-flex items-center px-4 py-2 bg-slate-50 text-slate-600 text-sm font-bold rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-indigo-200">
                  응시 시작하기
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
        
      </div>
    </div>
  );
}
