import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      // Store the role in localStorage
      const isAdmin = email === 'admin@example.com';
      localStorage.setItem('role', isAdmin ? 'admin' : 'user');

      // Redirect based on role
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed, please check your credentials');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg hover:opacity-90 transition duration-300"
          >
            Login
          </button>
        </form>

        <button
          onClick={handleRegister}
          className="w-full py-3 mt-4 bg-gradient-to-r from-gray-500 to-gray-700 text-white font-bold rounded-lg hover:opacity-90 transition duration-300"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
