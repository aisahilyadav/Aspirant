import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submitQuiz } from '../api/quizApi';
import QuizList from '../components/QuizList';

export default function Quiz() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`quiz_${quizId}`));
    if (stored) setQuiz(stored);
    else alert('Quiz not found!');
  }, [quizId]);

  const handleSubmit = async () => {
    try {
    const res = await submitQuiz(quizId, answers);
    if (res && typeof res.score === 'number' && Array.isArray(res.correctAnswers)) {
      navigate(`/result/${quizId}`, { 
    state: { 
      ...res,              // score, total, correctAnswers
      quiz,                // send full quiz
      answers              // send user's selected answers
    }
  });
    } else {
      alert('Invalid quiz result from server');
      console.error('Invalid quiz result:', res);
    }
  } catch (err) {
    console.error('Failed to submit quiz:', err);
    alert('Failed to submit quiz');
  }
};

  return (
    <div>
      <h2>📋 Take Quiz</h2>
      <QuizList quiz={quiz} answers={answers} onSelect={(idx, opt) => {
        const copy = [...answers];
        copy[idx] = opt;
        setAnswers(copy);
      }} />
      <button onClick={handleSubmit}>Submit Quiz</button>
    </div>
  );
}
