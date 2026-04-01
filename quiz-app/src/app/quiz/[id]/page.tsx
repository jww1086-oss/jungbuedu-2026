"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [quiz, setQuiz] = useState<any>(null);
  const [studentName, setStudentName] = useState('');
  const [session, setSession] = useState('1');
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [resultData, setResultData] = useState<any>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/quizzes/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setQuiz(data);
          setAnswers(new Array(data.questions.length).fill(-1));
        }
      });
  }, [id]);

  const handleStart = () => {
    if (!studentName.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    const sessionNum = Number(session);
    if (isNaN(sessionNum) || sessionNum < 1 || sessionNum > 17) {
      setError('회차는 1에서 17 사이의 숫자여야 합니다.');
      return;
    }
    setError('');
    setStep('quiz');
  };

  const handleOptionSelect = (qIndex: number, optIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = optIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (answers.includes(-1)) {
      alert('모든 문항에 답변해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          quizId: quiz.id,
          session: Number(session),
          answers
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        alert(`오류가 발생했습니다: ${data.error || '제출 실패'}`);
        setIsSubmitting(false);
        return;
      }
      setResultData(data);
      setStep('result');
    } catch (e) {
      alert('통신 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  if (!quiz) return <div className="p-12 text-center text-slate-500">불러오는 중...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {step === 'intro' && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
          <p className="text-slate-500 mb-8">{quiz.description}</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">성명</label>
              <input 
                type="text" 
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="홍길동"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">회차 (1~17)</label>
              <input 
                type="number" 
                min="1"
                max="17"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <button 
              onClick={handleStart}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
            >
              평가 시작
            </button>
          </div>
        </div>
      )}

      {step === 'quiz' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">문항 풀이</h2>
            <span className="text-sm font-medium text-slate-500 border bg-white px-3 py-1 rounded-full">
              응시자: <strong className="text-indigo-600">{studentName}</strong>
            </span>
          </div>

          {quiz.questions.map((q: any, i: number) => (
            <div key={q.id} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-start gap-3">
                <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm">
                  {i + 1}
                </span>
                <span className="pt-1 leading-snug">{q.content}</span>
              </h3>
              
              <div className="space-y-3 pl-11">
                {q.options.map((opt: string, optIndex: number) => (
                  <label key={optIndex} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${answers[i] === optIndex ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}>
                    <input 
                      type="radio" 
                      name={`question-${i}`} 
                      className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                      checked={answers[i] === optIndex}
                      onChange={() => handleOptionSelect(i, optIndex)}
                    />
                    <span className={`ml-3 text-sm font-medium ${answers[i] === optIndex ? 'text-indigo-900' : 'text-slate-700'}`}>
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-5 text-white font-bold text-lg rounded-xl transition-all ${isSubmitting ? 'bg-indigo-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-indigo-500/20'}`}
          >
            {isSubmitting ? '채점 및 저장 중...' : '최종 제출하기'}
          </button>
        </div>
      )}

      {step === 'result' && resultData && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">평가 완료!</h2>
          <p className="text-slate-500 mb-8">{studentName} 님의 평가 결과가 저장되었습니다.</p>
          
          <div className="inline-block bg-slate-50 border px-12 py-8 rounded-2xl mb-8">
            <div className="text-sm font-semibold text-slate-400 mb-1">최종 점수</div>
            <div className="text-5xl font-black text-indigo-600 tracking-tight">
              {Math.round((resultData.score / resultData.total) * 100)}<span className="text-2xl text-slate-400">점</span>
            </div>
          </div>

          <div className="space-y-4 text-left border-t pt-8">
            <h3 className="font-bold text-lg text-slate-800">오답 노트</h3>
            {resultData.details.filter((d:any) => !d.isCorrect).length === 0 ? (
              <div className="text-green-600 text-sm font-medium p-4 bg-green-50 rounded-xl">와우! 모든 문제를 맞추셨습니다.</div>
            ) : (
              resultData.details.filter((d:any) => !d.isCorrect).map((d:any, i:number) => (
                <div key={i} className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm">
                  <div className="font-semibold text-red-800 mb-2">문항 {quiz.questions.findIndex((q:any)=>q.id===d.questionId) + 1} 번 오류</div>
                  <p className="text-slate-700 leading-relaxed"><span className="font-bold text-green-700">정답 해설:</span> {d.explanation}</p>
                </div>
              ))
            )}
          </div>

          <div className="mt-8">
            <button onClick={() => router.push('/')} className="text-indigo-600 font-medium hover:underline">홈으로 돌아가기</button>
          </div>
        </div>
      )}
    </div>
  );
}
