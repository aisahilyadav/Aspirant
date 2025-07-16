import React from 'react';
import { useAuth } from '../store/auth';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] pt-4">
      <h1>HOME  SWEET HOME</h1>
    </div>
  );
};

export default Home;