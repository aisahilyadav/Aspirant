import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/auth';

const Home = () => {
    const { isLoggedIn, user } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {isLoggedIn ? (
                // Content for logged-in users
                <div className="text-center max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                        <h1 className="text-5xl font-bold mb-4 text-gray-800">
                            Welcome back, <span className="text-blue-600">{user?.username || 'User'}!</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Ready to continue your learning journey? Let's achieve your goals together!
                        </p>
                        
                       
                           
                            
                          
                            
                        {/* Recent Progress Section */}
                       
                    </div>
                </div>
            ) : (
                // Content for non-logged-in users
                <div className="text-center max-w-4xl mx-auto px-4">
                    <h1 className="text-6xl font-bold mb-6 text-gray-800">
                        Welcome to <span className="text-blue-600">ASPIRANT</span>
                    </h1>
                  
                    
                 
                   
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Link 
                            to="/signup" 
                            className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg font-semibold transition-colors shadow-lg"
                        >
                            🚀 Get Started - Sign Up
                        </Link>
                        <Link 
                            to="/login" 
                            className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 text-lg font-semibold transition-colors shadow-lg"
                        >
                            👋 Already a member? Login
                        </Link>
                    </div>
                    
                  
                </div>
            )}
        </div>
    );
};

export default Home;