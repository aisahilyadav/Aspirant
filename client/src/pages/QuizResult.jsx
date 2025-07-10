import { useLocation } from 'react-router-dom';

export default function QuizResult() {
  const { state } = useLocation();

  if (!state) return <p>No result data found</p>;

  const { score, total, correctAnswers, quiz, answers } = state;

  return (
    <div>
      <h2>📊 Quiz Results</h2>
      <h3>✅ Your score: {score} / {total}</h3>
      <h4>📋 Detailed summary:</h4>
      <ul>
        {quiz.map((q, idx) => (
          <li key={idx} style={{ marginBottom: '1em' }}>
            <strong>Q{idx + 1}: {q.question}</strong>
            <ul>
              {q.options.map((opt, i) => (
                <li key={i}>
                  {opt} 
                  {opt === correctAnswers[idx] && ' ✅ (Correct)'}
                  {opt === answers[idx] && opt !== correctAnswers[idx] && ' ❌ (Your choice)'}
                  {opt === answers[idx] && opt === correctAnswers[idx] && ' 🟩 (Your choice & correct)'}
                </li>
              ))}
            </ul>
            <p>✅ Correct answer: {correctAnswers[idx]}</p>
            <p>📝 Your answer: {answers[idx]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
