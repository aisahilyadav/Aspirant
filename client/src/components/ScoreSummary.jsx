import { FiCheckCircle, FiTarget, FiTrendingUp, FiAward, FiThumbsUp, FiZap, FiBookOpen } from 'react-icons/fi';

export default function ScoreSummary({ score, total, correctAnswers = [] }) {
  const percentage = Math.round((score / total) * 100);
  
  const getScoreColor = () => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = () => {
    if (percentage >= 90) return 'bg-green-50 border-green-200';
    if (percentage >= 70) return 'bg-blue-50 border-blue-200';
    if (percentage >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getPerformanceIcon = () => {
    if (percentage >= 90) return <FiAward className="w-4 h-4" />;
    if (percentage >= 70) return <FiThumbsUp className="w-4 h-4" />;
    if (percentage >= 60) return <FiZap className="w-4 h-4" />;
    return <FiBookOpen className="w-4 h-4" />;
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return 'Excellent work!';
    if (percentage >= 70) return 'Great job!';
    if (percentage >= 60) return 'Well done!';
    return 'Keep practicing!';
  };

  return (
    <div className={`rounded-xl border-2 p-6 ${getScoreBg()}`}>
      <div className="flex items-center mb-4">
        <FiTarget className="w-5 h-5 text-gray-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900">Score Summary</h3>
      </div>
      
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-4 relative">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(percentage * 219.8) / 100} 219.8`}
              className={getScoreColor()}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${getScoreColor()}`}>
              {percentage}%
            </span>
          </div>
        </div>
        
        <h4 className="text-2xl font-bold text-gray-900 mb-2">
          {score} out of {total}
        </h4>
        
        <div className={`flex items-center justify-center space-x-2 text-sm font-medium ${getScoreColor()}`}>
          {getPerformanceIcon()}
          <span>{getPerformanceMessage()}</span>
        </div>
      </div>

      {Array.isArray(correctAnswers) && correctAnswers.length > 0 && (
        <div>
          <div className="flex items-center mb-3">
            <FiTrendingUp className="w-4 h-4 text-gray-600 mr-2" />
            <h4 className="font-semibold text-gray-900">Correct Answers</h4>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {correctAnswers.map((ans, idx) => (
              <div key={idx} className="flex items-center p-2 bg-white rounded border">
                <FiCheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  <span className="font-medium">Q{idx + 1}:</span> {ans}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {(!Array.isArray(correctAnswers) || correctAnswers.length === 0) && (
        <div className="text-center py-4">
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <FiBookOpen className="w-4 h-4" />
            <p className="text-sm">No correct answers available</p>
          </div>
        </div>
      )}
    </div>
  );
}
