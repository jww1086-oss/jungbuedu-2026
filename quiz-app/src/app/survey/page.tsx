import Link from 'next/link';

export default function SurveyHubPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-8 sm:py-12 px-4 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 text-center p-6 sm:p-12 animate-in fade-in zoom-in-95 duration-500">
        
        <h1 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight mb-4 leading-tight">
          설문조사 선택
        </h1>
        <p className="text-slate-600 mb-8 sm:mb-10 text-sm sm:text-base">
          참여하실 설문조사 항목을 선택해 주세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
          
          <Link href="/survey/satisfaction" className="block w-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 p-5 sm:p-8 text-white shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
            <div className="relative z-10 flex flex-col h-full">
               <div className="mb-4 sm:mb-6">
                 <span className="bg-white/20 p-2.5 sm:p-3 rounded-xl shadow-sm inline-block">
                   <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
                 </span>
               </div>
               <div>
                 <h3 className="text-xl sm:text-2xl font-black mb-1">교육 만족도 조사</h3>
                 <p className="text-emerald-50/90 text-sm mt-1">교육 프로그램, 강사, 시설 등에 대한 설문</p>
               </div>
            </div>
          </Link>

          <Link href="/survey/application" className="block w-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-5 sm:p-8 text-white shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
            <div className="relative z-10 flex flex-col h-full">
               <div className="mb-4 sm:mb-6">
                 <span className="bg-white/20 p-2.5 sm:p-3 rounded-xl shadow-sm inline-block">
                   <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                 </span>
               </div>
               <div>
                 <h3 className="text-xl sm:text-2xl font-black mb-1">현업적용도 평가</h3>
                 <p className="text-indigo-50/90 text-sm mt-1">교육 내용의 실제 업무 영향 및 현장 적용도 설문</p>
               </div>
            </div>
          </Link>

        </div>
        
        <div className="mt-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            홈으로 돌아가기
          </Link>
        </div>

      </div>
    </div>
  );
}
