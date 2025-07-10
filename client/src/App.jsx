import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './store/auth';
import Navbar from './components/Navbar';
import AppRouter from './routes/AppRouter';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppRouter />
      </Router>
    </AuthProvider>
  );
};

export default App;
