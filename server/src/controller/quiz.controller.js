// ─── controllers/rag.controller.js ───────────────────────────────────────────

import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Make this configurable via env var if you like
const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8000';

export async function uploadPdf(req, res) {
  // 1️⃣ Validate that Multer actually put a file here
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded!' });
  }

  try {
    console.log('[Node] Received upload, filename =', req.file.filename);

    // 2️⃣ Build the absolute path where Multer stored the PDF
    const uploadsDir = path.join(__dirname, '../../uploads');

    const absolutePath = path.join(uploadsDir, req.file.filename);

    // 3️⃣ Verify the file exists on disk (fs.promises.access returns a promise)
    await fs.access(absolutePath);
    console.log('[Node] File exists at:', absolutePath);

    // 4️⃣ Call FastAPI’s /process_pdf endpoint, using the constant
    console.log('[Node] Calling FastAPI:', `${RAG_SERVICE_URL}/process_pdf`);
    const params = new URLSearchParams({ pdf_path: absolutePath });
    console.log('[Node] Calling FastAPI at', RAG_SERVICE_URL, 'with path:', absolutePath);

    const apiRes = await fetch(`${RAG_SERVICE_URL}/process_pdf`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    params.toString()
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error('[Node] FastAPI returned error:', errText);
      return res.status(502).json({ message: 'Failed to process PDF in AI service' });
    }

    const body = await apiRes.json();
    console.log('[Node] FastAPI response body:', body);

    // 5️⃣ Finally return success to your React frontend
    return res.status(200).json({
      message:    body.message,
      filename:   req.file.filename,
      fileExists: body.file_exists,
      path:     absolutePath 
    });
  } catch (err) {
    console.error('[Node] Error in handleUpload:', err);
    return res.status(500).json({ message: 'Upload failed' });
  }
}

export async function chat(req, res) {
  try {
    const { question } = req.body;
    console.log('[Node] Received question:', question);

    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    // Call FastAPI /chat endpoint
    const apiRes = await fetch(`${RAG_SERVICE_URL}/chat`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error('[Node] FastAPI /chat error:', errText);
      return res.status(502).json({ message: 'Failed to get answer from AI service' });
    }

    const body = await apiRes.json();
    console.log('[Node] FastAPI /chat response:', body);

    return res.status(200).json({
      answer: body.answer
    });
  } catch (err) {
    console.error('[Node] Error in askQuestion:', err);
    return res.status(500).json({ message: 'Failed to process question', error: err.message });
  }
}
