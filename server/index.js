import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './src/db/connectionDb.js';
import authRoute from './src/routes/auth.route.js';
import quizRoutes from './src/routes/quiz.route.js';
import chatRoutes from './src/routes/chat.route.js';
import todoRoutes from './src/routes/todo.route.js'; // Add this import
import noteRoutes from './src/routes/note.route.js';
import dashboardRoutes from './src/routes/dashboard.route.js';
import settingsRoutes from './src/routes/settings.route.js';
import uploadRoutes from './src/routes/upload.route.js';
import errorMiddleware from './src/middleware/error.middleware.js';

const app = express();
const PORT = process.env.PORT || 8001;

//lets tackle cors
const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origin is not allowed by CORS'));
    },
    methods: "GET, PUT, POST, DELETE, PATCH, HEAD",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        next(error);
    }
});

//routes
app.use("/api/auth", authRoute);
app.use('/api/quiz', quizRoutes);
app.use('/api', chatRoutes);
app.use('/api/todos', todoRoutes); // Add this route
app.use('/api/notes', noteRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/uploads', uploadRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use(errorMiddleware);

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`server running at PORT ${PORT}`);
    });
}

export default app;
