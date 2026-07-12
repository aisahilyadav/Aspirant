import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiCheckCircle, FiXCircle, FiHome, FiRefreshCw, FiClock, FiTarget, FiTrendingUp, FiAward, FiThumbsUp, FiZap, FiBookOpen, FiChevronDown, FiChevronRight } from 'react-icons/fi';

export default function QuizResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  if (!state) {
    return (
      <div className="min-h-screen bg-[#050408] flex items-center justify-center text-stone-200">
        <div className="text-center bg-[#FAF9F6] p-8 rounded-3xl border-3 border-stone-900 text-stone-950 shadow-[6px_6px_0px_0px_#FF6B6B] max-w-sm">
          <div className="w-16 h-16 bg-white border-2 border-stone-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiXCircle className="w-8 h-8 text-[#FF6B6B]" />
          </div>
          <h2 className="text-xl font-sans font-black uppercase mb-2">No Result Data Found</h2>
          <p className="text-xs text-stone-600 font-mono font-bold uppercase tracking-wider mb-6">Unable to load quiz results</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-stone-900 text-white font-extrabold text-xs uppercase tracking-widest border-2 border-stone-950 rounded-xl shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] hover:translate-y-[-1px] active:translate-y-[1px] transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const { score, total, correctAnswers, quiz, answers, timeElapsed } = state;
  const percentage = Math.round((score / total) * 100);
  const isExcellent = percentage >= 90;
  const isGood = percentage >= 70;
  const isPassed = percentage >= 60;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = () => {
    if (isExcellent) return 'text-[#22c55e]';
    if (isGood) return 'text-[#60a5fa]';
    if (isPassed) return 'text-[#F8C537]';
    return 'text-[#FF6B6B]';
  };

  const getScoreBg = () => {
    if (isExcellent) return 'shadow-[6px_6px_0px_0px_#22c55e] border-[#22c55e]';
    if (isGood) return 'shadow-[6px_6px_0px_0px_#60a5fa] border-[#60a5fa]';
    if (isPassed) return 'shadow-[6px_6px_0px_0px_#F8C537] border-[#F8C537]';
    return 'shadow-[6px_6px_0px_0px_#FF6B6B] border-[#FF6B6B]';
  };

  const getPerformanceMessage = () => {
    if (isExcellent) return 'Excellent work!';
    if (isGood) return 'Great job!';
    if (isPassed) return 'Well done!';
    return 'Keep practicing!';
  };

  const getPerformanceIcon = () => {
    if (isExcellent) return <FiAward className="w-5 h-5 stroke-[2.5]" />;
    if (isGood) return <FiThumbsUp className="w-5 h-5 stroke-[2.5]" />;
    if (isPassed) return <FiZap className="w-5 h-5 stroke-[2.5]" />;
    return <FiBookOpen className="w-5 h-5 stroke-[2.5]" />;
  };

  return (
    <div className="min-h-screen bg-[#050408] text-stone-200 font-sans relative overflow-x-hidden select-none pb-12">
      
      {/* Background Glowing Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 [background-size:40px_40px] [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]" />

      {/* Header bar */}
      <div className="bg-[#121016] border-b-2 border-stone-850 relative z-10 select-none">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="text-left space-y-1">
            <h1 className="text-2xl font-sans font-black text-white uppercase tracking-tight leading-none">Quiz Results</h1>
            <p className="text-[9px] font-mono font-black text-stone-500 uppercase tracking-widest">[ performance summary ]</p>
          </div>
          
          <div className="flex items-center space-x-3 font-mono text-[10px] font-black uppercase tracking-wider">
            <button
              onClick={() => navigate('/')}
              className="flex items-center px-4 py-2.5 bg-white text-stone-950 border-2 border-stone-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)] hover:translate-y-[-1px] active:translate-y-[1px] transition-all"
            >
              <FiHome className="w-3.5 h-3.5 mr-2 stroke-[3]" />
              Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center px-4 py-2.5 bg-[#F8C537] text-stone-950 border-2 border-stone-950 rounded-xl shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)] hover:translate-y-[-1px] active:translate-y-[1px] transition-all"
            >
              <FiRefreshCw className="w-3.5 h-3.5 mr-2 stroke-[3]" />
              Retake Quiz
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 relative z-10 text-left">
        
        {/* Score Summary Card */}
        <div className={`bg-[#FAF9F6] text-stone-950 rounded-3xl border-3 border-stone-900 p-8 mb-8 ${getScoreBg()} transition-all duration-300`}>
          <div className="text-center flex flex-col items-center">
            
            {/* Round accuracy stats progress circle */}
            <div className="w-24 h-24 mb-6 relative">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-stone-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(percentage * 251.2) / 100} 251.2`}
                  className={getScoreColor()}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-black font-mono ${getScoreColor()}`}>
                  {percentage}%
                </span>
              </div>
            </div>
            
            <h2 className="text-3xl font-sans font-black text-stone-950 uppercase tracking-tight mb-2">
              {score} out of {total}
            </h2>
            
            <div className={`flex items-center justify-center space-x-2 text-lg font-mono font-black uppercase mb-6 ${getScoreColor()}`}>
              {getPerformanceIcon()}
              <span>{getPerformanceMessage()}</span>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full max-w-lg mt-2">
              <div className="text-center bg-white border-2 border-stone-900 rounded-2xl p-3 shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-10 h-10 bg-[#d3ffd0] border-2 border-stone-900 rounded-full flex items-center justify-center mx-auto mb-2 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <FiCheckCircle className="w-5 h-5 text-stone-950 stroke-[3]" />
                </div>
                <div className="text-xl font-black text-stone-950">{score}</div>
                <div className="text-[9px] font-mono font-black uppercase text-stone-500">Correct</div>
              </div>
              
              <div className="text-center bg-white border-2 border-stone-900 rounded-2xl p-3 shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-10 h-10 bg-[#FFD2D2] border-2 border-stone-900 rounded-full flex items-center justify-center mx-auto mb-2 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <FiXCircle className="w-5 h-5 text-stone-950 stroke-[3]" />
                </div>
                <div className="text-xl font-black text-stone-950">{total - score}</div>
                <div className="text-[9px] font-mono font-black uppercase text-stone-500">Incorrect</div>
              </div>
              
              <div className="text-center bg-white border-2 border-stone-900 rounded-2xl p-3 shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-10 h-10 bg-[#dbe4ff] border-2 border-stone-900 rounded-full flex items-center justify-center mx-auto mb-2 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <FiClock className="w-5 h-5 text-stone-950 stroke-[3]" />
                </div>
                <div className="text-xl font-black text-stone-950">
                  {timeElapsed ? formatTime(timeElapsed) : '--'}
                </div>
                <div className="text-[9px] font-mono font-black uppercase text-stone-500">Time Taken</div>
              </div>
            </div>

          </div>
        </div>

        {/* Collapsible Detailed Review */}
        <div className="bg-[#FAF9F6] text-stone-950 rounded-3xl border-3 border-stone-900 overflow-hidden shadow-[6px_6px_0px_0px_#22c55e]">
          {/* Header Button */}
          <button
            onClick={() => setShowDetailedResults(!showDetailedResults)}
            className="w-full p-6 flex items-center justify-between hover:bg-stone-50 transition-colors"
          >
            <div className="flex items-center">
              <FiTrendingUp className="w-5 h-5 text-stone-950 mr-3 stroke-[2.5]" />
              <h3 className="text-lg font-sans font-black text-stone-950 uppercase tracking-tight">Detailed Review</h3>
              <span className="ml-3 text-[10px] font-mono font-black text-stone-500 uppercase">
                ({quiz.length} question{quiz.length !== 1 ? 's' : ''})
              </span>
            </div>
            <div className="flex items-center space-x-2 font-mono text-[9px] font-black uppercase tracking-wider">
              <span className="text-stone-500">
                {showDetailedResults ? 'Hide' : 'Show'} Details
              </span>
              {showDetailedResults ? (
                <FiChevronDown className="w-4 h-4 text-stone-400 stroke-[3]" />
              ) : (
                <FiChevronRight className="w-4 h-4 text-stone-400 stroke-[3]" />
              )}
            </div>
          </button>

          {/* Collapsible Content */}
          {showDetailedResults && (
            <div className="px-6 pb-6 border-t-2 border-stone-200">
              <div className="space-y-6 mt-6">
                {quiz.map((q, idx) => {
                  const isCorrect = answers[idx] === correctAnswers[idx];
                  
                  return (
                    <div key={idx} className="border-2 border-stone-900 rounded-2xl p-6 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      {/* Question Header */}
                      <div className="flex items-start justify-between mb-4 pb-3 border-b border-stone-150">
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-stone-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 ${
                            isCorrect ? 'bg-[#d3ffd0]' : 'bg-[#FFD2D2]'
                          }`}>
                            {isCorrect ? (
                              <FiCheckCircle className="w-4.5 h-4.5 text-stone-950 stroke-[3]" />
                            ) : (
                              <FiXCircle className="w-4.5 h-4.5 text-stone-950 stroke-[3]" />
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <h4 className="font-mono font-black text-[10px] text-stone-500 uppercase tracking-widest">
                              Question {idx + 1}
                            </h4>
                            <p className="text-stone-950 font-sans font-bold leading-normal text-sm mt-1">{q.question}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-mono font-black uppercase tracking-wider border border-stone-900 ${
                          isCorrect 
                            ? 'bg-[#d3ffd0] text-[#1e6128]' 
                            : 'bg-[#FFD2D2] text-red-900'
                        }`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>

                      {/* Options */}
                      <div className="space-y-2 text-left font-sans">
                        {q.options.map((option, i) => {
                          const isUserChoice = option === answers[idx];
                          const isCorrectAnswer = option === correctAnswers[idx];
                          
                          let optionStyle = 'border-stone-900 bg-white';
                          let textStyle = 'text-stone-800 font-bold';
                          let indicator = null;
                          
                          if (isCorrectAnswer && isUserChoice) {
                            optionStyle = 'border-stone-900 bg-[#d3ffd0] font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]';
                            textStyle = 'text-stone-950';
                            indicator = <FiCheckCircle className="w-4 h-4 text-stone-950 stroke-[3]" />;
                          } else if (isCorrectAnswer) {
                            optionStyle = 'border-stone-900 bg-[#d3ffd0] font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]';
                            textStyle = 'text-stone-950';
                            indicator = <FiCheckCircle className="w-4 h-4 text-stone-950 stroke-[3]" />;
                          } else if (isUserChoice) {
                            optionStyle = 'border-stone-900 bg-[#FFD2D2] font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]';
                            textStyle = 'text-stone-950';
                            indicator = <FiXCircle className="w-4 h-4 text-stone-950 stroke-[3]" />;
                          } else {
                            optionStyle = 'border-stone-200 bg-stone-50/40 opacity-80';
                            textStyle = 'text-stone-500';
                          }
                          
                          return (
                            <div 
                              key={i}
                              className={`flex items-center justify-between p-3.5 border-2 rounded-xl text-xs transition-all ${optionStyle}`}
                            >
                              <div className="flex items-center min-w-0 pr-4">
                                <div className="w-5.5 h-5.5 rounded border border-stone-400 bg-white text-[9px] font-mono font-bold flex items-center justify-center mr-3 text-stone-950 flex-shrink-0">
                                  {String.fromCharCode(65 + i)}
                                </div>
                                <span className={`${textStyle} leading-snug truncate`}>{option}</span>
                              </div>
                              {indicator}
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
