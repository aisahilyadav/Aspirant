import React, { useState } from 'react';

export default function ChatWithPdf() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer]     = useState('');
  const [loading, setLoading]   = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) {
      alert('Please type a question');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      if (res.ok) {
        setAnswer(data.answer);
      } else {
        setAnswer(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setAnswer('Error connecting to AI service');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Ask questions about your PDF</h2>
      <input
        type="text"
        placeholder="Type your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: '300px', marginRight: '1rem' }}
      />
      <button onClick={handleAsk} disabled={loading}>
        {loading ? 'Asking...' : 'Ask'}
      </button>
      <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
        <strong>Answer:</strong> {answer}
      </div>
    </div>
  );
}
