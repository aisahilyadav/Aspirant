import { Note } from '../model/note.model.js';
import { Pdf } from '../model/pdf.model.js';
import fetch from 'node-fetch';
import crypto from 'crypto';
import cloudinary from '../utils/cloudinary.js';
import { generateSignedPdfUrl } from '../utils/signedUrl.js';

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || "http://localhost:8000";

// Create note
export const createNote = async (req, res) => {
  try {
    const userId = req.userID;
    const { title, content } = req.body;
    
    const note = await Note.create({
      userId,
      title: title || 'Untitled Note',
      content: content || '',
    });

    res.status(201).json({
      message: 'Note created successfully',
      note,
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Failed to create note', error: error.message });
  }
};

// Get all notes for user
export const getNotes = async (req, res) => {
  try {
    const userId = req.userID;
    const notes = await Note.find({ userId })
      .populate('pdfId', 'filename')
      .sort({ updatedAt: -1 });

    res.json({ notes });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Failed to fetch notes', error: error.message });
  }
};

// Get note by ID
export const getNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.userID;

    const note = await Note.findOne({ _id: noteId, userId }).populate('pdfId');
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ note });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Failed to fetch note', error: error.message });
  }
};

// Update note
export const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.userID;
    const { title, content, summary } = req.body;

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (content !== undefined) updateFields.content = content;
    if (summary !== undefined) updateFields.summary = summary;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      updateFields,
      { new: true, runValidators: true }
    ).populate('pdfId');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note updated successfully', note });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Failed to update note', error: error.message });
  }
};

// Delete note
export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.userID;

    const note = await Note.findOneAndDelete({ _id: noteId, userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Failed to delete note', error: error.message });
  }
};

// Upload PDF for a note
export const uploadNotePdf = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.userID;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded!' });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    console.log("[Note PDF] Uploading file for note:", noteId);
    const fileBuffer = req.file.buffer;
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Convert buffer to base64 for Cloudinary upload
    const base64Data = fileBuffer.toString('base64');
    const dataUri = `data:application/pdf;base64,${base64Data}`;

    // Upload directly to Cloudinary
    await cloudinary.uploader.destroy(`pdfs/pdf_${fileHash}`, { resource_type: 'raw' });

    const cloudRes = await cloudinary.uploader.upload(dataUri, {
      resource_type: 'raw',
      folder: 'pdfs',
      public_id: `pdf_${fileHash}`,
      type: 'authenticated'
    });

    const publicId = cloudRes.public_id;
    const signedUrl = generateSignedPdfUrl(publicId);

    // Save PDF metadata or find existing
    let pdfDoc = await Pdf.findOne({ fileHash });
    if (!pdfDoc) {
      pdfDoc = await Pdf.create({
        filename: req.file.originalname,
        cloudinaryUrl: cloudRes.secure_url,
        fileHash,
        publicId,
      });
    }

    // Link PDF to Note
    note.pdfId = pdfDoc._id;
    await note.save();

    // Call FastAPI to process PDF index
    const apiRes = await fetch(`${RAG_SERVICE_URL}/process_pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_hash: fileHash, signed_url: signedUrl })
    });

    if (!apiRes.ok) {
      const text = await apiRes.text();
      console.error('[Note PDF] FastAPI error:', text);
      return res.status(502).json({ message: 'AI service error during processing', detail: text });
    }

    const body = await apiRes.json();
    const populatedNote = await note.populate('pdfId');

    res.json({
      message: body.message,
      note: populatedNote
    });
  } catch (error) {
    console.error('Upload note PDF error:', error);
    res.status(500).json({ message: 'Failed to upload note PDF', error: error.message });
  }
};

// Summarize note's PDF
export const summarizeNotePdf = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.userID;

  try {
    const note = await Note.findOne({ _id: noteId, userId }).populate('pdfId');
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (!note.pdfId) {
      return res.status(400).json({ message: 'No PDF attached to this note' });
    }

    const fileHash = note.pdfId.fileHash;
    console.log("[Note PDF] Requesting summary from FastAPI for hash:", fileHash);

    const apiRes = await fetch(`${RAG_SERVICE_URL}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_hash: fileHash })
    });

    if (!apiRes.ok) {
      const text = await apiRes.text();
      console.error('[Note PDF] FastAPI summarize error:', text);
      return res.status(502).json({ message: 'AI service error during summarization', detail: text });
    }

    const body = await apiRes.json();
    note.summary = body.summary;
    await note.save();

    res.json({
      message: 'Summary generated successfully',
      summary: body.summary,
      note
    });
  } catch (error) {
    console.error('Summarize note PDF error:', error);
    res.status(500).json({ message: 'Failed to summarize PDF', error: error.message });
  }
};

// Chat with note's PDF
export const chatNotePdf = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.userID;
  const { question } = req.body;

  try {
    const note = await Note.findOne({ _id: noteId, userId }).populate('pdfId');
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (!note.pdfId) {
      return res.status(400).json({ message: 'No PDF attached to this note' });
    }

    const fileHash = note.pdfId.fileHash;

    const apiRes = await fetch(`${RAG_SERVICE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, file_hash: fileHash })
    });

    if (!apiRes.ok) {
      const text = await apiRes.text();
      console.error('[Note PDF] FastAPI chat error:', text);
      return res.status(502).json({ message: 'AI service error during chat', detail: text });
    }

    const body = await apiRes.json();
    res.json({ answer: body.answer });
  } catch (error) {
    console.error('Chat note PDF error:', error);
    res.status(500).json({ message: 'Failed to chat with PDF', error: error.message });
  }
};
