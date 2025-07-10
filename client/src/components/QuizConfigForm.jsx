import { useState } from 'react';

export default function QuizConfigForm({ onGenerate, loading }) {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);

  return (
    <div>
      <input
        placeholder="Enter topic"
        value={topic}
        onChange={e => setTopic(e.target.value)}
      />
      <input
        type="number"
        value={numQuestions}
        onChange={e => setNumQuestions(e.target.value)}
      />
      <button disabled={loading || !topic} onClick={() => onGenerate(topic, numQuestions)}>
        {loading ? 'Generating...' : 'Generate Quiz'}
      </button>
    </div>
  );
}
