"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'quiz' | 'survey'>('quiz');
  const [selectedQuizId, setSelectedQuizId] = useState<number | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState<string | 'all'>('all');
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'result' | 'survey' | 'resetResults' | 'resetSurveys', id?: number | string } | null>(null);

  const courses = [
    { id: "c1", name: "발전산업 안전대책" },
    { id: "c2", name: "명사 특강" },
    { id: "c3", name: "산업안전 Ⅰ·Ⅱ (체험)" },
    { id: "c4", name: "응급처치 (체험)" },
    { id: "c5", name: "산업안전 Ⅲ (체험)" },
    { id: "c6", name: "가상안전·VR" },
    { id: "c7", name: "중처법 대응" },
    { id: "c8", name: "중부발전 이끄미" },
    { id: "c9", name: "관리감독자 역할" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const timestamp = new Date().getTime();
      const [resResults, resSurveys] = await Promise.all([
        fetch(`/api/results?t=${timestamp}`, { cache: 'no-store' }),
        fetch(`/api/survey?t=${timestamp}`, { cache: 'no-store' })
      ]);
      const dataResults = await resResults.json();
      const dataSurveys = await resSurveys.json();
      setResults(Array.isArray(dataResults) ? dataResults.reverse() : []);
      setSurveys(Array.isArray(dataSurveys) ? dataSurveys.reverse() : []);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '3151') {
      setIsAuthenticated(true);
    } else {
      setPasswordError('비밀번호가 올바르지 않습니다.');
      setPasswordInput('');
    }
  };

  const executeDeleteResult = async (id: number | string) => {
    try {
      const res = await fetch(`/api/results?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setResults((prev) => prev.filter(r => String(r.id) !== String(id)));
      } else {
        const errorData = await res.json().catch(() => ({ error: '알 수 없는 서버 오류' }));
        alert(`삭제 실패: ${errorData.error || res.statusText}`);
      }
    } catch (e) {
      alert('통신 오류가 발생했습니다. 네트워크 상태를 확인해 주세요.');
    }
  };

  const executeDeleteSurvey = async (id: number | string) => {
    try {
      const res = await fetch(`/api/survey?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSurveys((prev) => prev.filter(s => String(s.id) !== String(id)));
      } else {
        const errorData = await res.json().catch(() => ({ error: '알 수 없는 서버 오류' }));
        alert(`삭제 실패: ${errorData.error || res.statusText}`);
      }
    } catch (e) {
      alert('통신 오류가 발생했습니다. 네트워크 상태를 확인해 주세요.');
    }
  };

  const executeResetResults = async () => {
    try {
      const res = await fetch(`/api/results?action=reset`, { method: 'DELETE' });
      if (res.ok) {
        setResults([]);
        alert('모든 데이터가 초기화되었습니다.');
      } else {
        const errorData = await res.json().catch(() => ({ error: '알 수 없는 서버 오류' }));
        alert(`초기화 실패: ${errorData.error || res.statusText}`);
      }
    } catch (e) {
      alert('초기화 중 통신 오류가 발생했습니다.');
    }
  };

  const executeResetSurveys = async () => {
    try {
      const res = await fetch(`/api/survey?action=reset`, { method: 'DELETE' });
      if (res.ok) {
        setSurveys([]);
        alert('모든 데이터가 초기화되었습니다.');
      } else {
        const errorData = await res.json().catch(() => ({ error: '알 수 없는 서버 오류' }));
        alert(`초기화 실패: ${errorData.error || res.statusText}`);
      }
    } catch (e) {
      alert('초기화 중 통신 오류가 발생했습니다.');
    }
  };

  const handleDeleteResult = (id: number | string) => setDeleteTarget({ type: 'result', id });
  const handleDeleteSurvey = (id: number | string) => setDeleteTarget({ type: 'survey', id });
  const handleResetResults = () => setDeleteTarget({ type: 'resetResults' });
  const handleResetSurveys = () => setDeleteTarget({ type: 'resetSurveys' });

  const confirmAction = () => {
    if (!deleteTarget) return;
    switch (deleteTarget.type) {
      case 'result': executeDeleteResult(deleteTarget.id!); break;
      case 'survey': executeDeleteSurvey(deleteTarget.id!); break;
      case 'resetResults': executeResetResults(); break;
      case 'resetSurveys': executeResetSurveys(); break;
    }
    setDeleteTarget(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-xl font-bold mb-6 text-slate-800">관리자 인증</h2>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full px-4 py-3 mb-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-center tracking-[0.5em] text-lg"
            placeholder="****"
            maxLength={4}
            autoFocus
          />
          {passwordError && <p className="text-red-500 text-sm mb-4">{passwordError}</p>}
          <button type="submit" className="w-full bg-slate-900 text-white py-3 mt-4 rounded-xl font-bold hover:bg-slate-800 transition">
            접속하기
          </button>
        </form>
      </div>
    );
  }

  const uniqueQuizIds = Array.from(new Set(results.map(r => r.quizId))).sort((a: any, b: any) => a - b);
  const uniqueDates = Array.from(new Set(results.map(r => new Date(r.createdAt).toLocaleDateString('ko-KR')))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  const filteredResults = results.filter(r => {
    const matchQuiz = selectedQuizId === 'all' || r.quizId === selectedQuizId;
    const matchDate = selectedDate === 'all' || new Date(r.createdAt).toLocaleDateString('ko-KR') === selectedDate;
    return matchQuiz && matchDate;
  }).sort((a, b) => {
    const ratioA = a.score / a.total;
    const ratioB = b.score / b.total;
    if (ratioB !== ratioA) {
      return ratioB - ratioA; // 점수 높은 순 (내림차순)
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // 동점일 경우 최신순
  });

  // 만족도 조사 통계 계산
  const surveyStats = courses.map(course => {
    const validRatings = surveys.map(s => s.ratings?.[course.id]).filter(r => r > 0);
    const avg = validRatings.length > 0 ? validRatings.reduce((a, b) => a + b, 0) / validRatings.length : 0;
    return { ...course, avg: avg.toFixed(1), count: validRatings.length };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">관리자 대시보드</h1>
          <p className="text-slate-500 mt-2">안전교육 플랫폼의 통합 운영 현황을 관리합니다.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border shadow-sm print:hidden">
          <button 
            onClick={() => setActiveTab('quiz')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'quiz' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            시험 응시 결과
          </button>
          <button 
            onClick={() => setActiveTab('survey')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'survey' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            만족도 조사 결과
          </button>
        </div>
      </div>

      {activeTab === 'quiz' ? (
        <>
          {/* 필터 및 초기화 바 (모바일에서 세로로 깨지지 않도록 반응형 적용) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-1">
              <div className="bg-white flex items-center justify-between sm:justify-start px-4 py-2.5 rounded-xl border shadow-sm flex-1">
                <label className="text-sm font-bold text-slate-600 mr-3 whitespace-nowrap">과목 필터</label>
                <select 
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-indigo-500 py-1.5 px-3 font-semibold outline-none cursor-pointer flex-1 sm:flex-none w-full sm:w-auto"
                  value={selectedQuizId}
                  onChange={(e) => setSelectedQuizId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                >
                  <option value="all">전체 과목 보기</option>
                  {uniqueQuizIds.map(id => (
                    <option key={id} value={id}>과목 {id}</option>
                  ))}
                </select>
              </div>
              <div className="bg-white flex items-center justify-between sm:justify-start px-4 py-2.5 rounded-xl border shadow-sm flex-1">
                <label className="text-sm font-bold text-slate-600 mr-3 whitespace-nowrap">일자 필터</label>
                <select 
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-indigo-500 py-1.5 px-3 font-semibold outline-none cursor-pointer flex-1 sm:flex-none w-full sm:w-auto"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  <option value="all">전체 일자 보기</option>
                  {uniqueDates.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={handleResetResults}
                className="flex-[1.2] sm:flex-none bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-3 sm:px-5 py-2.5 rounded-xl border border-red-100 text-sm font-black transition-colors whitespace-nowrap shadow-sm text-center"
              >
                초기화
              </button>
              <div className="flex-1 sm:flex-none bg-indigo-600 px-3 sm:px-5 py-2.5 rounded-xl text-white font-black shadow-md shadow-indigo-200 whitespace-nowrap text-center text-sm">
                총 {filteredResults.length}건
              </div>
            </div>
          </div>

          {/* 데스크탑 뷰 - 테이블 형식 */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                    <th className="px-6 py-4">응시 과목</th>
                    <th className="px-6 py-4">응시자 이름</th>
                    <th className="px-6 py-4">최종 점수</th>
                    <th className="px-6 py-4">정답 수</th>
                    <th className="px-6 py-4">제출 일자</th>
                    <th className="px-6 py-4 text-center">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 animate-pulse">데이터를 불러오는 중...</td></tr>
                  ) : filteredResults.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">데이터가 없습니다.</td></tr>
                  ) : (
                    filteredResults.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4"><span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg">과목 {r.quizId}</span></td>
                        <td className="px-6 py-4 font-medium text-slate-900">{r.studentName}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            (r.score / r.total) >= 0.8 ? 'bg-green-100 text-green-800' :
                            (r.score / r.total) >= 0.6 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {Math.round((r.score / r.total) * 100)}점
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-sm">{r.score} / {r.total} 문항</td>
                        <td className="px-6 py-4 text-slate-500 text-sm">{new Date(r.createdAt).toLocaleDateString('ko-KR')}</td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => handleDeleteResult(r.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold px-3 py-1 bg-red-50 rounded-lg transition-colors border border-red-100">삭제</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 모바일 뷰 - 카드 형식 */}
          <div className="md:hidden space-y-4">
            {loading ? (
              <div className="bg-white p-6 rounded-2xl text-center text-slate-400 border border-slate-200 shadow-sm animate-pulse">데이터를 불러오는 중...</div>
            ) : filteredResults.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl text-center text-slate-400 border border-slate-200 shadow-sm">데이터가 없습니다.</div>
            ) : (
              filteredResults.map((r) => (
                <div key={r.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-3 relative">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                       <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] rounded-lg border border-indigo-100/50">과목 {r.quizId}</span>
                       <span className="font-extrabold text-slate-900 text-base">{r.studentName}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wide ${
                      (r.score / r.total) >= 0.8 ? 'bg-green-100 text-green-700 border border-green-200/50' :
                      (r.score / r.total) >= 0.6 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200/50' : 'bg-red-100 text-red-700 border border-red-200/50'
                    }`}>
                      {Math.round((r.score / r.total) * 100)}점
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium text-xs">정답 수</span>
                      <span className="font-bold text-slate-700">{r.score} <span className="text-slate-400 font-normal">/ {r.total} 문항</span></span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium text-xs">제출 일자</span>
                      <span className="font-medium text-slate-600 text-[13px]">{new Date(r.createdAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </div>

                  <div className="mt-2 pt-3 border-t border-slate-100 flex justify-end">
                    <button 
                      onClick={() => handleDeleteResult(r.id)} 
                      className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors border border-red-100"
                    >
                      기록 삭제
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          {/* 만족도 통계 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <span className="w-2 h-6 bg-emerald-500 rounded-full mr-3"></span>
                과정별 평균 만족도 (5점 만점)
              </h3>
              <div className="space-y-4">
                {surveyStats.map(stat => (
                  <div key={stat.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-slate-700">{stat.name}</span>
                      <span className="text-emerald-600 font-bold">{stat.avg}점 ({stat.count}명 참여)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${(Number(stat.avg) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">총 설문 참여 인원</p>
                <h4 className="text-5xl font-black">{surveys.length}명</h4>
              </div>
              <div className="pt-6 border-t border-white/10 mt-6 flex flex-col gap-3 print:hidden">
                <button 
                  onClick={() => window.print()}
                  className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-sm font-bold transition-colors border border-indigo-400 shadow-md flex justify-center items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  PDF 결과지 내보내기
                </button>
                <button 
                  onClick={handleResetSurveys}
                  className="w-full py-3 bg-red-500/20 hover:bg-red-500/40 text-red-100 rounded-xl text-sm font-bold transition-colors border border-red-500/30"
                >
                  설문 전체 초기화
                </button>
              </div>
            </div>
          </div>

          {/* 설문 상세 목록 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <h3 className="p-6 border-b border-slate-100 text-lg sm:text-xl font-bold text-slate-800 flex items-center justify-between">
              교육생 개별 의견 및 답변
              <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{surveys.length}건</span>
            </h3>
            
            {/* 데스크탑 뷰 - 테이블 형식 */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                    <th className="px-6 py-4">부서/직급</th>
                    <th className="px-6 py-4">기억에 남는 과정 (Q2)</th>
                    <th className="px-6 py-4">개선 및 보완 (Q5)</th>
                    <th className="px-6 py-4">일시</th>
                    <th className="px-6 py-4 text-center print:hidden">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">불러오는 중...</td></tr>
                  ) : surveys.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">제출된 설문이 없습니다.</td></tr>
                  ) : (
                    surveys.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{s.department}</td>
                        <td className="px-6 py-4 text-slate-600 text-sm max-w-xs truncate print:whitespace-normal print:break-words print:max-w-none">{s.answers?.q2 || '-'}</td>
                        <td className="px-6 py-4 text-slate-600 text-sm max-w-xs truncate print:whitespace-normal print:break-words print:max-w-none">{s.answers?.q5 || '-'}</td>
                        <td className="px-6 py-4 text-slate-500 text-sm">{new Date(s.createdAt).toLocaleDateString('ko-KR')}</td>
                        <td className="px-6 py-4 text-center print:hidden">
                          <button onClick={() => handleDeleteSurvey(s.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold px-3 py-1 bg-red-50 rounded-lg transition-colors border border-red-100">삭제</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 모바일 뷰 - 카드 형식 */}
            <div className="md:hidden p-4 space-y-4 bg-slate-50/50">
              {loading ? (
                <div className="text-center text-slate-400 py-8 animate-pulse">불러오는 중...</div>
              ) : surveys.length === 0 ? (
                <div className="text-center text-slate-400 py-8">제출된 설문이 없습니다.</div>
              ) : (
                surveys.map((s) => (
                  <div key={s.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4 relative">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <span className="font-extrabold text-slate-900 text-base">{s.department}</span>
                      <span className="text-xs font-semibold text-slate-400">{new Date(s.createdAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[11px] font-bold text-indigo-600 mb-1">기억에 남는 과정 (Q2)</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{s.answers?.q2 || <span className="text-slate-400 italic">미응답</span>}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[11px] font-bold text-teal-600 mb-1">개선 및 보완사항 (Q5)</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{s.answers?.q5 || <span className="text-slate-400 italic">미응답</span>}</p>
                      </div>
                    </div>

                    <div className="mt-2 pt-3 border-t border-slate-100 flex justify-end">
                      <button 
                        onClick={() => handleDeleteSurvey(s.id)} 
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors border border-red-100"
                      >
                        설문 삭제
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
      
      {/* 안전한 커스텀 모달 (브라우저 차단 우회) */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <span className="text-xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {deleteTarget.type.startsWith('reset') ? '정말 전부 초기화할까요?' : '정말 삭제하시겠습니까?'}
            </h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              {deleteTarget.type.startsWith('reset') 
                ? '경고: 이 작업은 되돌릴 수 없으며 모든 데이터가 영구적으로 삭제됩니다.' 
                : '이 데이터를 표에서 영구적으로 삭제합니다.'}
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                취소
              </button>
              <button 
                onClick={confirmAction}
                className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-md shadow-red-200 transition-colors"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

