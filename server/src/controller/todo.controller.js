import { Todo } from '../model/todo.model.js';
import mongoose from 'mongoose';

// Create new todo
export const createTodo = async (req, res) => {
  try {
    const userId = req.userID;
    const todoData = {
      ...req.body,
      userId,
    };

    // Convert string dates to Date objects
    if (todoData.dueDate) {
      todoData.dueDate = new Date(todoData.dueDate);
    }
    if (todoData.startDate) {
      todoData.startDate = new Date(todoData.startDate);
    }

    const todo = await Todo.create(todoData);
    await todo.populate(['relatedQuiz', 'relatedPdf']);

    res.status(201).json({
      message: 'Todo created successfully',
      todo,
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({
      message: 'Failed to create todo',
      error: error.message,
    });
  }
};

// Get all todos for user
export const getTodos = async (req, res) => {
  try {
    const userId = req.userID;
    const {
      status,
      category,
      priority,
      startDate,
      endDate,
      overdue,
      page = 1,
      limit = 20,
    } = req.query;

    let query = { userId };

    // Apply filters
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    // Date range filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      query.$or = [
        { dueDate: { $gte: start, $lte: end } },
        { startDate: { $gte: start, $lte: end } },
      ];
    }

    // Overdue filter
    if (overdue === 'true') {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: 'completed' };
    }

    const skip = (page - 1) * limit;
    
    const [todos, total] = await Promise.all([
      Todo.find(query)
        .populate('relatedQuiz', 'topic numQuestions')
        .populate('relatedPdf', 'filename')
        .sort({ dueDate: 1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Todo.countDocuments(query),
    ]);

    res.json({
      todos,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      message: 'Failed to fetch todos',
      error: error.message,
    });
  }
};

// Get todo by ID
export const getTodoById = async (req, res) => {
  try {
    const { todoId } = req.params;
    const userId = req.userID;

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(400).json({ message: 'Invalid todo ID' });
    }

    const todo = await Todo.findOne({ _id: todoId, userId })
      .populate('relatedQuiz', 'topic numQuestions questions')
      .populate('relatedPdf', 'filename cloudinaryUrl');

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ todo });
  } catch (error) {
    console.error('Get todo by ID error:', error);
    res.status(500).json({
      message: 'Failed to fetch todo',
      error: error.message,
    });
  }
};

// Update todo
export const updateTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const userId = req.userID;
    const updateData = { ...req.body };

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(400).json({ message: 'Invalid todo ID' });
    }

    // Convert string dates to Date objects
    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: todoId, userId },
      updateData,
      { new: true, runValidators: true }
    ).populate(['relatedQuiz', 'relatedPdf']);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({
      message: 'Todo updated successfully',
      todo,
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({
      message: 'Failed to update todo',
      error: error.message,
    });
  }
};

// Delete todo
export const deleteTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const userId = req.userID;

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(400).json({ message: 'Invalid todo ID' });
    }

    const todo = await Todo.findOneAndDelete({ _id: todoId, userId });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      message: 'Failed to delete todo',
      error: error.message,
    });
  }
};

// Toggle subtask completion
export const toggleSubtask = async (req, res) => {
  try {
    const { todoId } = req.params;
    const { subtaskId, completed } = req.body;
    const userId = req.userID;

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(400).json({ message: 'Invalid todo ID' });
    }

    const todo = await Todo.findOne({ _id: todoId, userId });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const subtask = todo.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    subtask.completed = completed;
    if (completed) {
      subtask.completedDate = new Date();
    } else {
      subtask.completedDate = undefined;
    }

    await todo.save();

    res.json({
      message: 'Subtask updated successfully',
      todo,
    });
  } catch (error) {
    console.error('Toggle subtask error:', error);
    res.status(500).json({
      message: 'Failed to toggle subtask',
      error: error.message,
    });
  }
};

// Get todos for calendar (by date range) - Updated
export const getTodosForCalendar = async (req, res) => {
  try {
    const userId = req.userID;
    const { startDate, endDate, includeCreated } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'Start date and end date are required',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    let query = { userId };

    if (includeCreated === 'true') {
      // Include todos created in this period OR due in this period
      query.$or = [
        { createdAt: { $gte: start, $lte: end } },
        { dueDate: { $gte: start, $lte: end } },
        { startDate: { $gte: start, $lte: end } },
      ];
    } else {
      // Original query for due dates only
      query.$or = [
        { dueDate: { $gte: start, $lte: end } },
        { startDate: { $gte: start, $lte: end } },
      ];
    }

    const todos = await Todo.find(query)
      .populate('relatedQuiz', 'topic')
      .populate('relatedPdf', 'filename')
      .sort({ dueDate: 1, createdAt: -1 });

    // Return full todo data for calendar processing
    res.json({ todos });
  } catch (error) {
    console.error('Get calendar todos error:', error);
    res.status(500).json({
      message: 'Failed to fetch calendar todos',
      error: error.message,
    });
  }
};

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userID;

    const [
      totalTodos,
      notStarted,
      inProgress,
      completed,
      overdueTodos,
      todayTodos,
      weekTodos,
    ] = await Promise.all([
      Todo.countDocuments({ userId }),
      Todo.countDocuments({ userId, status: 'not-started' }),
      Todo.countDocuments({ userId, status: 'in-progress' }),
      Todo.countDocuments({ userId, status: 'completed' }),
      Todo.countDocuments({
        userId,
        dueDate: { $lt: new Date() },
        status: { $ne: 'completed' },
      }),
      Todo.countDocuments({
        userId,
        dueDate: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      }),
      Todo.countDocuments({
        userId,
        dueDate: {
          $gte: new Date(),
          $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    // Get recent activity
    const recentTodos = await Todo.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title status updatedAt');

    // Calculate completion rate
    const completionRate = totalTodos > 0 ? Math.round((completed / totalTodos) * 100) : 0;

    res.json({
      stats: {
        total: totalTodos,
        notStarted,
        inProgress,
        completed,
        overdue: overdueTodos,
        today: todayTodos,
        thisWeek: weekTodos,
        completionRate,
      },
      recentActivity: recentTodos,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      message: 'Failed to fetch dashboard stats',
      error: error.message,
    });
  }
};

// Helper functions
function getStatusColor(status) {
  switch (status) {
    case 'completed': return '#22c55e';
    case 'in-progress': return '#3b82f6';
    case 'not-started': return '#6b7280';
    default: return '#6b7280';
  }
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'high': return '#ef4444';
    case 'medium': return '#f59e0b';
    case 'low': return '#10b981';
    default: return '#6b7280';
  }
}