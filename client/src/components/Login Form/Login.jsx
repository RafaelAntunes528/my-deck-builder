import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../../api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username); // Salva o username
        console.log('Login successful:', data);
        navigate(`/profile/${username}`); // Redireciona para o perfil do usuário
      } else {
        console.error('Login failed:', data.message);
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Unable to connect to the server.');
    }
  };

  return (
    <div className="min-h-fit flex  justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="my-4 bg-white/10 backdrop-blur-sm rounded-lg p-6 sm:p-8 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-left text-sm font-medium text-gray-200 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-800 rounded-md bg-black backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-left text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-800 rounded-md bg-black backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex justify-end">
              <a href="/forgot-password" className="text-sm text-red-400 hover:underline">
                Forgot your password?
              </a>
            </div>
            <div className="flex justify-center gap-4">
              <button
                type="submit"
                className="bg-red-700 text-white font-semibold px-10 py-2 text-base rounded-lg hover:bg-black hover:text-white hover:scale-105 focus:bg-black focus:text-white focus:scale-105 transition duration-200 shadow border border-red-800 fonte-morisroman"
              >
                Login
              </button>
            </div>
            <div className="flex justify-center mt-3">
              <span className="text-sm text-gray-300">Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-red-400 hover:text-red-600 underline font-semibold transition-colors duration-150"
                >
                  Sign up
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
