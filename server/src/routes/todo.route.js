import express from 'express';
import {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  toggleSubtask,
  getTodosForCalendar,
  getDashboardStats,
} from '../controller/todo.controller.js';
import {
  createTodoSchema,
  updateTodoSchema,
  todoQuerySchema,
  subtaskToggleSchema,
} from '../validations/todo.validations.js';
import validate from '../middleware/validation.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Dashboard stats
router.get('/stats', getDashboardStats);

// Calendar todos
router.get('/calendar', getTodosForCalendar);

// CRUD operations
router.post('/', validate(createTodoSchema), createTodo);
router.get('/', getTodos);
router.get('/:todoId', getTodoById);
router.put('/:todoId', validate(updateTodoSchema), updateTodo);
router.delete('/:todoId', deleteTodo);

// Subtask operations
router.patch('/:todoId/subtasks', validate(subtaskToggleSchema), toggleSubtask);

export default router;