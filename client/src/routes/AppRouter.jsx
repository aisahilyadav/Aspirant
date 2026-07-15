import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

// Import existing pages
import LandingPage from '../pages/Landingpage';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Quiz from '../pages/Quiz';
import PreQuiz from '../pages/PreQuiz';
import Notes from '../pages/Notes';
import Settings from '../pages/Settings';
import Product from '../pages/Product';
import Explore from '../pages/Explore';
import Docs from '../pages/Docs';
import About from '../pages/About';
import Contact from '../pages/Contact';

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
              <LandingPage />
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

        {/* Public Marketing Routes */}
        <Route path="/product" element={<Product />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

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
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
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
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default AppRouter;
