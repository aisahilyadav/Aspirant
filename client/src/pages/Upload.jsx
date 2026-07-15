import { useState } from 'react';
import { uploadPdf } from '../api/quizApi';

function UploadPdf() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a PDF file first!');
      return;
    }

    try {
      const data = await uploadPdf(file);
      setResult(`Upload successful: ${data.message}`);
    } catch (error) {
      console.error(error);
      setResult(`Upload failed: ${error.message}`);
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
