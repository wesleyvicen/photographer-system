import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';  // CSS específico para a página de login

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    
    // Simulação de validação de login
    if (username === 'admin' && password === 'admin') {
      // Redireciona para o Dashboard após o login bem-sucedido
      navigate('/dashboard');
    } else {
      alert('Credenciais inválidas');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Usuário:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
