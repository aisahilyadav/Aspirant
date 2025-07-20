import { FiHelpCircle } from 'react-icons/fi';

export default function QuizList({ quiz, answers, currentQuestion, onSelect }) {
  if (quiz.length === 0) return null;

  const question = quiz[currentQuestion];
  const selectedAnswer = answers[currentQuestion];

  return (
    <div className="space-y-4">
      {/* Question Header */}
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <FiHelpCircle className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              Question {currentQuestion + 1}
            </span>
            {selectedAnswer && (
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                Answered
              </span>
            )}
          </div>
          <h2 className="text-lg font-semibold text-gray-900 leading-snug">
            {question.question}
          </h2>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option, idx) => (
          <label
            key={option}
            className={`block p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedAnswer === option
                ? 'border-black bg-black text-white'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                checked={selectedAnswer === option}
                onChange={() => onSelect(currentQuestion, option)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                selectedAnswer === option
                  ? 'border-white bg-white'
                  : 'border-gray-300'
              }`}>
                {selectedAnswer === option && (
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                )}
              </div>
              <span className={`text-sm font-medium ${
                selectedAnswer === option ? 'text-white' : 'text-gray-900'
              }`}>
                {String.fromCharCode(65 + idx)}. {option}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
