"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MobilePreviewPage() {
  const [url, setUrl] = useState("/");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-8 relative">
      <div className="absolute top-4 left-4 z-10">
        <Link href="/" className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition">
          ← PC 화면으로 돌아가기
        </Link>
      </div>
      
      <div className="mb-6 text-center z-10">
        <h1 className="text-2xl font-black text-slate-800 mb-2">📱 완벽한 모바일 시뮬레이터</h1>
        <p className="text-slate-600 font-medium">실제 스마트폰 해상도(375px)와 동일한 비율로 렌더링됩니다.</p>
        
        <div className="mt-4 flex gap-3 justify-center">
          <button 
            onClick={() => setUrl("/")}
            className={`px-5 py-2 rounded-xl font-bold transition-all shadow-sm ${url === "/" ? "bg-indigo-600 text-white ring-2 ring-indigo-300" : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"}`}
          >
            홈 화면
          </button>
          <button 
            onClick={() => setUrl("/admin")}
            className={`px-5 py-2 rounded-xl font-bold transition-all shadow-sm ${url === "/admin" ? "bg-indigo-600 text-white ring-2 ring-indigo-300" : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"}`}
          >
            관리자 모드
          </button>
        </div>
      </div>

      {/* 아이폰 프레임 */}
      <div className="relative w-[375px] h-[812px] bg-slate-900 border-[14px] border-slate-900 rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_0_2px_#334155] overflow-hidden">
        {/* 노치 디자인 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[28px] bg-slate-900 rounded-b-3xl z-50 flex items-center justify-center">
          <div className="w-10 h-1 bg-slate-800 rounded-full mt-1"></div>
        </div>
        
        <iframe 
          src={url} 
          className="w-full h-full border-none bg-slate-50 rounded-[2rem]"
          title="Mobile Simulator"
        />
      </div>
    </div>
  );
}
