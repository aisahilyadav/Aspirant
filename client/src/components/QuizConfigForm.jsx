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
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic Input */}
        <div className="space-y-2">
          <label htmlFor="topic" className="flex items-center text-base font-semibold text-gray-900">
            <FiBook className="w-4 h-4 mr-2 text-purple-600" />
            What topic should the quiz focus on?
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Enter a specific topic or subject area for your quiz questions
          </p>
          <div className="relative">
            <input
              id="topic"
              type="text"
              placeholder="e.g., Machine Learning Basics, World War 2, Python Functions..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              disabled={loading}
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <FiBook className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Number of Questions Input */}
        <div className="space-y-2">
          <label htmlFor="numQuestions" className="flex items-center text-base font-semibold text-gray-900">
            <FiHash className="w-4 h-4 mr-2 text-purple-600" />
            How many questions do you want?
          </label>
          <p className="text-sm text-gray-600 mb-3">
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
              className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              disabled={loading}
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <FiHash className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Generate Button - No loading state, just disabled */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !topic.trim() || !numQuestions}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center space-x-3 ${
              loading || !topic.trim() || !numQuestions
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-black text-white hover:from-purple-700 hover:to-gray-800 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
            }`}
          >
            <FiPlay className="w-5 h-5" />
            <span>Generate My Quiz</span>
          </button>
        </div>

        {/* Quick Topics */}
        {!loading && !topic && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-3 text-center">
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
                  className="px-3 py-1.5 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full transition-colors duration-200 border border-purple-200 hover:border-purple-300"
                  disabled={loading}
                >
                  {quickTopic}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Validation */}
        {(!topic.trim() || !numQuestions) && !loading && (
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Please fill in all fields to generate your quiz
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
