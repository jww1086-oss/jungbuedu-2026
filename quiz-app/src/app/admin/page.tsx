"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'quiz' | 'survey'>('quiz');
  const [selectedQuizId, setSelectedQuizId] = useState<number | 'all'>('all');

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
      const [resResults, resSurveys] = await Promise.all([
        fetch('/api/results'),
        fetch('/api/survey')
      ]);
      const dataResults = await resResults.json();
      const dataSurveys = await resSurveys.json();
      setResults(Array.isArray(dataResults) ? dataResults.reverse() : []);
      setSurveys(Array.isArray(dataSurveys) ? dataSurveys.reverse() : []);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
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

  const handleDeleteResult = async (id: number | string) => {
    if (!confirm('이 응시자의 결과를 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/results?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setResults(results.filter(r => r.id !== id));
      } else {
        alert('삭제 중 오류가 발생했습니다.');
      }
    } catch (e) {
      alert('통신 오류가 발생했습니다.');
    }
  };

  const handleDeleteSurvey = async (id: number | string) => {
    if (!confirm('이 설문 결과를 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/survey?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSurveys(surveys.filter(s => s.id !== id));
      } else {
        alert('삭제 중 오류가 발생했습니다.');
      }
    } catch (e) {
      alert('통신 오류가 발생했습니다.');
    }
  };

  const handleResetResults = async () => {
    if (!confirm('경고: 모든 학생들의 시험 결과를 완전히 삭제하시겠습니까?\n이 작업은 절대 되돌릴 수 없습니다!')) return;
    try {
      const res = await fetch(`/api/results?action=reset`, { method: 'DELETE' });
      if (res.ok) {
        setResults([]);
        alert('모든 데이터가 초기화되었습니다.');
      }
    } catch (e) {}
  };

  const handleResetSurveys = async () => {
    if (!confirm('경고: 모든 만족도 조사 결과를 완전히 삭제하시겠습니까?\n이 작업은 절대 되돌릴 수 없습니다!')) return;
    try {
      const res = await fetch(`/api/survey?action=reset`, { method: 'DELETE' });
      if (res.ok) {
        setSurveys([]);
        alert('모든 데이터가 초기화되었습니다.');
      }
    } catch (e) {}
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
  const filteredResults = selectedQuizId === 'all' ? results : results.filter(r => r.quizId === selectedQuizId);

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
        <div className="flex bg-white p-1 rounded-2xl border shadow-sm">
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4">
              <div className="bg-white flex items-center px-4 py-2 rounded-xl border shadow-sm">
                <label className="text-sm font-semibold text-slate-600 mr-3">과목 필터</label>
                <select 
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-indigo-500 py-1.5 px-3 font-medium outline-none cursor-pointer"
                  value={selectedQuizId}
                  onChange={(e) => setSelectedQuizId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                >
                  <option value="all">전체 과목 보기</option>
                  {uniqueQuizIds.map(id => (
                    <option key={id} value={id}>과목 {id} 결과만</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={handleResetResults}
                className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-xl border border-red-100 text-sm font-bold transition-colors"
              >
                결과 초기화
              </button>
            </div>
            <div className="bg-indigo-600 px-6 py-2 rounded-xl text-white font-bold shadow-lg shadow-indigo-200">
              총 {filteredResults.length}건
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                    <th className="px-6 py-4">응시 과목</th>
                    <th className="px-6 py-4">응시자 이름</th>
                    <th className="px-6 py-4">최종 점수</th>
                    <th className="px-6 py-4">정답 수</th>
                    <th className="px-6 py-4">제출 일시</th>
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
                        <td className="px-6 py-4 text-slate-500 text-sm">{new Date(r.createdAt).toLocaleString('ko-KR')}</td>
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
              <div className="pt-6 border-t border-white/10 mt-6">
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
            <h3 className="p-6 border-b border-slate-100 text-lg font-bold text-slate-800">교육생 개별 의견 및 답변</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                    <th className="px-6 py-4">부서/직급</th>
                    <th className="px-6 py-4">기억에 남는 과정 (Q2)</th>
                    <th className="px-6 py-4">개선 및 보완 (Q5)</th>
                    <th className="px-6 py-4">일시</th>
                    <th className="px-6 py-4 text-center">관리</th>
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
                        <td className="px-6 py-4 font-medium text-slate-900">{s.department}</td>
                        <td className="px-6 py-4 text-slate-600 text-sm max-w-xs truncate">{s.answers?.q2 || '-'}</td>
                        <td className="px-6 py-4 text-slate-600 text-sm max-w-xs truncate">{s.answers?.q5 || '-'}</td>
                        <td className="px-6 py-4 text-slate-500 text-sm">{new Date(s.createdAt).toLocaleDateString('ko-KR')}</td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => handleDeleteSurvey(s.id)} className="text-red-400 hover:text-red-600 text-xs font-bold uppercase">삭제</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

