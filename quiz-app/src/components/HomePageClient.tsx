"use client";

import Link from 'next/link';

interface Quiz {
  id: number;
  title: string;
}

export default function HomePageClient({ quizzes }: { quizzes: Quiz[] }) {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-8 sm:py-12 px-4 flex flex-col items-center justify-center">
      
      <div className="max-w-4xl w-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 text-center p-6 sm:p-12 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 sm:mb-8">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight mb-8 leading-tight break-keep">
          관리감독자 역량강화 평가
        </h1>

        {/* 배너 섹션 (세로로 동일한 크기로 배열) */}
        <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-10 text-left">
          
          {/* 시험 응시 배너 */}
          <Link href="/quizzes" className="block w-full rounded-2xl sm:rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-5 sm:p-8 text-white shadow-lg hover:shadow-violet-500/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-2xl font-black mb-1 flex items-center leading-tight break-keep shadow-sm">
                  <span className="bg-white/20 p-2 rounded-xl mr-3">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </span>
                  시험 보기 (과목 선택)
                </h3>
                <p className="text-violet-100 text-xs sm:text-sm font-medium leading-relaxed break-keep ml-2 mt-2 sm:mt-0">
                  관리감독자 역량강화 평가를 지금 시작하세요
                </p>
              </div>
              <div className="bg-white/20 rounded-full p-3 sm:p-4 group-hover:bg-white/30 group-hover:translate-x-2 transition-all shadow-sm">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </div>
            </div>
          </Link>

          {/* 설문조사 배너 */}
          <Link href="/survey" className="block w-full rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 p-5 sm:p-8 text-white shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-2xl font-black mb-1 flex items-center leading-tight break-keep shadow-sm">
                  <span className="bg-white/20 p-2 rounded-xl mr-3">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                  </span>
                  교육 만족도 조사
                </h3>
                <p className="text-emerald-50 text-xs sm:text-sm font-medium leading-relaxed break-keep ml-2 mt-2 sm:mt-0">
                  더 나은 교육을 위한 소중한 의견
                </p>
              </div>
              <div className="bg-white/20 rounded-full p-3 sm:p-4 group-hover:bg-white/30 group-hover:translate-x-2 transition-all shadow-sm">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </div>
            </div>
          </Link>

          {/* 자료실 배너 (구글 드라이브 연동) */}
          <a 
            href="https://drive.google.com/drive/folders/1bSqYZAPKSFnT01Atyr-w5YWh1K9wHBQ5" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 sm:p-8 text-white shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-2xl font-black mb-1 flex items-center leading-tight break-keep shadow-sm">
                  <span className="bg-white/20 p-2 rounded-xl mr-3">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                  </span>
                  학습 자료실
                </h3>
                <p className="text-blue-50 text-xs sm:text-sm font-medium leading-relaxed break-keep ml-2 mt-2 sm:mt-0">
                  안전보건 교육 자료 및 가이드라인
                </p>
              </div>
              <div className="bg-white/20 rounded-full p-3 sm:p-4 group-hover:bg-white/30 group-hover:translate-x-2 transition-all shadow-sm">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </div>
            </div>
          </a>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-slate-100">
          <Link href="/admin" className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-3 bg-slate-50 text-slate-500 rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-100 transition-colors">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            관리자 모드 접속
          </Link>
        </div>
      </div>
    </div>
  );
}
