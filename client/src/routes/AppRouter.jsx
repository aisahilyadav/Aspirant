import { Routes, Route } from 'react-router-dom';
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
import LandingPage from '../pages/Landingpage.jsx';
import Home from '../pages/Home.jsx';
import Layout from '@/components/Layout.jsx';

const AppRouter = () => (
  <Layout>
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/upload" element={<PublicRoute><UploadPdf /></PublicRoute>} />
    <Route path="/chat" element={<PublicRoute><ChatWithPdf /></PublicRoute>} />
    <Route path="/quizapp" element={<PublicRoute><QuizApp /></PublicRoute>} />
    <Route path="/quiz" element={<ProtectedRoute><PreQuiz /></ProtectedRoute>} />
    <Route path="/quiz/:quizId" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
    <Route path="/result/:quizId" element={<ProtectedRoute><QuizResult /></ProtectedRoute>} />
    <Route path="*" element={<h1>404 Not Found</h1>} />
  </Routes>
  </Layout>
);

export default AppRouter;
