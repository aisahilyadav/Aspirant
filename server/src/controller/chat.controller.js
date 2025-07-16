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
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }

  try {
    console.log("[Chat] Received upload, filename =", req.file.originalname);

    // Work with buffer instead of file path
    const fileBuffer = req.file.buffer;
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Convert buffer to base64 for Cloudinary
    const base64Data = fileBuffer.toString('base64');
    const dataUri = `data:application/pdf;base64,${base64Data}`;

    // Upload to Cloudinary
    await cloudinary.uploader.destroy(`pdfs/pdf_${fileHash}`, { resource_type: 'raw' });

    const cloudRes = await cloudinary.uploader.upload(dataUri, {
      resource_type: 'raw',
      folder: 'pdfs',
      public_id: `pdf_${fileHash}`,
      type: 'authenticated'
    });

    // Rest of your logic remains the same...
    const publicId = cloudRes.public_id;
    const signedUrl = generateSignedPdfUrl(publicId);
    
    const pdfDoc = await Pdf.create({
      filename: req.file.originalname,
      cloudinaryUrl: cloudRes.secure_url,
      fileHash,
      publicId,
    });

    // Call FastAPI...
    const apiRes = await fetch(`${RAG_SERVICE_URL}/process_pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_hash: fileHash, signed_url: signedUrl })
    });

    // Handle response...
    const body = await apiRes.json();
    return res.json({
      message: body.message,
      filename: req.file.originalname,
      pdfId: pdfDoc._id,
      fileHash,
      cloudinaryUrl: cloudRes.secure_url
    });

  } catch (err) {
    console.error('[Chat] Upload error:', err);
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
