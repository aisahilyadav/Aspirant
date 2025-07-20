import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiCheckCircle, FiXCircle, FiHome, FiRefreshCw, FiClock, FiTarget, FiTrendingUp, FiAward, FiThumbsUp, FiZap, FiBookOpen, FiChevronDown, FiChevronRight } from 'react-icons/fi';

export default function QuizResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  if (!state) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiXCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Result Data Found</h2>
          <p className="text-gray-600 mb-6">Unable to load quiz results</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
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
    if (isExcellent) return 'text-green-600';
    if (isGood) return 'text-blue-600';
    if (isPassed) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = () => {
    if (isExcellent) return 'bg-green-50 border-green-200';
    if (isGood) return 'bg-blue-50 border-blue-200';
    if (isPassed) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getPerformanceMessage = () => {
    if (isExcellent) return 'Excellent work!';
    if (isGood) return 'Great job!';
    if (isPassed) return 'Well done!';
    return 'Keep practicing!';
  };

  const getPerformanceIcon = () => {
    if (isExcellent) return <FiAward className="w-5 h-5" />;
    if (isGood) return <FiThumbsUp className="w-5 h-5" />;
    if (isPassed) return <FiZap className="w-5 h-5" />;
    return <FiBookOpen className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>
              <p className="text-gray-600 mt-1">Your performance summary</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FiHome className="w-4 h-4 mr-2" />
                Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <FiRefreshCw className="w-4 h-4 mr-2" />
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Summary Card */}
        <div className={`rounded-2xl border-2 p-8 mb-8 ${getScoreBg()}`}>
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
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
                <span className={`text-2xl font-bold ${getScoreColor()}`}>
                  {percentage}%
                </span>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {score} out of {total}
            </h2>
            <div className={`flex items-center justify-center space-x-2 text-lg font-medium mb-4 ${getScoreColor()}`}>
              {getPerformanceIcon()}
              <span>{getPerformanceMessage()}</span>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                  <FiCheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{score}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                  <FiXCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{total - score}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                  <FiClock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {timeElapsed ? formatTime(timeElapsed) : '--'}
                </div>
                <div className="text-sm text-gray-600">Time Taken</div>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Detailed Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Collapsible Header */}
          <button
            onClick={() => setShowDetailedResults(!showDetailedResults)}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-xl"
          >
            <div className="flex items-center">
              <FiTrendingUp className="w-5 h-5 text-gray-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Detailed Review</h3>
              <span className="ml-3 text-sm text-gray-500">
                ({quiz.length} question{quiz.length !== 1 ? 's' : ''})
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {showDetailedResults ? 'Hide' : 'Show'} Details
              </span>
              {showDetailedResults ? (
                <FiChevronDown className="w-5 h-5 text-gray-400 transition-transform" />
              ) : (
                <FiChevronRight className="w-5 h-5 text-gray-400 transition-transform" />
              )}
            </div>
          </button>

          {/* Collapsible Content */}
          {showDetailedResults && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="space-y-6 mt-6">
                {quiz.map((q, idx) => {
                  const isCorrect = answers[idx] === correctAnswers[idx];
                  const hasAnswer = answers[idx] !== undefined && answers[idx] !== '';
                  
                  return (
                    <div key={idx} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                      {/* Question Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCorrect ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {isCorrect ? (
                              <FiCheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <FiXCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              Question {idx + 1}
                            </h4>
                            <p className="text-gray-700 leading-relaxed">{q.question}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isCorrect 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>

                      {/* Options */}
                      <div className="space-y-2">
                        {q.options.map((option, i) => {
                          const isUserChoice = option === answers[idx];
                          const isCorrectAnswer = option === correctAnswers[idx];
                          
                          let optionStyle = 'border-gray-200 bg-white';
                          let textStyle = 'text-gray-700';
                          let indicator = null;
                          
                          if (isCorrectAnswer && isUserChoice) {
                            optionStyle = 'border-green-300 bg-green-50';
                            textStyle = 'text-green-800';
                            indicator = <FiCheckCircle className="w-4 h-4 text-green-600" />;
                          } else if (isCorrectAnswer) {
                            optionStyle = 'border-green-300 bg-green-50';
                            textStyle = 'text-green-800';
                            indicator = <FiCheckCircle className="w-4 h-4 text-green-600" />;
                          } else if (isUserChoice) {
                            optionStyle = 'border-red-300 bg-red-50';
                            textStyle = 'text-red-800';
                            indicator = <FiXCircle className="w-4 h-4 text-red-600" />;
                          }
                          
                          return (
                            <div
                              key={i}
                              className={`p-3 rounded-lg border-2 ${optionStyle} transition-colors`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`font-medium ${textStyle}`}>
                                  {String.fromCharCode(65 + i)}. {option}
                                </span>
                                {indicator && (
                                  <div>{indicator}</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Answer Summary */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Your answer: </span>
                            <span className={`font-semibold ${
                              hasAnswer ? (isCorrect ? 'text-green-700' : 'text-red-700') : 'text-gray-500'
                            }`}>
                              {hasAnswer ? answers[idx] : 'Not answered'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Correct answer: </span>
                            <span className="font-semibold text-green-700">
                              {correctAnswers[idx]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4 mt-8">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
