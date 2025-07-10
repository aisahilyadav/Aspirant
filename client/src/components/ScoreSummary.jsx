export default function ScoreSummary({ score, total, correctAnswers = [] }) {
  return (
    <div>
      <h3>✅ Your score: {score} / {total}</h3>
      <h4>Correct answers:</h4>
      <ul>
        {Array.isArray(correctAnswers) && correctAnswers.length > 0 ? (
          correctAnswers.map((ans, idx) => (
            <li key={idx}>{idx + 1}: {ans}</li>
          ))
        ) : (
          <li>No correct answers available</li>
        )}
      </ul>
    </div>
  );
}
