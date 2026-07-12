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
      <div className="min-h-screen bg-[#050408] flex items-center justify-center pt-16 select-none font-sans text-stone-200">
        <div className="flex flex-col items-center space-y-4">
          <FiLoader className="animate-spin text-[#F8C537] w-8 h-8" />
          <span className="text-[#F8C537] text-xs font-mono font-black uppercase tracking-widest animate-pulse">loading quiz outline...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050408] text-stone-200 pt-20 pb-8 px-4 sm:px-6 lg:px-8 font-sans relative overflow-x-hidden select-none text-left font-sans">
      
      {/* Background Glowing Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-green-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 [background-size:40px_40px] [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]" />

      <div className="max-w-7xl mx-auto relative z-10 h-[calc(100vh-7rem)] min-h-[500px] pt-4">
        <div className="grid grid-cols-12 gap-6 h-full items-stretch">
          
          {/* Navigator Sidebar (3 cols) */}
          <div className="col-span-12 lg:col-span-3 flex flex-col h-full">
            <div className="bg-[#FAF9F6] text-stone-950 border-3 border-stone-900 rounded-3xl p-5 shadow-[6px_6px_0px_0px_#FFE066] flex flex-col justify-between h-full">
              
              {/* Header Info */}
              <div className="space-y-4 flex-shrink-0">
                <div className="border-b-2 border-stone-250 pb-3">
                  <span className="text-[9px] font-mono font-black tracking-widest text-[#F26430] uppercase block rotate-[-1deg]">[ Active Recall ]</span>
                  <h1 className="text-lg font-sans font-black text-stone-950 uppercase tracking-tight">Quiz Session</h1>
                </div>
                
                {/* Stats indicators */}
                <div className="space-y-2">
                  {/* Timer */}
                  <div className="flex items-center justify-between bg-white border-2 border-stone-900 rounded-xl p-2 font-mono shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center text-[10px] font-black uppercase text-stone-900">
                      <FiClock className="w-3.5 h-3.5 mr-1.5 text-[#F26430] stroke-[3]" />
                      <span>Duration</span>
                    </div>
                    <span className="text-xs font-black text-stone-950">{formatTime(timeElapsed)}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="bg-white border-2 border-stone-900 rounded-xl p-2.5 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center text-[10px] font-black uppercase text-stone-900">
                        <FiTarget className="w-3.5 h-3.5 mr-1.5 text-[#F26430] stroke-[3]" />
                        <span>Completed</span>
                      </div>
                      <span className="text-xs font-black text-stone-950">{Math.round(progress)}%</span>
                    </div>
                    <div className="bg-stone-200 border-2 border-stone-900 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-[#22c55e] h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Question Navigator Grid */}
              <div className="flex-1 flex flex-col overflow-hidden min-h-0 pt-4">
                <h3 className="font-mono font-black text-stone-900 text-[10px] uppercase tracking-wider mb-3 flex items-center flex-shrink-0">
                  <FiGrid className="w-4 h-4 mr-2 stroke-[2.5]" />
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
                          className={`aspect-square rounded-xl text-xs font-mono font-black border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center relative ${
                            isCurrent
                              ? 'bg-[#F8C537] text-stone-950'
                              : isAnswered
                              ? 'bg-[#A9C5A0] text-stone-950'
                              : 'bg-white text-stone-950'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Navigator done count */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-stone-200">
                    <div className="bg-[#d3ffd0] border-2 border-stone-900 rounded-xl p-2 text-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                      <div className="text-sm font-black text-stone-950">{answeredCount}</div>
                      <div className="text-[8px] font-mono text-stone-900 font-bold uppercase">Done</div>
                    </div>
                    <div className="bg-white border-2 border-stone-900 rounded-xl p-2 text-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                      <div className="text-sm font-black text-stone-950">{quiz.length - answeredCount}</div>
                      <div className="text-[8px] font-mono text-stone-900 font-bold uppercase">Left</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Main Question Area (9 cols) */}
          <div className="col-span-12 lg:col-span-9 flex flex-col h-full">
            <div className="bg-[#FAF9F6] text-stone-950 border-3 border-stone-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_#60a5fa] flex flex-col justify-between h-full overflow-hidden">
              
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
              <div className="pt-4 border-t border-stone-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                    className={`flex items-center px-4 py-2.5 rounded-xl border-2 border-stone-900 font-black text-xs uppercase tracking-widest transition-all ${
                      currentQuestion === 0
                        ? 'bg-stone-200 text-stone-400 border-stone-300 shadow-none cursor-not-allowed'
                        : 'bg-white text-stone-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
                    }`}
                  >
                    <FiArrowLeft className="w-4 h-4 mr-2 stroke-[3]" />
                    Prev
                  </button>

                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] text-stone-950 bg-white border-2 border-stone-900 px-3.5 py-2 rounded-lg font-mono font-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                      {currentQuestion + 1} OF {quiz.length}
                    </span>
                    
                    {currentQuestion < quiz.length - 1 ? (
                      <button
                        onClick={nextQuestion}
                        className="flex items-center px-5 py-2.5 bg-stone-900 text-white border-2 border-stone-950 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none rounded-xl font-black text-xs uppercase tracking-widest"
                      >
                        Next
                        <FiArrowRight className="w-4 h-4 ml-2 stroke-[3]" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`flex items-center px-5 py-2.5 rounded-xl border-2 border-stone-900 font-black text-xs uppercase tracking-widest transition-all ${
                          loading
                            ? 'bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed shadow-none'
                            : 'bg-[#22c55e] text-stone-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
                        }`}
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-stone-400 border-t-stone-750 rounded-full animate-spin mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <FiCheckCircle className="w-4.5 h-4.5 mr-2 stroke-[2.5]" />
                            Submit Quiz
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Submit warning stickynote alert */}
                {currentQuestion === quiz.length - 1 && answeredCount < quiz.length && (
                  <div className="mt-4 bg-[#FFE066] border-2 border-stone-900 rounded-xl p-3 shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-[10px] text-stone-950 font-black uppercase tracking-wider">
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
