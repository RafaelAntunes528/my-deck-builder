import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Componente de Signup que permite aos usuários se registrarem com um nome de usuário, email e senha
// O componente faz uma requisição POST para a API para criar um novo usuário
// Se a senha e a confirmação de senha não coincidirem, exibe um alerta
// Se o usuário for criado com sucesso, exibe uma mensagem de sucesso e limpa os campos
// Se ocorrer um erro, exibe uma mensagem de erro
// O componente também inclui links para navegar para a página de login

function Signup() {
  const [username, setUsername] = useState(""); // Estado para armazenar o nome de usuário
  const [email, setEmail] = useState(""); // Estado para armazenar o email
  const [password, setPassword] = useState(""); // Estado para armazenar a senha
  const [confirmPassword, setConfirmPassword] = useState(""); // Estado para armazenar a confirmação da senha
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Password e Confirm Password precisam ser iguais.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3030/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setPasswordError(data.error || data.message || "Erro ao criar usuário");
        return;
      }

      alert(data.message || "Usuário criado com sucesso!");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
      navigate('/login'); // Redireciona para login após cadastro
    } catch (error) {
      console.error("Erro no signup:", error);
      setPasswordError("Erro de rede, tente novamente.");
    }
  };

  return (
    <>
    <div className="min-h-fit flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="my-4 bg-white/10 backdrop-blur-sm rounded-lg p-6 sm:p-8 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">
            Sign Up
          </h2>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="text-center text-gray-300 mb-4">
              <p className="text-sm">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-red-400 hover:underline"
                >
                  Login
                </a>
              </p>
            </div>
            <div className="text-left text-white font-semibold">
              <label htmlFor="username">Username:</label> <br />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="font-normal w-full px-3 py-2 border border-gray-800 rounded-md bg-black backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="text-left text-white font-semibold">
              <label htmlFor="email">Email:</label> <br />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-normal w-full px-3 py-2 border border-gray-800 rounded-md bg-black backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="text-left text-white font-semibold">
              <label htmlFor="password">Password:</label> <br />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                required
                placeholder="Enter your password"
                className="font-normal w-full px-3 py-2 border border-gray-800 rounded-md bg-black backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
            <div className="text-left text-white font-semibold">
              <label htmlFor="confirmPasswor">Confirm your password:</label>
              <br />
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError("");
                }}
                required
                placeholder="Confirm your password"
                className="font-normal w-full px-3 py-2 border border-gray-800 rounded-md bg-black backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <br />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-md transition-all duration-200 font-medium"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
    
      </>
  );
}

export default Signup;
