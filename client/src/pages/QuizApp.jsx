import { useState } from 'react';
import { Quiz } from '../../../server/src/model/quiz.model';

function QuizApp() {
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState('');
  const [pdfData, setPdfData] = useState(null); // ADD THIS LINE
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);

  // Upload PDF handler
  const handleUpload = async () => {
    if (!file) return alert('Select a PDF first!');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      setUploadResult('Uploading...');
      const res = await fetch('http://localhost:8001/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setUploadResult(' PDF uploaded & processed successfully!');
        setPdfData(data);
        console.log('Upload successful:', data);
      } else {
        setUploadResult(` Upload failed: ${data.message}`);
        console.error('Upload failed:', data);
      }
    } catch (err) {
      console.error(err);
      setUploadResult(' Upload failed (network error)');
    }
  };

  // Ask question handler
  const handleQuiz = async () => {
    if (!topic) return alert('Type a topic!');
    if(!numQuestions || numQuestions <= 0) return alert('Enter a valid number of questions!');
    if (!pdfData || !pdfData.pdfId) {
      alert('Please upload a PDF first!');
      return;
    }
    setLoading(true);
    setQuiz(null);
    try {
      const res = await fetch('http://localhost:8001/api/quiz/generateQuiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pdfId: pdfData.pdfId, // Include pdfId
          topic: topic.trim(),
          numQuestions: parseInt(numQuestions)
        })
      });
      const data = await res.json();
      if (res.ok) {
        setQuiz(data.questions);
      } else {
        setQuiz(` Failed to generate quiz: ${data.error || data.message}`);
      }
    } catch (err) {
      console.error(err);
      setQuiz(' Failed to generate quiz (network error)');
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <h2>📝 Chat with your PDF</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
        <button onClick={handleUpload}>Upload PDF</button>
        <p>{uploadResult}</p>
        {pdfData && (
          <p>✅ PDF ID: {pdfData.pdfId}</p>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="enter topic for quiz..."
          value={topic}
          onChange={e => setTopic(e.target.value)}
          style={{ width: '80%' }}
        />
        <input
          type="number"
          placeholder="Number of questions..."
          value={numQuestions}
          onChange={e => setNumQuestions(e.target.value)}
          style={{ width: '80%' }}
        />
        <button onClick={handleQuiz} disabled={loading || !pdfData}>
          {loading ? 'Thinking...' : 'Generate Quiz'}
        </button>
      </div>
<div>
       {quiz && Array.isArray(quiz) && quiz.length > 0 && (
  <div>
    <h4>🤖 Generated Quiz</h4>
    {quiz.map((q, idx) => (
      <div key={idx}>
        <strong>{idx + 1}. {q.question}</strong>
        <ul>
          {q.options.map((opt, oidx) => (
            <li key={oidx}>{opt}</li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)}
{quiz && typeof quiz === 'string' && <p>{quiz}</p>}
      </div>
    </div>
  );
} 
export default QuizApp;
