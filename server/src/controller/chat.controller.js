import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary.js";
import {Pdf} from "../model/pdf.model.js";
import { generateSignedPdfUrl } from '../utils/signedUrl.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make this configurable via env var if you like
const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || "http://localhost:8000";

export async function uploadPdf(req, res) {
  // 1️⃣ Validate that Multer actually put a file here
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }

  try {
    console.log("[Node] Received upload, filename =", req.file.filename);

    // 2️⃣ Build the absolute path where Multer stored the PDF
    const uploadsDir = path.join(__dirname, "../../uploads");

    const absolutePath = path.join(uploadsDir, req.file.filename);

    // 3️⃣ Verify the file exists on disk (fs.promises.access returns a promise)
    await fs.access(absolutePath);
    console.log("[Node] File exists at:", absolutePath);

        // 1️⃣ Compute hash
    const fileBuffer = await fs.readFile(absolutePath);
    const fileHash   = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // 2️⃣ Upload to Cloudinary
    await cloudinary.uploader.destroy(`pdfs/pdf_${fileHash}`, { resource_type: 'raw' });

    const cloudRes = await cloudinary.uploader.upload(absolutePath, {
  resource_type: 'raw',
  folder: 'pdfs',
  public_id: `pdf_${fileHash}`,
  type: 'authenticated' // keep it private by default
});
    console.log('[Node] Uploaded to Cloudinary:', cloudRes.secure_url);

    // ✅ Generate signed URL
const publicId = cloudRes.public_id;   // e.g. 'pdfs/pdf_fd0a13c...'
const signedUrl = generateSignedPdfUrl(publicId);
console.log('[Node] Generated signed URL:', signedUrl);

    // 3️⃣ Save metadata to MongoDB
    const pdfDoc = await Pdf.create({
      filename: req.file.filename,
      cloudinaryUrl: cloudRes.secure_url,
      fileHash,
      publicId,
    });
    
    console.log('[Node] Saved to MongoDB:', pdfDoc);

    // 4️⃣ Call FastAPI
    const apiRes = await fetch(`${RAG_SERVICE_URL}/process_pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_hash: fileHash, signed_url: signedUrl })
    });

    if (!apiRes.ok) {
  const text = await apiRes.text();
  console.error('[Node] FastAPI error:', text);
  return res.status(502).json({ message: 'AI service error', detail: text });
}
const body = await apiRes.json();
    console.log('[Node] FastAPI response:', body);

    return res.json({
      message: body.message,
      filename: req.file.filename,
      pdfId: pdfDoc._id,            // frontend can use to identify
      fileHash,
      cloudinaryUrl: cloudRes.secure_url
    });

  } catch (err) {
    console.error('[Node] Upload error:', err);
    return res.status(500).json({ message: 'Upload failed', error: err.message });
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
