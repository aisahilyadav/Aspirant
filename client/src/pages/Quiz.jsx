import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submitQuiz } from '../api/quizApi';
import QuizList from '../components/QuizList';
import { FiClock, FiCheckCircle, FiArrowRight, FiArrowLeft, FiGrid, FiTarget, FiLoader } from 'react-icons/fi';

export default function Quiz() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`quiz_${quizId}`));
    if (stored) {
      setQuiz(stored);
      setAnswers(new Array(stored.length).fill(''));
    } else {
      alert('Quiz not found!');
      navigate('/');
    }
  }, [quizId, navigate]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    const unanswered = answers.filter(a => a === '').length;
    if (unanswered > 0) {
      if (!window.confirm(`You have ${unanswered} unanswered questions. Submit anyway?`)) {
        return;
      }
    }

    setLoading(true);
    try {
      const res = await submitQuiz(quizId, answers);
      if (res && typeof res.score === 'number' && Array.isArray(res.correctAnswers)) {
        navigate(`/result/${quizId}`, { 
          state: { 
            ...res,
            quiz,
            answers,
            timeElapsed
          }
        });
      } else {
        alert('Invalid quiz result from server');
        console.error('Invalid quiz result:', res);
      }
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      alert('Failed to submit quiz');
    }
    setLoading(false);
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const answeredCount = answers.filter(a => a !== '').length;
  const progress = quiz.length > 0 ? (answeredCount / quiz.length) * 100 : 0;

  if (quiz.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center pt-16 select-none font-sans">
        <div className="flex flex-col items-center space-y-4">
          <FiLoader className="animate-spin text-stone-900 w-8 h-8" />
          <span className="text-stone-850 text-xs font-mono font-bold uppercase tracking-widest animate-pulse">loading quiz outline...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 pt-20 pb-8 px-4 sm:px-6 lg:px-8 font-sans relative overflow-x-hidden select-none text-left">
      
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40 paper-grid" />

      {/* Handdrawn filter SVG */}
      <svg className="absolute w-0 h-0" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="handdrawn" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="max-w-7xl mx-auto relative z-10 h-[calc(100vh-7rem)] min-h-[500px]">
        <div className="grid grid-cols-12 gap-6 h-full items-stretch">
          
          {/* Navigator Sidebar (3 cols) */}
          <div className="col-span-12 lg:col-span-3 flex flex-col h-full">
            <div 
              className="bg-white border-2 border-stone-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between h-full"
              style={{ filter: 'url(#handdrawn)' }}
            >
              
              {/* Header Info */}
              <div className="space-y-4 flex-shrink-0">
                <div className="border-b border-stone-200 pb-3">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-stone-500 uppercase block rotate-[-1deg]">[ Active Recall ]</span>
                  <h1 className="text-lg font-sans font-black text-stone-950">Quiz Session</h1>
                </div>
                
                {/* Stats indicators */}
                <div className="space-y-2">
                  {/* Timer */}
                  <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-xl p-2 font-mono">
                    <div className="flex items-center text-xs font-bold uppercase text-stone-850">
                      <FiClock className="w-3.5 h-3.5 mr-1.5 text-[#D9866B]" />
                      <span>Duration</span>
                    </div>
                    <span className="text-xs font-bold text-stone-950">{formatTime(timeElapsed)}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center text-xs font-bold uppercase text-stone-850">
                        <FiTarget className="w-3.5 h-3.5 mr-1.5 text-[#D9866B]" />
                        <span>Completed</span>
                      </div>
                      <span className="text-xs font-extrabold text-stone-950">{Math.round(progress)}%</span>
                    </div>
                    <div className="bg-stone-100 border border-stone-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-stone-850 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Question Navigator Grid */}
              <div className="flex-1 flex flex-col overflow-hidden min-h-0 pt-4">
                <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-3 flex items-center flex-shrink-0">
                  <FiGrid className="w-4 h-4 mr-2" />
                  Recall Progress
                </h3>
                
                {/* Scrollable button grid */}
                <div className="flex-1 overflow-y-auto pr-1">
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {quiz.map((_, idx) => {
                      const isCurrent = currentQuestion === idx;
                      const isAnswered = answers[idx] !== '';
                      return (
                        <button
                          key={idx}
                          onClick={() => goToQuestion(idx)}
                          className={`aspect-square rounded-xl text-xs font-mono font-bold transition-all border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center relative ${
                            isCurrent
                              ? 'bg-[#F8C537] text-stone-950 font-black'
                              : isAnswered
                              ? 'bg-[#A9C5A0] text-stone-900 border-stone-900'
                              : 'bg-white text-stone-900'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Navigator done count */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-stone-150">
                    <div className="bg-[#EAF5E5] border border-stone-200 rounded-xl p-2 text-center">
                      <div className="text-sm font-bold text-stone-900">{answeredCount}</div>
                      <div className="text-[9px] font-mono text-stone-950 font-bold uppercase">Done</div>
                    </div>
                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-2 text-center">
                      <div className="text-sm font-bold text-stone-900">{quiz.length - answeredCount}</div>
                      <div className="text-[9px] font-mono text-stone-950 font-bold uppercase">Left</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Main Question Area (9 cols) */}
          <div className="col-span-12 lg:col-span-9 flex flex-col h-full">
            <div 
              className="bg-white border-2 border-stone-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between h-full overflow-hidden"
              style={{ filter: 'url(#handdrawn)' }}
            >
              
              {/* Question list window */}
              <div className="flex-1 overflow-y-auto pr-2 pb-4">
                <QuizList 
                  quiz={quiz} 
                  answers={answers} 
                  currentQuestion={currentQuestion}
                  onSelect={(idx, opt) => {
                    const copy = [...answers];
                    copy[idx] = opt;
                    setAnswers(copy);
                  }}
                />
              </div>
              
              {/* Question Navigation Control Panel */}
              <div className="pt-4 border-t border-stone-150 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                    className={`flex items-center px-4 py-2.5 rounded-xl border-2 border-stone-900 font-extrabold text-xs uppercase tracking-widest transition-all ${
                      currentQuestion === 0
                        ? 'bg-stone-105 text-stone-400 border-stone-300 shadow-none cursor-not-allowed'
                        : 'bg-stone-50 text-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
                    }`}
                  >
                    <FiArrowLeft className="w-4 h-4 mr-2" />
                    Prev
                  </button>

                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] text-stone-900 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg font-mono font-bold">
                      {currentQuestion + 1} OF {quiz.length}
                    </span>
                    
                    {currentQuestion < quiz.length - 1 ? (
                      <button
                        onClick={nextQuestion}
                        className="flex items-center px-5 py-2.5 bg-stone-900 text-stone-100 border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none rounded-xl font-extrabold text-xs uppercase tracking-widest"
                      >
                        Next
                        <FiArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`flex items-center px-5 py-2.5 rounded-xl border-2 border-stone-900 font-extrabold text-xs uppercase tracking-widest transition-all ${
                          loading
                            ? 'bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed shadow-none'
                            : 'bg-[#2ECC71] text-stone-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
                        }`}
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-stone-400 border-t-stone-700 rounded-full animate-spin mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <FiCheckCircle className="w-4.5 h-4.5 mr-2" />
                            Submit Quiz
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Submit warning stickynote alert */}
                {currentQuestion === quiz.length - 1 && answeredCount < quiz.length && (
                  <div className="mt-4 bg-[#FEF5D1] border-2 border-stone-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-[10px] text-stone-850 font-bold uppercase tracking-wider">
                      ⚠️ Warning: You have {quiz.length - answeredCount} unanswered question(s) remaining.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
