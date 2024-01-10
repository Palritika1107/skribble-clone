// src/components/LoginPage.js
import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    // Perform any login logic or validation here
    if (username.trim() !== '') {
      // Call the onLogin function passed from the parent component
      onLogin(username);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
