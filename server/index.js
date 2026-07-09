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

const app = express();
const PORT = process.env.PORT || 8001;

//lets tackle cors
const corsOptions = {
    origin: "http://localhost:3000",
    methods: "GET, PUT, POST, DELETE, PATCH, HEAD",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/auth", authRoute);
app.use('/api/quiz', quizRoutes);
app.use('/api', chatRoutes);
app.use('/api/todos', todoRoutes); // Add this route
app.use('/api/notes', noteRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Connect to MongoDB
connectDB().then(() =>{
    app.listen(PORT, () => {
        console.log(`server running at PORT ${PORT}`);
    })
}).catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
});

