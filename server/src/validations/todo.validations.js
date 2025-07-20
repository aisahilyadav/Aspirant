import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, { message: "Title cannot be empty" })
    .max(200, { message: "Title must not exceed 200 characters" }),
  
  description: z
    .string()
    .trim()
    .max(1000, { message: "Description must not exceed 1000 characters" })
    .optional(),
  
  status: z
    .enum(['not-started', 'in-progress', 'completed'])
    .default('not-started'),
  
  priority: z
    .enum(['low', 'medium', 'high'])
    .default('medium'),
  
  category: z
    .enum(['study', 'quiz', 'reading', 'research', 'assignment', 'exam', 'other'])
    .default('other'),
  
  dueDate: z
    .string()
    .datetime()
    .optional()
    .or(z.date().optional()),
  
  startDate: z
    .string()
    .datetime()
    .optional()
    .or(z.date().optional()),
  
  estimatedDuration: z
    .number()
    .min(0, { message: "Duration must be positive" })
    .optional(),
  
  tags: z
    .array(z.string().trim().max(50))
    .max(10, { message: "Maximum 10 tags allowed" })
    .optional(),
  
  isRecurring: z
    .boolean()
    .default(false),
  
  recurringPattern: z
    .enum(['daily', 'weekly', 'monthly'])
    .optional(),
  
  relatedQuiz: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Quiz ID")
    .optional(),
  
  relatedPdf: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid PDF ID")
    .optional(),
  
  subtasks: z
    .array(z.object({
      title: z.string().trim().min(1).max(150),
      completed: z.boolean().default(false),
    }))
    .max(20, { message: "Maximum 20 subtasks allowed" })
    .optional(),
  
  progress: z
    .number()
    .min(0)
    .max(100)
    .default(0),
  
  notes: z
    .string()
    .max(2000, { message: "Notes must not exceed 2000 characters" })
    .optional(),
});

export const updateTodoSchema = createTodoSchema.partial();

export const todoQuerySchema = z.object({
  status: z.enum(['not-started', 'in-progress', 'completed']).optional(),
  category: z.enum(['study', 'quiz', 'reading', 'research', 'assignment', 'exam', 'other']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  overdue: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export const subtaskToggleSchema = z.object({
  subtaskId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid subtask ID"),
  completed: z.boolean(),
});