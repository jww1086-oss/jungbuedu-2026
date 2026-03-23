import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-140px)] bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-xl w-full mx-4 p-8 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 text-center transform hover:scale-[1.01] transition-all duration-300">
        <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-8 animate-pulse">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-4">
          안전관리감독자<br/>역량강화 평가
        </h1>
        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
          본 평가는 한국중부발전 관리감독자 교육의<br/>이해도 측정을 목적으로 합니다.
        </p>

        <Link href="/quiz/1" className="inline-block w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-1">
          평가 시작하기 &rarr;
        </Link>
        <div className="mt-6">
          <Link href="/admin" className="text-sm font-medium text-slate-400 hover:text-indigo-600 transition-colors">
            관리자 결과조회
          </Link>
        </div>
      </div>
    </div>
  );
}
