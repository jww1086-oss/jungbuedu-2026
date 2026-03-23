"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/results')
        .then(res => res.json())
        .then(data => {
          setResults(data.reverse()); // 최신순
          setLoading(false);
        });
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">관리자 대시보드</h1>
          <p className="text-slate-500 mt-2">교육생들의 퀴즈 참여 결과를 실시간으로 확인합니다.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-xl border shadow-sm text-center">
            <span className="block text-sm text-slate-500 mb-1">총 응시자</span>
            <span className="text-2xl font-bold text-indigo-600">{results.length}명</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
              <th className="px-6 py-4">응시자 이름</th>
              <th className="px-6 py-4">최종 점수</th>
              <th className="px-6 py-4">정답 수</th>
              <th className="px-6 py-4">제출 일시</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">데이터를 불러오는 중입니다...</td>
              </tr>
            ) : results.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">아직 제출된 결과가 없습니다.</td>
              </tr>
            ) : (
              results.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
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
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {new Date(r.createdAt).toLocaleString('ko-KR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
