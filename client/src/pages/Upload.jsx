import { useState } from 'react';

function UploadPdf() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a PDF file first!');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await fetch('http://localhost:8001/api/quiz/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setResult(`Upload successful: ${data.message}`);
      } else {
        setResult(`Upload failed: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setResult('Upload failed!');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Upload PDF Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
      <pre>{result}</pre>
    </div>
  );
}

export default UploadPdf;
