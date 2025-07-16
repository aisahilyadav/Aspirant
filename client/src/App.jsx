import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./store/auth";
import Layout from './components/Layout';
import Navbar from "./components/Navbar"; 
import AppRouter from './routes/AppRouter';
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        
          <AppRouter />
       
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;