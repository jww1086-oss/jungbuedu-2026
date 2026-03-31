"use client";

import { useState } from 'react';
import Link from 'next/link';

interface Quiz {
  id: number;
  title: string;
}

export default function HomePageClient({ quizzes }: { quizzes: Quiz[] }) {
  const [isMobileView, setIsMobileView] = useState(false);

  return (
    <div className={`min-h-[calc(100vh-140px)] transition-all duration-500 bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4 flex flex-col items-center justify-center ${isMobileView ? 'bg-slate-200' : ''}`}>
      
      {/* 모바일 미리보기 토글 버튼 */}
      <div className="fixed bottom-8 right-8 z-[100] animate-bounce hover:animate-none">
        <button
          onClick={() => setIsMobileView(!isMobileView)}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold shadow-2xl transition-all duration-300 ${isMobileView ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-slate-900 text-white hover:shadow-indigo-500/40 hover:-translate-y-1'}`}
        >
          {isMobileView ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              전체 화면으로 보기
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              모바일 미리보기
            </>
          )}
        </button>
      </div>

      <div className={`transition-all duration-700 ease-in-out relative ${isMobileView ? 'w-[375px] h-[750px] overflow-y-auto bg-white rounded-[3rem] border-[12px] border-slate-900 shadow-[0_0_0_4px_rgba(0,0,0,0.1),0_50px_100px_-20px_rgba(0,0,0,0.5)] scrollbar-hide' : 'max-w-4xl w-full'}`}>
        
        {/* 모바일 폼 팩터를 위한 노치 디자인 */}
        {isMobileView && (
          <div className="sticky top-0 left-0 right-0 h-6 bg-slate-900 z-50 flex justify-center items-end pb-1">
            <div className="w-20 h-4 bg-slate-900 rounded-b-xl border-x border-b border-white/10"></div>
          </div>
        )}

        <div className={`p-8 sm:p-12 transition-all duration-500 ${isMobileView ? 'px-6 py-10' : 'bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 text-center animate-in fade-in zoom-in-95 duration-500'}`}>
          <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-8`}>
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          
          <h1 className={`font-black text-slate-800 tracking-tight mb-4 ${isMobileView ? 'text-2xl leading-tight' : 'text-3xl sm:text-4xl'}`}>
            관리감독자 역량강화 평가
          </h1>
          <p className={`text-slate-500 mb-10 leading-relaxed ${isMobileView ? 'text-sm' : 'text-lg'}`}>
            원하시는 평가 과목을 선택하여 응시해 주세요.<br className="sm:hidden" /> (현재 {quizzes.length}과목)
          </p>

          {/* 설문조사 배너 - 모바일 글자 잘림 방지 개선 */}
          <div className="mb-10 text-left">
            <Link href="/survey" className={`block w-full rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 p-6 sm:px-10 sm:py-8 text-white shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className={`font-black mb-1 flex items-center leading-tight break-keep ${isMobileView ? 'text-lg sm:text-xl' : 'text-xl sm:text-3xl'}`}>
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 opacity-90 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                    <span>교육 만족도 조사</span>
                  </h3>
                  <p className={`text-emerald-50 font-medium leading-relaxed ${isMobileView ? 'text-[11px] sm:text-sm' : 'text-sm sm:text-base'}`}>
                    더 나은 교육을 위해 귀하의 의견을 들려주세요.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className={`bg-white/20 rounded-full p-2 sm:p-3 group-hover:bg-white/30 transition-colors shadow-sm`}>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className={`grid gap-4 sm:gap-6 mb-10 text-center ${isMobileView ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
            {quizzes.map((quiz) => (
              <Link key={quiz.id} href={`/quiz/${quiz.id}`} className="group flex items-center justify-center py-8 sm:py-10 px-4 sm:px-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300">
                <h3 className={`font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors ${isMobileView ? 'text-xl' : 'text-2xl sm:text-3xl'}`}>
                  {quiz.title}
                </h3>
              </Link>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-100">
            <Link href="/admin" className="inline-flex items-center justify-center px-5 py-3 bg-slate-50 text-slate-500 rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-100 transition-colors">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              관리자 모드 접속
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
