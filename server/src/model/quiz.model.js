import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
});

const quizSchema = new mongoose.Schema({
  pdfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pdf' },
  topic: String,
  numQuestions: Number,
  questions: [questionSchema],
}, { timestamps: true });

export const Quiz = mongoose.model('Quiz', quizSchema);
