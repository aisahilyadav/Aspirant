import { useState } from 'react';
import { FiPlay, FiBook, FiHash } from 'react-icons/fi';

export default function QuizConfigForm({ onGenerate, loading }) {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic && numQuestions && !loading) {
      onGenerate(topic, parseInt(numQuestions));
    }
  };

  return (
    <div className="space-y-6 text-left">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic Input */}
        <div className="space-y-2">
          <label htmlFor="topic" className="flex items-center text-sm font-bold text-stone-900 uppercase tracking-wider">
            <FiBook className="w-4.5 h-4.5 mr-2 text-[#D9866B]" />
            What topic should the quiz focus on?
          </label>
          <p className="text-xs text-stone-500 font-handwritten">
            Enter a specific topic or subject area for your quiz questions
          </p>
          <div className="relative">
            <input
              id="topic"
              type="text"
              placeholder="e.g., Machine Learning Basics, World War 2, Python Functions..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-3.5 text-sm border-2 border-stone-900 rounded-2xl focus:outline-none focus:border-stone-950 transition-all duration-200 text-stone-900 placeholder-stone-400 bg-white font-serif-cormorant font-bold"
              disabled={loading}
              required
            />
          </div>
        </div>

        {/* Number of Questions Input */}
        <div className="space-y-2">
          <label htmlFor="numQuestions" className="flex items-center text-sm font-bold text-stone-900 uppercase tracking-wider">
            <FiHash className="w-4.5 h-4.5 mr-2 text-[#D9866B]" />
            How many questions do you want?
          </label>
          <p className="text-xs text-stone-500 font-handwritten">
            Enter the number of questions for your quiz (1-50)
          </p>
          <div className="relative">
            <input
              id="numQuestions"
              type="number"
              min="1"
              max="50"
              placeholder="Enter number of questions (e.g., 10)"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              className="w-full px-4 py-3.5 text-sm border-2 border-stone-900 rounded-2xl focus:outline-none focus:border-stone-950 transition-all duration-200 text-stone-900 placeholder-stone-400 bg-white font-serif-cormorant font-bold"
              disabled={loading}
              required
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !topic.trim() || !numQuestions}
            className={`w-full py-4 px-6 rounded-2xl font-extrabold text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center space-x-3 border-2 border-stone-900 ${
              loading || !topic.trim() || !numQuestions
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed border-stone-300'
                : 'bg-[#F26430] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
            }`}
          >
            <FiPlay className="w-5 h-5 fill-white/10" />
            <span>Generate My Quiz</span>
          </button>
        </div>

        {/* Quick Topics */}
        {!loading && !topic && (
          <div className="pt-4 border-t border-stone-200">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3 text-center">
              💡 Quick Topic Suggestions
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                'JavaScript Fundamentals',
                'React Components', 
                'Python Data Types',
                'Linear Algebra',
                'World History',
                'Biology Basics'
              ].map((quickTopic) => (
                <button
                  key={quickTopic}
                  type="button"
                  onClick={() => setTopic(quickTopic)}
                  className="px-3.5 py-1.5 text-xs bg-white border border-stone-250 hover:bg-stone-900 hover:text-stone-100 hover:border-stone-900 active:scale-95 rounded-full transition-all duration-200 shadow-sm"
                  disabled={loading}
                >
                  {quickTopic}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
