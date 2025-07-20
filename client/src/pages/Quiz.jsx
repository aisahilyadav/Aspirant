import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submitQuiz } from '../api/quizApi';
import QuizList from '../components/QuizList';
import { FiClock, FiCheckCircle, FiArrowRight, FiArrowLeft, FiHome, FiGrid, FiUser, FiTarget } from 'react-icons/fi';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 h-full">
        <div className="grid grid-cols-12 gap-4 h-full">
          
          {/* Compact Navigator Sidebar */}
          <div className="col-span-12 lg:col-span-3 h-fit ">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full flex flex-col">
              
              {/* Compact Quiz Header */}
              <div className="mb-3 flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-sm font-bold text-gray-900">Quiz Session</h1>
                 
                </div>
                
                {/* Ultra Compact Quiz Stats */}
                <div className="space-y-1.5">
                  {/* Timer */}
                  <div className="flex items-center justify-between bg-blue-50 rounded-lg p-1.5">
                    <div className="flex items-center">
                      <FiClock className="w-3 h-3 text-blue-600 mr-1.5" />
                      <span className="text-xs font-medium text-blue-900">Time</span>
                    </div>
                    <span className="text-xs font-bold text-blue-900">{formatTime(timeElapsed)}</span>
                  </div>
                  
                  {/* Progress */}
                  <div className="bg-green-50 rounded-lg p-1.5">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <FiTarget className="w-3 h-3 text-green-600 mr-1.5" />
                        <span className="text-xs font-medium text-green-900">Progress</span>
                      </div>
                      <span className="text-xs font-bold text-green-900">{Math.round(progress)}%</span>
                    </div>
                    <div className="bg-green-200 rounded-full h-1">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-1 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Current Question */}
                  <div className="bg-gray-50 rounded-lg p-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FiGrid className="w-3 h-3 text-gray-600 mr-1.5" />
                        <span className="text-xs font-medium text-gray-900">Current</span>
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        {currentQuestion + 1} / {quiz.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Question Navigator - Flexible Height */}
              <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                <h3 className="font-semibold text-gray-900 text-xs mb-2 flex items-center flex-shrink-0">
                  <FiGrid className="w-3 h-3 mr-2" />
                  Questions
                </h3>
                
                {/* Question Grid - Scrollable if needed */}
                <div className="flex-1 flex flex-col space-y-2 overflow-auto">
                  <div className="grid grid-cols-5 gap-1 flex-shrink-0">
                    {quiz.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToQuestion(idx)}
                        className={`aspect-square rounded-md text-xs font-medium transition-all duration-200 relative ${
                          currentQuestion === idx
                            ? 'bg-black text-white shadow-md'
                            : answers[idx]
                            ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {idx + 1}
                        {answers[idx] && currentQuestion !== idx && (
                          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full border border-white"></div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Compact Summary Stats */}
                  <div className="pt-2 border-t border-gray-100 flex-shrink-0">
                    <div className="grid grid-cols-2 gap-1 text-center">
                      <div className="bg-green-50 rounded-lg p-1.5">
                        <div className="text-sm font-bold text-green-700">{answeredCount}</div>
                        <div className="text-xs text-green-600">Done</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-1.5">
                        <div className="text-sm font-bold text-gray-700">{quiz.length - answeredCount}</div>
                        <div className="text-xs text-gray-600">Left</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Question Area - Fixed Height */}
          <div className="col-span-12 lg:col-span-9 h-full flex flex-col">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full flex flex-col">
              {/* Question Content - Flexible Height with Scroll */}
              <div className="flex-1 overflow-auto min-h-0">
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
              
              {/* Fixed Navigation at Bottom - Always Visible */}
              <div className="pt-3 border-t border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                    className={`flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentQuestion === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FiArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </button>

                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                      {currentQuestion + 1} of {quiz.length}
                    </span>
                    
                    {currentQuestion < quiz.length - 1 ? (
                      <button
                        onClick={nextQuestion}
                        className="flex items-center px-5 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-200"
                      >
                        Next
                        <FiArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`flex items-center px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
                          loading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                        }`}
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <FiCheckCircle className="w-4 h-4 mr-2" />
                            Submit Quiz
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Submit Warning */}
                {currentQuestion === quiz.length - 1 && answeredCount < quiz.length && (
                  <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2">
                    <div className="flex items-center">
                      <FiCheckCircle className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0" />
                      <p className="text-xs text-amber-700">
                        You have {quiz.length - answeredCount} unanswered question(s).
                      </p>
                    </div>
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
