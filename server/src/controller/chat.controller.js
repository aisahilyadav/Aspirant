import fetch from "node-fetch";
import {Pdf} from "../model/pdf.model.js";
import { generateSignedPdfUrl } from '../utils/signedUrl.js';
import { verifyDirectPdfUpload } from '../services/directUpload.service.js';

// Make this configurable via env var if you like
const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || "http://localhost:8000";

export async function uploadPdf(req, res) {
  try {
    const upload = verifyDirectPdfUpload(req.body);
    const { filename, fileHash, publicId, cloudinaryUrl } = upload;
    const signedUrl = generateSignedPdfUrl(publicId);

    let pdfDoc = await Pdf.findOne({ fileHash });
    if (!pdfDoc) {
      pdfDoc = await Pdf.create({ filename, cloudinaryUrl, fileHash, publicId });
    }

    // Call FastAPI...
    const apiRes = await fetch(`${RAG_SERVICE_URL}/process_pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_hash: fileHash, signed_url: signedUrl })
    });

    if (!apiRes.ok) {
      const detail = await apiRes.text();
      return res.status(502).json({ message: 'AI service error', detail });
    }

    const body = await apiRes.json();
    return res.json({
      message: body.message,
      filename,
      pdfId: pdfDoc._id,
      fileHash,
      cloudinaryUrl,
    });

  } catch (err) {
    console.error('[Chat] Upload error:', err);
    return res.status(err.status || 500).json({ message: 'Upload failed', error: err.message });
  }
}


export async function chat(req, res) {
  try {
    const { question, pdfId } = req.body;

    // find the PDF in DB
    const pdfDoc = await Pdf.findById(pdfId);
    if (!pdfDoc) return res.status(404).json({ message: 'PDF not found' });

    const fileHash = pdfDoc.fileHash;

    // call FastAPI /chat
    const apiRes = await fetch(`${RAG_SERVICE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, file_hash: fileHash }) // or pass file hash
    });

    const body = await apiRes.json();
    return res.json({ answer: body.answer });

  } catch (err) {
    console.error('[Node] chatWithPdf error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
