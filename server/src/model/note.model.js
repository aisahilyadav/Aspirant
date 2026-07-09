import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200,
  },
  content: {
    type: String,
    default: '',
  },
  pdfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pdf',
  },
  summary: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Index to retrieve user's notes quickly, sorted by update time
noteSchema.index({ userId: 1, updatedAt: -1 });

export const Note = mongoose.model('Note', noteSchema);
