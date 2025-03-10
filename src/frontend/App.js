import React from 'react';
import './App.css';

function App() {

  const handleStartNow = () => {
    console.log("Start Now clicked");
    // Add your action code here
  };

  const handleDownloadApp = () => {
    console.log("Download App clicked");
    // Add your action code here
  };

  const handleSignIn = () => {
    console.log("Sign in button clicked");
    // Add your action code here
  };

  const handleUserIcon = () => {
    console.log("User icon clicked");
    // Add your action code here
  };

  return (
    <div className="App">
      {/* Top Banner */}
      <div className="top-banner">
        <div className="banner-logo">MasidtAI</div>
        <div className="banner-icons">
          <div className="icon-search">🔍</div>
          <button className="login-button" onClick={handleSignIn}>Sign in</button>
          <div className="icon-user" onClick={handleUserIcon}>
            👤
            <div className="tooltip">Log in</div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <h1>We Train Smart. We Find Top Resources. We Gather Tips from Pros.</h1>
        <p>
          MasidtAI is your ultimate workout recommendation system, powered by advanced LLM.<br />
          Achieve your fitness goals with expert guidance, curated resources, and community support.
        </p>
        <div className="cta-buttons">
          <button className="cta-button" onClick={handleStartNow}>Start Now</button>
          <button className="cta-button" onClick={handleDownloadApp}>Download App</button>
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

      {/* Additional Content */}
      <div className="extra-content">
        <p>Below the grey pane, the background is black. You can add more content here.</p>
      </div>
    </div>
  );
}

export default App;