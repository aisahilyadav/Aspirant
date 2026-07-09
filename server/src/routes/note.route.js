import express from 'express';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  uploadNotePdf,
  summarizeNotePdf,
  chatNotePdf,
} from '../controller/note.controller.js';
import upload from '../middleware/multer.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all note routes
router.use(authMiddleware);

// CRUD
router.post('/', createNote);
router.get('/', getNotes);
router.get('/:noteId', getNoteById);
router.put('/:noteId', updateNote);
router.delete('/:noteId', deleteNote);

// PDF & AI actions
router.post('/:noteId/upload-pdf', upload.single('pdf'), uploadNotePdf);
router.post('/:noteId/summarize', summarizeNotePdf);
router.post('/:noteId/chat', chatNotePdf);

export default router;
