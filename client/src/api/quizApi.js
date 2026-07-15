const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export async function uploadPdf(file) {
  const formData = new FormData();
  formData.append('pdf', file);
  const res = await fetch(`${API_URL}/quiz/upload`, { method: 'POST', body: formData });
  return res.json();
}

export async function generateQuiz(pdfId, topic, numQuestions) {
  const res = await fetch(`${API_URL}/quiz/generateQuiz`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ pdfId, topic, numQuestions })
  });
  return res.json();
}

export async function submitQuiz(quizId, answers) {
  const res = await fetch(`${API_URL}/quiz/submitQuiz`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ quizId, answers })
  });
  return res.json();
}
