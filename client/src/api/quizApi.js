import { uploadPdfDirectly } from './directUpload';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export async function uploadPdf(file) {
  return uploadPdfDirectly(file, '/quiz/upload');
}

export async function generateQuiz(pdfId, topic, numQuestions) {
  const res = await fetch(`${API_URL}/quiz/generateQuiz`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ pdfId, topic, numQuestions })
  });
  return res.json();
}

export async function submitQuiz(quizId, answers) {
  const res = await fetch(`${API_URL}/quiz/submitQuiz`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ quizId, answers })
  });
  return res.json();
}
