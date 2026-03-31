"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SurveyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const courses = [
    { id: "c1", name: "발전산업 안전대책", desc: "중대재해 사례 숙지, 산업안전 및 사고 예방, 작업환경 관리" },
    { id: "c2", name: "명사 특강", desc: "안전경영과 리더십" },
    { id: "c3", name: "산업안전 Ⅰ·Ⅱ (체험)", desc: "VR추락, 비계전도, 굴착기, 비계발판 빠짐, 스마트 건설 등 체험" },
    { id: "c4", name: "응급처치 (체험)", desc: "심폐소생술(심장압박 및 제세동), 부목, 인공호흡, 붕대 감기" },
    { id: "c5", name: "산업안전 Ⅲ (체험)", desc: "안전화·안전모·보안경 충격 체험, 밀폐공간 질식, 온열질환 등" },
    { id: "c6", name: "가상안전·VR", desc: "거푸집 무너짐, 하역운반기계, 타워크레인 추락, 근골격계 체험 등" },
    { id: "c7", name: "중처법 대응", desc: "중대재해처벌법 대응 방안, 안전보건관리체계 구축, TBM 등" },
    { id: "c8", name: "중부발전 이끄미", desc: "안전문화 수준 향상 방안, 사내 전문가 노하우 전수" },
    { id: "c9", name: "관리감독자 역할", desc: "관리감독자의 역할과 책임, 위험성평가 현장 작동성 강화" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      alert("설문이 성공적으로 제출되었습니다. 소중한 의견 감사드립니다!");
      router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-700">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-8 sm:p-10 text-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <Link href="/" className="inline-flex items-center text-emerald-50 hover:text-white mb-6 transition-colors text-sm font-medium">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            홈으로 돌아가기
          </Link>
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight drop-shadow-sm">
              [교육 만족도 조사] 안전보건 교육 프로그램
            </h1>
            <p className="text-emerald-50 leading-relaxed text-lg mb-2">
              본 설문지는 실시된 안전 교육에 대한 귀하의 의견을 수렴하여 향후 더 나은 교육 서비스를 제공하기 위해 작성되었습니다.
            </p>
            <p className="font-semibold text-white/90">
              바쁘시더라도 성실한 답변 부탁드립니다.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-12">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold border-b-2 border-emerald-500 pb-3 mb-6 text-slate-800 flex items-center">
              <span className="bg-emerald-100 text-emerald-800 w-8 h-8 rounded-full inline-flex items-center justify-center text-sm mr-3">1</span>
              기본 정보
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">부서/직급</label>
                <input required type="text" placeholder="예: 안전관리부 / 대리" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">교육 일자</label>
                <input required type="date" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" defaultValue="2026-01-01" />
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold border-b-2 border-emerald-500 pb-3 mb-6 text-slate-800 flex items-center">
              <span className="bg-emerald-100 text-emerald-800 w-8 h-8 rounded-full inline-flex items-center justify-center text-sm mr-3">2</span>
              교육 과정별 만족도
            </h2>
            <p className="text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              귀하께서 수강하신 각 교육 과정에 대해 얼마나 만족하십니까?<br/>
              <span className="font-semibold text-emerald-700">(5점 척도: 5 매우만족, 4 만족, 3 보통, 2 불만족, 1 매우불만족)</span>
            </p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="py-4 px-4 text-left font-bold w-1/4">교육 과정</th>
                    <th className="py-4 px-4 text-left font-bold w-1/2">주요 내용</th>
                    <th className="py-4 px-4 text-center font-bold w-1/4">만족도 (5~1)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 font-semibold text-slate-800 align-middle">{course.name}</td>
                      <td className="py-4 px-4 text-sm text-slate-600 align-middle leading-relaxed">{course.desc}</td>
                      <td className="py-4 px-4 align-middle">
                        <div className="flex justify-center space-x-2 sm:space-x-3">
                          {[5, 4, 3, 2, 1].map((val) => (
                            <label key={val} className="flex flex-col items-center cursor-pointer group">
                              <input required type="radio" name={`rating_${course.id}`} value={val} className="peer sr-only" />
                              <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-slate-300 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 peer-checked:text-white text-slate-400 group-hover:border-emerald-400 transition-all font-medium text-sm">
                                {val}
                              </div>
                            </label>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold border-b-2 border-emerald-500 pb-3 mb-6 text-slate-800 flex items-center">
              <span className="bg-emerald-100 text-emerald-800 w-8 h-8 rounded-full inline-flex items-center justify-center text-sm mr-3">3</span>
              종합 의견
            </h2>
            
            <div className="space-y-8">
              {/* Q1 */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <p className="font-bold text-slate-800 mb-4 text-lg">Q1. 이번 교육의 구성과 시간 배분(이론 및 체험)은 적절했습니까?</p>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  {['매유 적절', '적절', '보통', '미흡', '매우 미흡'].map((val, idx) => (
                    <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                      <input required type="radio" name="q1" value={val} className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-slate-300" />
                      <span className="text-slate-700 font-medium">{val}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q2 */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <p className="font-bold text-slate-800 mb-4 text-lg">Q2. 가장 도움이 되었거나 기억에 남는 교육 과정은 무엇입니까? <span className="text-emerald-600 text-sm font-normal">(자유롭게 작성)</span></p>
                <textarea required rows={3} placeholder="여기에 의견을 작성해 주세요..." className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow resize-none"></textarea>
              </div>

              {/* Q3 */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <p className="font-bold text-slate-800 mb-4 text-lg">Q3. 체험형 교육(VR, 장비 체험 등)이 현장 실무 안전에 어느 정도 도움이 된다고 생각하십니까?</p>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  {['매우 큰 도움', '도움됨', '보통', '도움 안 됨', '전혀 도움 안 됨'].map((val, idx) => (
                    <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                      <input required type="radio" name="q3" value={val} className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-slate-300" />
                      <span className="text-slate-700 font-medium">{val}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q4 */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <p className="font-bold text-slate-800 mb-4 text-lg">Q4. 교육 시설 및 제반 환경(강의실, 기자재, 다과 등)에 대해 만족하십니까?</p>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  {['매우 만족', '만족', '보통', '불만족', '매우 불만족'].map((val, idx) => (
                    <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                      <input required type="radio" name="q4" value={val} className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-slate-300" />
                      <span className="text-slate-700 font-medium">{val}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q5 */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <p className="font-bold text-slate-800 mb-4 text-lg">Q5. 향후 교육에 추가되기를 희망하는 주제나 개선사항이 있다면 작성해 주십시오.</p>
                <textarea required rows={4} placeholder="여기에 자유롭게 의견을 작성해 주세요..." className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow resize-none"></textarea>
              </div>

            </div>
          </section>

          <div className="pt-8 border-t border-slate-200 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-12 py-4 rounded-xl text-lg font-bold text-white shadow-lg transition-all duration-300 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-1'}`}
            >
              {isSubmitting ? '제출 중...' : '만족도 조사 제출하기'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
