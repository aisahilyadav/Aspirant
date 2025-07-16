import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <GoogleOAuthProvider clientId="906396846679-6uassoiom86hq9vdr4mb5s06s9tmjrqe.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
  </React.StrictMode>
);