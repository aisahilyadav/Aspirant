import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary.js";
import { Pdf } from "../model/pdf.model.js";
import { Quiz } from "../model/quiz.model.js";
import { generateSignedPdfUrl } from '../utils/signedUrl.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || "http://localhost:8000";

// 🟩 Upload PDF (same as before, but keep it for quiz use)
export async function uploadPdf(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }

  try {
    console.log("[Quiz] Received upload, filename =", req.file.filename);

    const uploadsDir = path.join(__dirname, "../../uploads");
    const absolutePath = path.join(uploadsDir, req.file.filename);

    await fs.access(absolutePath);
    console.log("[Quiz] File exists at:", absolutePath);

    // Compute hash
    const fileBuffer = await fs.readFile(absolutePath);
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Upload to Cloudinary
    await cloudinary.uploader.destroy(`pdfs/pdf_${fileHash}`, { resource_type: 'raw' });

    const cloudRes = await cloudinary.uploader.upload(absolutePath, {
      resource_type: 'raw',
      folder: 'pdfs',
      public_id: `pdf_${fileHash}`,
      type: 'authenticated'
    });
    console.log('[Quiz] Uploaded to Cloudinary:', cloudRes.secure_url);

    // Generate signed URL
    const publicId = cloudRes.public_id;
    const signedUrl = generateSignedPdfUrl(publicId);
    console.log('[Quiz] Generated signed URL:', signedUrl);

    // Save PDF metadata
    const pdfDoc = await Pdf.create({
      filename: req.file.filename,
      cloudinaryUrl: cloudRes.secure_url,
      fileHash,
      publicId,
    });

    console.log('[Quiz] Saved to MongoDB:', pdfDoc);

    // Call FastAPI /process_pdf to process and index
    const apiRes = await fetch(`${RAG_SERVICE_URL}/process_pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_hash: fileHash, signed_url: signedUrl })
    });

    if (!apiRes.ok) {
      const text = await apiRes.text();
      console.error('[Quiz] FastAPI error:', text);
      return res.status(502).json({ message: 'AI service error', detail: text });
    }

    const body = await apiRes.json();
    console.log('[Quiz] FastAPI /process_pdf response:', body);

    return res.json({
      message: body.message,
      filename: req.file.filename,
      pdfId: pdfDoc._id,
      fileHash,
      cloudinaryUrl: cloudRes.secure_url
    });
  } catch (err) {
    console.error('[Quiz] Upload error:', err);
    return res.status(500).json({ message: 'Upload failed', error: err.message });
  }
}

// 🟩 Generate Quiz
export async function generateQuiz(req, res) {
  const { pdfId, topic, numQuestions } = req.body;

  try {
    const pdfDoc = await Pdf.findById(pdfId);
    if (!pdfDoc) return res.status(404).json({ message: 'PDF not found' });

    const fileHash = pdfDoc.fileHash;

    // Call FastAPI /generate_quiz
    const apiRes = await fetch(`${RAG_SERVICE_URL}/generate_quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file_hash: fileHash,
        topic,
        num_questions: parseInt(numQuestions)
      })
    });

    if (!apiRes.ok) {
      const text = await apiRes.text();
      console.error('[Quiz] FastAPI error:', text);
      return res.status(502).json({ message: 'AI service error', detail: text });
    }

    const data = await apiRes.json();
    if (!data.questions || !Array.isArray(data.questions)) {
      return res.status(500).json({ message: 'Invalid quiz data from AI service' });
    }

    // Save quiz to DB
    const quiz = await Quiz.create({
      pdfId,
      topic,
      numQuestions,
      questions: data.questions
    });

    console.log('[Quiz] Quiz generated and saved:', quiz._id);
    res.json({ message: 'Quiz generated!', quizId: quiz._id, questions: quiz.questions });
  } catch (err) {
    console.error('[Quiz] generateQuiz error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// 
// 🟩 Submit Quiz
export async function submitQuiz(req, res) {
  const { quizId, answers } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (q.correctAnswer === answers[idx]) correct++;
    });

    const score = correct;

    console.log(`[submitQuiz] Score: ${score} / ${quiz.numQuestions}`);

    return res.json({
  score,
  total: quiz.numQuestions,
  correctAnswers: quiz.questions.map(q => q.correctAnswer)
});

  } catch (err) {
    console.error('[submitQuiz] Error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}
