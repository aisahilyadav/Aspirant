import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

// Import existing pages
import HeroSection from '../components/HeroSection';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Quiz from '../pages/Quiz';
import PreQuiz from '../pages/PreQuiz';

import QuizResult from '../pages/QuizResult';
import ChatWithPdf from '../pages/ChatWithPdf';

// Import new Todo pages
import TodoDashboard from '../pages/TodoDashboard';
import TodoCalendar from '../pages/TodoCalendar';

function AppRouter() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <HeroSection />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <PreQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:quizId"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result/:quizId"
          element={
            <ProtectedRoute>
              <QuizResult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatWithPdf />
            </ProtectedRoute>
          }
        />
        
        {/* New Todo Routes */}
        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <TodoDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <TodoCalendar />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default AppRouter;
