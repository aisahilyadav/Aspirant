import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadPdf, generateQuiz } from '../api/quizApi';
import UploadPdfForm from '../components/UploadPdfForm';
import QuizConfigForm from '../components/QuizConfigForm';

export default function PreQuiz() {
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (file) => {
    setLoading(true);
    const res = await uploadPdf(file);
    if (res.pdfId) setPdfData(res);
    else alert(res.message);
    setLoading(false);
  };

  const handleGenerateQuiz = async (topic, numQuestions) => {
    if (!pdfData) return alert('Upload PDF first!');
    setLoading(true);
    const res = await generateQuiz(pdfData.pdfId, topic, numQuestions);
    if (res.quizId && res.questions) {
      // Save quiz in localStorage (so QuizPage can load)
      localStorage.setItem(`quiz_${res.quizId}`, JSON.stringify(res.questions));
      navigate(`/quiz/${res.quizId}`);
    } else alert(res.message);
    setLoading(false);
  };

  return (
    <div>
      <h2>📝 Upload & Create Quiz</h2>
      <UploadPdfForm onUpload={handleUpload} loading={loading} />
      {pdfData && <QuizConfigForm onGenerate={handleGenerateQuiz} loading={loading} />}
    </div>
  );
}
