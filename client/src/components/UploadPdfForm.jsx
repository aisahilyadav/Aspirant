import { useState } from 'react';

export default function UploadPdfForm({ onUpload, loading }) {
  const [file, setFile] = useState(null);

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
      <button disabled={loading || !file} onClick={() => onUpload(file)}>
        {loading ? 'Uploading...' : 'Upload PDF'}
      </button>
    </div>
  );
}

