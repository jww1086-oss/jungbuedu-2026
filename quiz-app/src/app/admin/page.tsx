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
  const [applicationSurveys, setApplicationSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'quiz' | 'survey' | 'application_survey'>('quiz');
  const [selectedQuizId, setSelectedQuizId] = useState<number | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState<string | 'all'>('all');
  const [selectedAppDept, setSelectedAppDept] = useState<string | 'all'>('all');
  const [selectedAppPosition, setSelectedAppPosition] = useState<string | 'all'>('all');
  const [selectedAppExp, setSelectedAppExp] = useState<string | 'all'>('all');
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'result' | 'survey' | 'application_survey' | 'resetResults' | 'resetSurveys' | 'resetAppSurveys', id?: number | string } | null>(null);

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
      const [resResults, resSurveys, resAppSurveys] = await Promise.all([
        fetch(`/api/results?t=${timestamp}`, { cache: 'no-store' }),
        fetch(`/api/survey?t=${timestamp}`, { cache: 'no-store' }),
        fetch(`/api/application-survey?t=${timestamp}`, { cache: 'no-store' })
      ]);
      const dataResults = await resResults.json();
      const dataSurveys = await resSurveys.json();
      const dataAppSurveys = await resAppSurveys.json();
      setResults(Array.isArray(dataResults) ? dataResults.reverse() : []);
      setSurveys(Array.isArray(dataSurveys) ? dataSurveys.reverse() : []);
      setApplicationSurveys(Array.isArray(dataAppSurveys) ? dataAppSurveys.reverse() : []);
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

  const executeDeleteAppSurvey = async (id: number | string) => {
    try {
      const res = await fetch(`/api/application-survey?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setApplicationSurveys((prev) => prev.filter(s => String(s.id) !== String(id)));
      } else {
        const errorData = await res.json().catch(() => ({ error: '알 수 없는 서버 오류' }));
        alert(`삭제 실패: ${errorData.error || res.statusText}`);
      }
    } catch (e) {
      alert('통신 오류가 발생했습니다. 네트워크 상태를 확인해 주세요.');
    }
  };

  const executeResetAppSurveys = async () => {
    try {
      const res = await fetch(`/api/application-survey?action=reset`, { method: 'DELETE' });
      if (res.ok) {
        setApplicationSurveys([]);
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
  const handleDeleteAppSurvey = (id: number | string) => setDeleteTarget({ type: 'application_survey', id });
  const handleResetResults = () => setDeleteTarget({ type: 'resetResults' });
  const handleResetSurveys = () => setDeleteTarget({ type: 'resetSurveys' });
  const handleResetAppSurveys = () => setDeleteTarget({ type: 'resetAppSurveys' });

  const confirmAction = () => {
    if (!deleteTarget) return;
    switch (deleteTarget.type) {
      case 'result': executeDeleteResult(deleteTarget.id!); break;
      case 'survey': executeDeleteSurvey(deleteTarget.id!); break;
      case 'application_survey': executeDeleteAppSurvey(deleteTarget.id!); break;
      case 'resetResults': executeResetResults(); break;
      case 'resetSurveys': executeResetSurveys(); break;
      case 'resetAppSurveys': executeResetAppSurveys(); break;
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

  // 유니크 값 추출 및 필터링
  const uniqueAppDepts = Array.from(new Set(applicationSurveys.map(s => s.department).filter(Boolean))).sort();
  const uniqueAppPositions = Array.from(new Set(applicationSurveys.map(s => s.position).filter(Boolean))).sort();
  const uniqueAppExps = Array.from(new Set(applicationSurveys.map(s => s.experience).filter(Boolean))).sort((a: any, b: any) => Number(a) - Number(b));

  const filteredAppSurveys = applicationSurveys.filter(s => {
    const matchDept = selectedAppDept === 'all' || String(s.department).trim() === String(selectedAppDept).trim();
    const matchPos = selectedAppPosition === 'all' || String(s.position).trim() === String(selectedAppPosition).trim();
    const matchExp = selectedAppExp === 'all' || String(s.experience).trim() === String(selectedAppExp).trim();
    return matchDept && matchPos && matchExp;
  });

  // 현업적용도 평가 분석 통계 계산
  const appSurveyStats = {
    ratings: { q2_1: 0, q2_2: 0, q2_3: 0, q2_4: 0, count: 0 },
    changes: {} as Record<string, number>,
    barriers: {} as Record<string, number>,
  };

  filteredAppSurveys.forEach(s => {
    if (s.ratings) {
      if (s.ratings.q2_1) { appSurveyStats.ratings.q2_1 += Number(s.ratings.q2_1); appSurveyStats.ratings.count++; }
      if (s.ratings.q2_2) { appSurveyStats.ratings.q2_2 += Number(s.ratings.q2_2); }
      if (s.ratings.q2_3) { appSurveyStats.ratings.q2_3 += Number(s.ratings.q2_3); }
      if (s.ratings.q2_4) { appSurveyStats.ratings.q2_4 += Number(s.ratings.q2_4); }
    }
    
    // Fallback names check
    const changes = s.q3Changes || s.q3_changes || [];
    if (Array.isArray(changes)) {
      changes.forEach(c => {
        appSurveyStats.changes[c] = (appSurveyStats.changes[c] || 0) + 1;
      });
    }

    const barriers = s.q4Barriers || s.q4_barriers || [];
    if (Array.isArray(barriers)) {
      barriers.forEach(b => {
        appSurveyStats.barriers[b] = (appSurveyStats.barriers[b] || 0) + 1;
      });
    }
  });

  const appRatingsCount = appSurveyStats.ratings.count || 1;
  const avgAppRatings = [
    { label: "법령/규정 지식 필수성", avg: (appSurveyStats.ratings.q2_1 / appRatingsCount).toFixed(1) },
    { label: "실습 커리큘럼 도움", avg: (appSurveyStats.ratings.q2_2 / appRatingsCount).toFixed(1) },
    { label: "디지털 도구/AI 유용성", avg: (appSurveyStats.ratings.q2_3 / appRatingsCount).toFixed(1) },
    { label: "전문가 사례 공유 도움", avg: (appSurveyStats.ratings.q2_4 / appRatingsCount).toFixed(1) }
  ];

  const sortedChanges = Object.entries(appSurveyStats.changes).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
  const sortedBarriers = Object.entries(appSurveyStats.barriers).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);

  // 과목별/문항별 정답률 통계 계산 (현재 필터링된 결과 기준)
  const questionStatsByQuiz = filteredResults.reduce((acc, r) => {
    if (!acc[r.quizId]) acc[r.quizId] = {};
    if (r.details && Array.isArray(r.details)) {
      r.details.forEach((d: any, index: number) => {
        const qNum = index + 1;
        if (!acc[r.quizId][qNum]) acc[r.quizId][qNum] = { correct: 0, total: 0 };
        acc[r.quizId][qNum].total += 1;
        if (d.isCorrect) acc[r.quizId][qNum].correct += 1;
      });
    }
    return acc;
  }, {} as Record<string, Record<number, { correct: number, total: number }>>);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">관리자 대시보드</h1>
          <p className="text-slate-500 mt-2">안전교육 플랫폼의 통합 운영 현황을 관리합니다.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border shadow-sm print:hidden overflow-x-auto text-nowrap">
          <button 
            onClick={() => setActiveTab('quiz')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'quiz' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            시험 응시 결과
          </button>
          <button 
            onClick={() => setActiveTab('survey')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'survey' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            만족도 결과
          </button>
          <button 
            onClick={() => setActiveTab('application_survey')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'application_survey' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            현업적용도 결과
          </button>
        </div>
      </div>

      {activeTab === 'quiz' && (
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

          {/* 과목/문항별 정답률 분석 (조건부 렌더링) */}
          {Object.keys(questionStatsByQuiz).length > 0 && (
            <div className="mb-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-5 flex items-center">
                <span className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></span>
                과목 필터링 기반 문항별 정답률
              </h3>
              <div className="space-y-6">
                {Object.entries(questionStatsByQuiz).map(([quizId, stats]) => (
                  <div key={quizId} className="border-t border-slate-100 pt-4 first:border-0 first:pt-0">
                    <h4 className="font-extrabold text-slate-700 mb-3 bg-slate-50 px-3 py-1.5 rounded-lg inline-block text-[13px] border border-slate-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                      과목 {quizId}
                    </h4>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-1.5 sm:gap-3">
                      {Object.entries(stats as any).map(([qNum, data]: [string, any]) => {
                        const rate = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                        return (
                          <div key={qNum} className="bg-white border border-slate-200 text-center py-2 sm:py-3 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
                            <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 mb-0.5 sm:mb-1">{qNum}번</div>
                            <div className={`text-sm sm:text-xl font-black tracking-tighter ${rate >= 80 ? 'text-emerald-500' : rate >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                              {rate}%
                            </div>
                            <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 tracking-tighter font-medium">{data.correct}/{data.total}명</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
      )}
      
      {activeTab === 'survey' && (
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

      {activeTab === 'application_survey' && (
        <>
          {/* 현업적용도 필터 바 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 print:hidden">
            <div className="bg-white flex items-center justify-between sm:justify-start px-4 py-2.5 rounded-xl border shadow-sm flex-1">
              <label className="text-sm font-bold text-slate-600 mr-3 whitespace-nowrap">소속 필터</label>
              <select 
                className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-indigo-500 py-1.5 px-3 font-semibold outline-none cursor-pointer flex-1 w-full"
                value={selectedAppDept}
                onChange={(e) => setSelectedAppDept(e.target.value)}
              >
                <option value="all">전체 부서</option>
                {uniqueAppDepts.map(dept => <option key={dept as string} value={dept as string}>{dept as string}</option>)}
              </select>
            </div>
            <div className="bg-white flex items-center justify-between sm:justify-start px-4 py-2.5 rounded-xl border shadow-sm flex-1">
              <label className="text-sm font-bold text-slate-600 mr-3 whitespace-nowrap">직책 필터</label>
              <select 
                className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-indigo-500 py-1.5 px-3 font-semibold outline-none cursor-pointer flex-1 w-full"
                value={selectedAppPosition}
                onChange={(e) => setSelectedAppPosition(e.target.value)}
              >
                <option value="all">전체 직책</option>
                {uniqueAppPositions.map(pos => <option key={pos as string} value={pos as string}>{pos as string}</option>)}
              </select>
            </div>
            <div className="bg-white flex items-center justify-between sm:justify-start px-4 py-2.5 rounded-xl border shadow-sm flex-1">
              <label className="text-sm font-bold text-slate-600 mr-3 whitespace-nowrap">경력 필터</label>
              <select 
                className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-indigo-500 py-1.5 px-3 font-semibold outline-none cursor-pointer flex-1 w-full"
                value={selectedAppExp}
                onChange={(e) => setSelectedAppExp(e.target.value)}
              >
                <option value="all">전체 경력</option>
                {uniqueAppExps.map(exp => <option key={exp as string} value={exp as string}>{exp as string}년</option>)}
              </select>
            </div>
          </div>

          {/* 현업적용도 평가 통계 섹션 */}
          <div className="grid grid-cols-1 mb-8">
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">필터링된 분석 인원</p>
                <h4 className="text-5xl font-black">{filteredAppSurveys.length}명</h4>
              </div>
              <div className="pt-6 border-t border-white/10 mt-6 flex flex-col sm:flex-row gap-3 print:hidden">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-sm font-bold transition-colors border border-indigo-400 shadow-md flex justify-center items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  PDF 결과지 내보내기
                </button>
                <button 
                  onClick={handleResetAppSurveys}
                  className="w-full sm:w-auto py-3 bg-red-500/20 hover:bg-red-500/40 text-red-100 rounded-xl text-sm font-bold transition-colors border border-red-500/30 px-6"
                >
                  설문 전체 초기화
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <h3 className="p-6 border-b border-slate-100 text-lg sm:text-xl font-bold text-slate-800 flex items-center justify-between">
              항목별 종합 분석
            </h3>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 실무 관련성 평가 */}
              <div>
                <h4 className="font-bold text-slate-700 mb-4 flex items-center">
                  <span className="w-1.5 h-4 bg-indigo-500 rounded-full mr-2"></span>
                  1. 실무 관련성 및 유용성 (평균 점수)
                </h4>
                <div className="space-y-4">
                  {avgAppRatings.map((stat, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold text-slate-600">{stat.label}</span>
                        <span className="text-indigo-600 font-bold">{filteredAppSurveys.length > 0 ? stat.avg : 0}점</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-indigo-400 to-purple-500 h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${(filteredAppSurveys.length > 0 ? Number(stat.avg) : 0) / 5 * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 행동 변화 및 장애 요인 */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-slate-700 mb-3 flex items-center">
                    <span className="w-1.5 h-4 bg-emerald-500 rounded-full mr-2"></span>
                    2. 현업 적용 및 행동 변화 (응답 빈도)
                  </h4>
                  {sortedChanges.length > 0 ? (
                    <ul className="space-y-2">
                      {sortedChanges.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center text-sm p-2 bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-lg">
                          <span className="truncate pr-2 font-medium">{item.label}</span>
                          <span className="font-bold bg-white px-2 py-0.5 rounded-md text-emerald-700 shadow-sm whitespace-nowrap">{item.count}명</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">응답 데이터가 없습니다.</p>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-slate-700 mb-3 flex items-center">
                    <span className="w-1.5 h-4 bg-amber-500 rounded-full mr-2"></span>
                    3. 현업 적용 장애 요인 (응답 빈도)
                  </h4>
                  {sortedBarriers.length > 0 ? (
                    <ul className="space-y-2">
                      {sortedBarriers.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center text-sm p-2 bg-amber-50 border border-amber-100 text-amber-900 rounded-lg">
                          <span className="truncate pr-2 font-medium">{item.label}</span>
                          <span className="font-bold bg-white px-2 py-0.5 rounded-md text-amber-700 shadow-sm whitespace-nowrap">{item.count}명</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">응답 데이터가 없습니다.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <h3 className="p-6 border-b border-slate-100 text-lg sm:text-xl font-bold text-slate-800 flex items-center justify-between">
              평가 응답 상세
              <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{filteredAppSurveys.length}건</span>
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                    <th className="px-6 py-4">부서/직책</th>
                    <th className="px-6 py-4">경력</th>
                    <th className="px-6 py-4">건의사항 요약 (Q5_1)</th>
                    <th className="px-6 py-4">일시</th>
                    <th className="px-6 py-4 text-center print:hidden">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">불러오는 중...</td></tr>
                  ) : filteredAppSurveys.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">조회된 평가가 없습니다.</td></tr>
                  ) : (
                    filteredAppSurveys.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{s.department} {s.position && `(${s.position})`}</td>
                        <td className="px-6 py-4 text-slate-600 text-sm">{s.experience}년</td>
                        <td className="px-6 py-4 text-slate-600 text-sm max-w-xs truncate print:whitespace-normal print:break-words print:max-w-none">{s.suggestions?.q5_1 || '-'}</td>
                        <td className="px-6 py-4 text-slate-500 text-sm">{new Date(s.createdAt).toLocaleDateString('ko-KR')}</td>
                        <td className="px-6 py-4 text-center print:hidden">
                          <button onClick={() => handleDeleteAppSurvey(s.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold px-3 py-1 bg-red-50 rounded-lg transition-colors border border-red-100">삭제</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* 모바일 뷰 카드 */}
            <div className="md:hidden p-4 space-y-4 bg-slate-50/50">
              {loading ? (
                <div className="text-center text-slate-400 py-8 animate-pulse">불러오는 중...</div>
              ) : filteredAppSurveys.length === 0 ? (
                <div className="text-center text-slate-400 py-8">조회된 평가가 없습니다.</div>
              ) : (
                filteredAppSurveys.map((s) => (
                  <div key={s.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4 relative">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <span className="font-extrabold text-slate-900 text-base">{s.department} {s.position && `(${s.position})`}</span>
                      <span className="text-xs font-semibold text-slate-400">{new Date(s.createdAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[11px] font-bold text-indigo-600 mb-1">건의사항 요약</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{s.suggestions?.q5_1 || <span className="text-slate-400 italic">미응답</span>}</p>
                      </div>
                    </div>

                    <div className="mt-2 pt-3 border-t border-slate-100 flex justify-end">
                      <button 
                        onClick={() => handleDeleteAppSurvey(s.id)} 
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

