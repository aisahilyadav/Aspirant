import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/auth';

const PublicRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();

    // If user is already logged in, redirect to home page
    if (isLoggedIn) {
        return <Navigate to="/home" replace />;
    }

    // If user is not logged in, render the public component (login/register)
    return children;
};

export default PublicRoute;
