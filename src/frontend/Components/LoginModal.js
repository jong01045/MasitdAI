import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css';
import { X } from 'lucide-react';

function LoginModal({ isOpen, onClose, initialTab = 'login' }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update activeTab when initialTab prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    // Add event listener when the modal is open
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Dummy user data for testing
  const dummyUsers = [
    { email: 'user@example.com', password: 'password123' },
    { email: 'test@example.com', password: 'test123' }
  ];

  // Form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [registerError, setRegisterError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Check if user exists in dummy data
    const userExists = dummyUsers.find(
      user => user.email === loginForm.email && user.password === loginForm.password
    );
    
    if (userExists) {
      // Navigate to main chat page on successful login
      navigate('/mainchat');
      onClose();
    } else {
      setError('Invalid email or password');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegisterError('');

    // Validate the form
    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }

    if (registerForm.password.length < 6) {
      setRegisterError('Password must be at least 6 characters long');
      return;
    }

    // Check if email already exists
    const userExists = dummyUsers.find(user => user.email === registerForm.email);
    if (userExists) {
      setRegisterError('Email already registered. Please sign in instead.');
      return;
    }

    // In a real app, we would save the user to the database here
    console.log('Registering user:', registerForm.email);
    
    // Redirect to survey
    navigate('/survey/0');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="login-modal">
        <div className="modal-fixed-section">
          <div className="modal-header">
            <div className="modal-logo">MasidtAI</div>
            <button className="close-button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="modal-tabs">
            <button 
              className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Already registered
            </button>
            <button 
              className={`tab-button ${activeTab === 'new' ? 'active' : ''}`}
              onClick={() => setActiveTab('new')}
            >
              New user
            </button>
          </div>
        </div>

        <div className="modal-scrollable-content">
          {activeTab === 'login' ? (
            <div className="login-form">
              <h2>Welcome back!</h2>
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="login-submit-btn">Sign In</button>
              </form>
              <div className="forgot-password">
                <a href="#forgot">Forgot password?</a>
              </div>
            </div>
          ) : (
            <div className="new-user">
              <h2>Welcome to MasidtAI!</h2>
              <div className="welcome-icon">🏋️‍♂️</div>
              <p>
                We're excited to help you achieve your fitness goals! Create an account to get started.
              </p>

              {registerError && <div className="error-message">{registerError}</div>}
              
              <form onSubmit={handleRegisterSubmit}>
                <div className="form-group">
                  <label htmlFor="register-email">Email</label>
                  <input 
                    type="email" 
                    id="register-email" 
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="register-password">Password</label>
                  <input 
                    type="password" 
                    id="register-password" 
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    required
                    minLength="6"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="register-confirm">Confirm Password</label>
                  <input 
                    type="password" 
                    id="register-confirm" 
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                    required
                  />
                </div>
                
                <div className="survey-info">
                  After registration, we'll ask a few questions to personalize your workout plan.
                </div>
                
                <button type="submit" className="start-survey-btn">
                  Register & Start Survey
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginModal; 