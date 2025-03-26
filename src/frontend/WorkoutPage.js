import React, { useState } from 'react';
import './WorkoutPage.css';
import { ArrowLeft } from 'lucide-react';
import Sidebar from './Sidebar'; // if you extracted it
import { useLocation, useNavigate } from 'react-router-dom';

const WorkoutPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get the selected muscle group data
  const muscleGroup = location.state?.muscleGroup;

  const [activeTab, setActiveTab] = useState(muscleGroup?.exercises?.[0] || '');

  return (
    <div className="workout-wrapper">
      {/* Sidebar */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-close-icon" onClick={toggleSidebar}>☰</div>
          <div className="sidebar-search-icon">🔍</div>
        </div>
        <div className="sidebar-content">
          <p>Sidebar Content</p>
        </div>
      </div>

      {/* Main Chat Page */}
      <div className={`workout-container ${sidebarOpen ? 'sidebar-opened' : ''}`}>
        {/* Header */}
        <div className="chat-header">
          {window.innerWidth < 768 && (
            <div className="sidebar-icon" onClick={toggleSidebar}>☰</div>
          )}
          <div className="chat-logo">MasidAI</div>
          <div className="user-icon">👤</div>
        </div>

        {/* Main Content Area */}
        <div className="workout-main">
          <div className="workout-left-square">
            {/* Square content here */}
          </div>
          <div className="workout-right-tabs">
            <div className="tab-header">
              {muscleGroup?.exercises.map((exercise) => (
                <button
                  key={exercise}
                  className={`tab-button ${exercise === activeTab ? 'active' : ''}`}
                  onClick={() => setActiveTab(exercise)}
                >
                  {exercise}
                </button>
              ))}
            </div>
            <div className="tab-content">
              <p>Content for: <strong>{activeTab}</strong></p>
              {/* Dummy content now */}
            </div>
          </div>
        </div>

        {/* Chat Input Area (like MainChatPage) */}
        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <div className="chat-input-row">
              <textarea
                placeholder="Type your message..."
                className="chat-input"
              />
              <button className="chat-send-button">⏎</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage;
