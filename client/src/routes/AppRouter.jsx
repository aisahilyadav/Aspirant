import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import Profile from '../pages/Profile.jsx';
import UploadPdf from '../pages/Upload.jsx';
import ChatWithPdf from '../pages/ChatWithPdf.jsx';
import PreQuiz from '../pages/PreQuiz.jsx';
import Quiz from '../pages/Quiz.jsx';
import QuizApp from '../pages/QuizApp.jsx';
import QuizResult from '../pages/QuizResult.jsx';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/upload" element={<PublicRoute><UploadPdf /></PublicRoute>} />
    <Route path="/chat" element={<PublicRoute><ChatWithPdf /></PublicRoute>} />
    <Route path="/quizapp" element={<PublicRoute><QuizApp /></PublicRoute>} />
    <Route path="/quiz" element={<PublicRoute><PreQuiz /></PublicRoute>} />
    <Route path="/quiz/:quizId" element={<PublicRoute><Quiz /></PublicRoute>} />
    <Route path="/result/:quizId" element={<PublicRoute><QuizResult /></PublicRoute>} />
    <Route path="*" element={<h1>404 Not Found</h1>} />
  </Routes>
);

export default AppRouter;
