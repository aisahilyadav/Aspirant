import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/auth';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, token } = useAuth();

    // Show loading while checking authentication
    if (token === null) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
                fontSize: '1.2rem',
                color: '#666'
            }}>
                Loading...
            </div>
        );
    }

    // If user is not logged in, redirect to login page
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // If user is logged in, render the protected component
    return children;
};

export default ProtectedRoute;
