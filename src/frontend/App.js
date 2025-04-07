import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import './App.css';
import SurveyContainer from './SurveyContainer';
import MainChatPage from './MainChatPage';
import WorkoutPage from './WorkoutPage';
import LoginModal from './Components/LoginModal';

function WelcomePage() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeLoginTab, setActiveLoginTab] = useState('login');

  const handleStartNow = () => {
    setActiveLoginTab('new');
    setShowLoginModal(true);
  };
  
  const handleSignIn = () => {
    setActiveLoginTab('login');
    setShowLoginModal(true);
  };

  return (
    <div className="App">
      <div className="top-banner">
        <div className="banner-logo" onClick={() => navigate('/')}>MasidtAI</div>
        <div className="banner-icons">
          <div className="icon-search">🔍</div>
          <button className="login-button" onClick={handleSignIn}>Sign in</button>
        </div>
      </div>

      <div className="hero-section">
        <h1>We Train Smart. We Find Top Resources. <br /> We Gather Tips from Pros.</h1>
        <p>
          MasidtAI is your ultimate workout recommendation system, powered by advanced LLM. <br />
          Achieve your fitness goals with expert guidance, curated resources, and community support.
        </p>
        <div className="cta-buttons">
          <button className="cta-button primary-cta" onClick={handleStartNow}>Start Now</button>
        </div>
        <div className="icon-features">
          <div className="feature-box">
            <div className="feature-icon">💪</div>
            <p>Personalized Workouts</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">📚</div>
            <p>Curated Resources</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">🤝</div>
            <p>Pro Tips & Community</p>
          </div>
        </div>
      </div>

      <div className="extra-content">
        <p>Stay fit, stay healthy with MasidtAI - your personal AI fitness companion</p>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        initialTab={activeLoginTab}
      />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      {/* 🔁 Redirect /survey to /survey/0 */}
      <Route path="/survey" element={<Navigate to="/survey/0" replace />} />
      {/* 🧠 Survey with slide index */}
      <Route path="/survey/:pageIndex" element={
        <SurveyContainer
          onBack={() => window.location.href = '/'}
          onComplete={() => window.location.href = '/mainchat'}
        />
      } />
      <Route path="/mainchat" element={<MainChatPage />} />
      <Route path="/workout" element={<WorkoutPage />} />
    </Routes>
  );
}

export default App;
