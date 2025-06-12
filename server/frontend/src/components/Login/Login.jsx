import React, { useState } from 'react';
import "./Login.css";
import Header from '../Header/Header';

const Login = ({ onClose }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    // Debug: Log the login attempt
    console.log("Attempting login with:", { userName });

    const response = await fetch('/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'  // Helps Django identify AJAX
      },
      body: JSON.stringify({
        userName: userName,
        password: password
      }),
      credentials: 'include'  // Required for session cookies
    });

    // Debug: Log raw response
    console.log("Raw response:", {
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Login failed with:", errorData);
      throw new Error(errorData.error || `Login failed (${response.status})`);
    }

    const data = await response.json();
    console.log("Login successful:", data);

    // Store user data and redirect
    sessionStorage.setItem('username', data.userName);
    sessionStorage.setItem('authStatus', 'authenticated');
    
    // Redirect to home page
    window.location.href = "/";

  } catch (error) {
    console.error("Login error:", error);
    setError(error.message || "Login failed. Please try again.");
    
    // Clear password field on error
    setPassword("");
    
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div>
      <Header/>
      <div onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()} className='modalContainer'>
          <form className="login_panel" onSubmit={login}>
            {error && <div className="error-message">{error}</div>}
            
            <div>
              <label className="input_field">
                Username
                <input 
                  type="text" 
                  name="username" 
                  placeholder="Username" 
                  className="input_field" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </label>
            </div>
            
            <div>
              <label className="input_field">
                Password
                <input 
                  name="psw" 
                  type="password" 
                  placeholder="Password" 
                  className="input_field" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </label>            
            </div>
            
            <div className="button-group">
              <button 
                type="submit" 
                className="action_button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner">Logging in...</span>
                ) : "Login"}
              </button>
              
              <button
                type="button" 
                className="action_button secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
            
            <div className="register-link">
              <a href="/register">Register Now</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
