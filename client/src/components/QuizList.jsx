export default function QuizList({ quiz, answers, onSelect }) {
  return (
    <div>
      {quiz.map((q, idx) => (
        <div key={idx}>
          <p><strong>{idx+1}. {q.question}</strong></p>
          {q.options.map(opt => (
            <label key={opt}>
              <input
                type="radio"
                checked={answers[idx] === opt}
                onChange={() => onSelect(idx, opt)}
              /> {opt}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}
