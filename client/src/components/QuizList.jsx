import { FiHelpCircle, FiCheck } from 'react-icons/fi';

export default function QuizList({ quiz, answers, currentQuestion, onSelect }) {
  if (quiz.length === 0) return null;

  const question = quiz[currentQuestion];
  const selectedAnswer = answers[currentQuestion];

  return (
    <div className="space-y-6 text-left">
      {/* Question Header */}
      <div className="flex items-start space-x-3 border-b border-stone-150 pb-4">
        <div className="flex-shrink-0">
          <div className="w-9 h-9 bg-stone-50 border border-stone-250 rounded-xl flex items-center justify-center shadow-sm">
            <FiHelpCircle className="w-5 h-5 text-stone-800" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="text-[9px] font-bold text-stone-700 bg-stone-100 border border-stone-250 px-2 py-0.5 rounded-md uppercase tracking-wider font-mono">
              Question {currentQuestion + 1}
            </span>
            {selectedAnswer && (
              <span className="text-[9px] font-bold text-green-700 bg-[#EAF5E5] border border-stone-250 px-2 py-0.5 rounded-md uppercase tracking-wider font-mono flex items-center">
                <FiCheck className="w-3 h-3 mr-0.5" />
                Answered
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-serif-cormorant font-bold text-stone-950 leading-tight">
            {question.question}
          </h2>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 pt-2">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          return (
            <label
              key={option}
              className={`block p-4 border-2 border-stone-900 rounded-xl cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all select-none ${
                isSelected
                  ? 'bg-[#F26430] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-extrabold'
                  : 'bg-white text-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-serif-cormorant font-bold'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  checked={isSelected}
                  onChange={() => onSelect(currentQuestion, option)}
                  className="sr-only"
                />
                
                {/* Visual Option Letter Badge */}
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono border-2 border-stone-900 mr-4 flex-shrink-0 transition-colors ${
                  isSelected 
                    ? 'bg-white text-stone-900 font-extrabold' 
                    : 'bg-stone-50 text-stone-750 font-bold'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>

                <span className="text-sm tracking-wide flex-1 leading-snug">
                  {option}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
