import { useState } from 'react';

function ChatWithPdf() {
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState('');
  const [pdfData, setPdfData] = useState(null); // ADD THIS LINE
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  // Upload PDF handler
  const handleUpload = async () => {
    if (!file) return alert('Select a PDF first!');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      setUploadResult('Uploading...');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
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
  const handleAsk = async () => {
    if (!question) return alert('Type a question!');
    if (!pdfData || !pdfData.pdfId) {
      alert('Please upload a PDF first!');
      return;
    }
    setLoading(true);
    setAnswer('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: question.trim(),
          pdfId: pdfData.pdfId // Include pdfId
        })
      });
      const data = await res.json();
      if (res.ok) {
        setAnswer(data.answer);
      } else {
        setAnswer(` Failed to get answer: ${data.error || data.message}`);
      }
    } catch (err) {
      console.error(err);
      setAnswer(' Failed to get answer (network error)');
    } finally {
      setLoading(false);
    }
  };

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
          placeholder="Ask a question..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          style={{ width: '80%' }}
        />
        <button onClick={handleAsk} disabled={loading || !pdfData}>
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </div>
<div>
        <h4>🤖 Answer:</h4>
        <p>{answer}</p>
      </div>
    </div>
  );
}
export default ChatWithPdf;
