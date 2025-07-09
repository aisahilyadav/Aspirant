// backend/models/quiz.model.js
import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  cloudinary_url: { type: String, required: true },
  topic: { type: String, required: true },
  number_of_questions: { type: Number, required: true },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
  score: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // if you have auth
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Quiz', quizSchema);
