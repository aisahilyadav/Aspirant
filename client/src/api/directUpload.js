const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
const MAX_PDF_BYTES = 50 * 1024 * 1024;

const getToken = () => localStorage.getItem('token');

async function readJson(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || body.error?.message || 'Upload failed');
  }
  return body;
}

async function hashFile(file) {
  const bytes = await file.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function uploadPdfDirectly(file, completionPath) {
  if (!file || file.type !== 'application/pdf') {
    throw new Error('Please select a PDF file');
  }
  if (file.size > MAX_PDF_BYTES) {
    throw new Error('PDF must be no larger than 50 MB');
  }

  const token = getToken();
  if (!token) {
    throw new Error('Please sign in before uploading a PDF');
  }

  const fileHash = await hashFile(file);
  const authHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const signatureResponse = await fetch(`${API_BASE_URL}/uploads/signature`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ fileHash }),
  });
  const signedUpload = await readJson(signatureResponse);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signedUpload.apiKey);
  formData.append('signature', signedUpload.signature);
  Object.entries(signedUpload.uploadParams).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  const cloudinaryResponse = await fetch(signedUpload.uploadUrl, {
    method: 'POST',
    body: formData,
  });
  const uploaded = await readJson(cloudinaryResponse);

  const completionResponse = await fetch(`${API_BASE_URL}${completionPath}`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      filename: file.name,
      fileHash,
      publicId: uploaded.public_id,
      cloudinaryUrl: uploaded.secure_url,
      version: uploaded.version,
      signature: uploaded.signature,
      bytes: uploaded.bytes,
    }),
  });

  return readJson(completionResponse);
}
