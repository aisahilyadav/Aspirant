import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
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
  description: {
    type: String,
    trim: true,
    maxLength: 1000,
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  category: {
    type: String,
    enum: ['study', 'quiz', 'reading', 'research', 'assignment', 'exam', 'other'],
    default: 'other',
  },
  dueDate: {
    type: Date,
    required: false,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  completedDate: {
    type: Date,
  },
  estimatedDuration: {
    type: Number, // in minutes
    min: 0,
  },
  actualDuration: {
    type: Number, // in minutes
    min: 0,
  },
  tags: [{
    type: String,
    trim: true,
    maxLength: 50,
  }],
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurringPattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
  },
  relatedQuiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
  },
  relatedPdf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pdf',
  },
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'notification'],
      default: 'notification',
    },
    time: {
      type: Date,
      required: true,
    },
    sent: {
      type: Boolean,
      default: false,
    },
  }],
  subtasks: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 150,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedDate: {
      type: Date,
    },
  }],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  notes: {
    type: String,
    maxLength: 2000,
  },
}, {
  timestamps: true,
});

// Indexes for better performance
todoSchema.index({ userId: 1, status: 1 });
todoSchema.index({ userId: 1, dueDate: 1 });
todoSchema.index({ userId: 1, category: 1 });
todoSchema.index({ userId: 1, createdAt: -1 });

// Virtual for overdue tasks
todoSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.dueDate < new Date() && this.status !== 'completed';
});

// Virtual for completion percentage of subtasks
todoSchema.virtual('subtaskProgress').get(function() {
  if (!this.subtasks || this.subtasks.length === 0) return 100;
  const completed = this.subtasks.filter(subtask => subtask.completed).length;
  return Math.round((completed / this.subtasks.length) * 100);
});

// Pre-save middleware to update completion date and progress
todoSchema.pre('save', function(next) {
  // Set completed date when status changes to completed
  if (this.status === 'completed' && !this.completedDate) {
    this.completedDate = new Date();
  }
  
  // Remove completed date if status is not completed
  if (this.status !== 'completed' && this.completedDate) {
    this.completedDate = undefined;
  }
  
  // Update progress based on subtasks if no manual progress is set
  if (this.subtasks && this.subtasks.length > 0) {
    const completed = this.subtasks.filter(subtask => subtask.completed).length;
    this.progress = Math.round((completed / this.subtasks.length) * 100);
  }
  
  next();
});

// Static method to get user's todos by status
todoSchema.statics.getByStatus = function(userId, status) {
  return this.find({ userId, status }).sort({ createdAt: -1 });
};

// Static method to get todos for a specific date range
todoSchema.statics.getByDateRange = function(userId, startDate, endDate) {
  return this.find({
    userId,
    $or: [
      { dueDate: { $gte: startDate, $lte: endDate } },
      { startDate: { $gte: startDate, $lte: endDate } },
    ],
  }).sort({ dueDate: 1, createdAt: -1 });
};

// Static method to get overdue todos
todoSchema.statics.getOverdue = function(userId) {
  return this.find({
    userId,
    dueDate: { $lt: new Date() },
    status: { $ne: 'completed' },
  }).sort({ dueDate: 1 });
};

export const Todo = mongoose.model('Todo', todoSchema);