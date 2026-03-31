"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ApplicationSurveyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Q3 Checkboxes extraction
    const q3Answers = [];
    if (formData.get("q3_1")) q3Answers.push("위험성평가 체계적 실시");
    if (formData.get("q3_2")) q3Answers.push("TBM 시 구체적 안전메시지 전달");
    if (formData.get("q3_3")) q3Answers.push("디지털 도구 활용 빈도 증가");
    if (formData.get("q3_4")) q3Answers.push("불안전 행동 즉시 시정 조치");
    if (formData.get("q3_5")) q3Answers.push("관리감독자 책임감 증대");

    // Q4 Checkboxes extraction
    const q4Answers = [];
    if (formData.get("q4_1")) q4Answers.push("업무 과다로 인한 시간 부족");
    if (formData.get("q4_2")) q4Answers.push("부서원들의 협조 부족");
    if (formData.get("q4_3")) q4Answers.push("예산이나 장비 부족");
    if (formData.get("q4_4")) q4Answers.push("교육과 현장 상황 간의 괴리");
    if (formData.get("q4_5")) q4Answers.push("상급자 관심 부족 및 안전 문화 미비");
    if (formData.get("q4_etc")) q4Answers.push(`기타: ${formData.get("q4_etc_text")}`);

    const data = {
      department: formData.get("department"),
      position: formData.get("position"),
      experience: formData.get("experience"),
      ratings: {
        q2_1: Number(formData.get("q2_1")),
        q2_2: Number(formData.get("q2_2")),
        q2_3: Number(formData.get("q2_3")),
        q2_4: Number(formData.get("q2_4")),
      },
      q3_changes: q3Answers,
      q4_barriers: q4Answers,
      suggestions: {
        q5_1: formData.get("q5_1"),
        q5_2: formData.get("q5_2"),
      },
    };

    try {
      const res = await fetch("/api/application-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("설문이 성공적으로 제출되었습니다. 소중한 의견 감사드립니다!");
        router.push("/");
      } else {
        alert("설문 제출 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("통신 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-700">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 sm:p-10 text-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <Link href="/survey" className="inline-flex items-center text-indigo-100 hover:text-white mb-6 transition-colors text-sm font-medium">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            설문조사 선택으로 돌아가기
          </Link>
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-black mb-4 tracking-tight drop-shadow-sm">
              [한국중부발전] 관리감독자 안전보건교육 현업적용도 설문조사
            </h1>
            <p className="text-indigo-50 leading-relaxed text-[15px] sm:text-base mb-2">
              본 설문은 관리감독자 교육 이수 후, 교육 내용이 실제 현업 업무 수행에 얼마나 도움이 되고 있는지를 파악하여 향후 더 나은 교육 프로그램을 기획하기 위한 목적으로 실시됩니다.
            </p>
            <p className="font-semibold text-white/90 text-sm">
              귀하의 소중한 답변은 통계 목적으로만 활용되오니 솔직한 의견을 부탁드립니다.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-12">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold border-b-2 border-indigo-500 pb-3 mb-6 text-slate-800 flex items-center">
              <span className="bg-indigo-100 text-indigo-800 w-8 h-8 rounded-full inline-flex items-center justify-center text-sm mr-3">1</span>
              기본 정보
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">소속 부서</label>
                <input required name="department" type="text" placeholder="예: 안전관리부" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">직책</label>
                <input required name="position" type="text" placeholder="예: 팀장, 파트장, 감독관 등" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">안전 관리 경력 (년)</label>
                <input required name="experience" type="number" min="0" placeholder="예: 5" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold border-b-2 border-indigo-500 pb-3 mb-6 text-slate-800 flex items-center">
              <span className="bg-indigo-100 text-indigo-800 w-8 h-8 rounded-full inline-flex items-center justify-center text-sm mr-3">2</span>
              교육 내용의 실무 관련성 및 유용성
            </h2>
            <p className="text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm">
              다음 문항에 대해 귀하의 의견과 가장 일치하는 곳에 체크해 주십시오.<br/>
              <span className="font-semibold text-indigo-700">(1: 전혀 그렇지 않다 / 2: 그렇지 않다 / 3: 보통이다 / 4: 그렇다 / 5: 매우 그렇다)</span>
            </p>

            <div className="space-y-6">
              {[
                { id: "q2_1", text: "교육에서 다룬 안전보건 법령 및 규정 지식이 내 담당 업무를 수행하는 데 필수적이다." },
                { id: "q2_2", text: "실습 중심의 교육 커리큘럼이 현장에서 발생할 수 있는 사고 예방에 실질적인 도움이 되었다." },
                { id: "q2_3", text: "AI 기반 학습 플랫폼이나 디지털 도구를 활용한 교육 내용이 스마트 안전 관리 업무에 유용했다." },
                { id: "q2_4", text: "외부 전문가(KOSHA 등)의 실무 사례 공유가 우리 현장의 위험 요인을 이해하는 데 큰 도움이 되었다." },
              ].map((q) => (
                <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <p className="font-medium text-slate-800 md:w-2/3 leading-relaxed">{q.text}</p>
                  <div className="flex justify-between md:justify-end items-center gap-2 md:gap-3 w-full md:w-auto">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <label key={val} className="flex flex-col items-center cursor-pointer group">
                        <input required type="radio" name={q.id} value={val} className="peer sr-only" />
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 border-slate-300 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 peer-checked:text-white text-slate-500 group-hover:border-indigo-400 transition-all font-bold text-sm">
                          {val}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold border-b-2 border-indigo-500 pb-3 mb-6 text-slate-800 flex items-center">
              <span className="bg-indigo-100 text-indigo-800 w-8 h-8 rounded-full inline-flex items-center justify-center text-sm mr-3">3</span>
              현업 적용 및 행동 변화
            </h2>
            <p className="text-slate-600 mb-6 font-medium text-sm">
              교육 이수 후, 실제 업무 현장에서 다음과 같은 변화가 있었습니까? (해당되는 항목에 모두 체크해 주십시오)
            </p>
            
            <div className="grid gap-3">
              {[
                { id: "q3_1", text: "교육에서 배운 내용을 바탕으로 위험성평가(정기/수시)를 이전보다 더 체계적으로 실시하고 있다." },
                { id: "q3_2", text: "작업 전 안전점검(TBM) 시, 근로자들에게 구체적이고 실질적인 안전 메시지를 전달하게 되었다." },
                { id: "q3_3", text: "디지털 도구(웹 앱 등)를 활용하여 위험 요인을 기록하고 관리하는 빈도가 늘어났다." },
                { id: "q3_4", text: "부서원들의 불안전한 행동을 발견했을 때, 교육에서 배운 소통 기법을 활용해 즉시 시정 조치한다." },
                { id: "q3_5", text: "우리 사업소의 안전 문화 정착을 위해 관리감독자로서의 책임감을 더 크게 느끼고 행동한다." }
              ].map((q) => (
                <label key={q.id} className="flex items-start space-x-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-indigo-50/50 transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    <input type="checkbox" name={q.id} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                  </div>
                  <span className="text-slate-700 font-medium leading-relaxed">{q.text}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold border-b-2 border-indigo-500 pb-3 mb-6 text-slate-800 flex items-center">
              <span className="bg-indigo-100 text-indigo-800 w-8 h-8 rounded-full inline-flex items-center justify-center text-sm mr-3">4</span>
              현업 적용 장애 요인
            </h2>
            <p className="text-slate-600 mb-6 font-medium text-sm">
              교육 내용을 실무에 적용하는 데 어려움이 있다면 무엇입니까? (복수 응답 가능)
            </p>
            
            <div className="grid gap-3">
              {[
                { id: "q4_1", text: "업무 과다로 인한 시간 부족" },
                { id: "q4_2", text: "기존 업무 방식에 익숙한 부서원들의 협조 부족" },
                { id: "q4_3", text: "실무 적용을 위한 예산이나 장비(IT 기기 등)의 부족" },
                { id: "q4_4", text: "교육 내용과 실제 현장 상황 간의 괴리" },
                { id: "q4_5", text: "상급자의 관심 부족 및 조직 내 안전 문화 미비" }
              ].map((q) => (
                <label key={q.id} className="flex items-center space-x-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-indigo-50/50 transition-colors">
                  <input type="checkbox" name={q.id} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                  <span className="text-slate-700 font-medium">{q.text}</span>
                </label>
              ))}
              
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 p-4 border border-slate-200 rounded-xl">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" name="q4_etc" className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                  <span className="text-slate-700 font-medium whitespace-nowrap">기타</span>
                </label>
                <input type="text" name="q4_etc_text" placeholder="기타 의견을 적어주세요" className="flex-1 w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold border-b-2 border-indigo-500 pb-3 mb-6 text-slate-800 flex items-center">
              <span className="bg-indigo-100 text-indigo-800 w-8 h-8 rounded-full inline-flex items-center justify-center text-sm mr-3">5</span>
              조직적 지원 및 건의사항
            </h2>
            
            <div className="space-y-8">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <p className="font-bold text-slate-800 mb-2 leading-relaxed">
                  교육 내용의 현업 적용을 높이기 위해 회사 차원에서 가장 우선적으로 지원해야 할 사항은 무엇이라고 생각하십니까? <span className="text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md text-sm font-bold ml-2">선택</span>
                </p>
                <p className="text-sm text-slate-500 mb-4">(예: 모바일 위험성평가 시스템 고도화, 주기적인 전문가 코칭, 우수 사례 포상 등)</p>
                <textarea name="q5_1" rows={3} placeholder="여기에 의견을 작성해 주세요..." className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow resize-none"></textarea>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <p className="font-bold text-slate-800 mb-4 leading-relaxed">
                  향후 관리감독자 교육에서 추가로 다루었으면 하는 주제나 보완이 필요한 부분이 있다면 자유롭게 기재해 주십시오. <span className="text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md text-sm font-bold ml-2">선택</span>
                </p>
                <textarea name="q5_2" rows={3} placeholder="여기에 자유롭게 의견을 작성해 주세요..." className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow resize-none"></textarea>
              </div>
            </div>
          </section>

          <div className="pt-8 border-t border-slate-200 flex flex-col items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-12 py-4 rounded-xl text-lg font-bold text-white shadow-lg transition-all duration-300 w-full sm:w-auto ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1'}`}
            >
              {isSubmitting ? '제출 중...' : '현업적용도 평가 제출하기'}
            </button>
            <p className="text-sm text-slate-500 mt-4 font-medium">설문에 응해 주셔서 감사합니다.</p>
          </div>

        </form>
      </div>
    </div>
  );
}
