import React from 'react';
import { useState } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";

const Login = () => {

      const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();
  

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8001/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const res_data = await response.json();
        console.log("Login successful:", res_data);
        
        // Store token in localStorage
        storeTokenInLS(res_data.token);
        
        // Clear input fields
        setUser({ email: "", password: "" });
        
        // Show success alert
        alert("🎉 Login successful! Welcome back!");
        
        // Navigate to home page
        navigate("/");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Login failed");
      }
    } catch (error) {
      console.log("login error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                placeholder="Enter your email"
                id="email"
                required
                autoComplete="email"
                value={user.email}
                onChange={handleInput}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                             type="password"
                name="password"
                placeholder="Enter your password"
                id="password"
                required
                autoComplete="current-password"
                value={user.password}
                onChange={handleInput}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-blue-600 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;