import React, { useState } from 'react';
import './WorkoutPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import UserMenu from './Components/UserMenu';

const WorkoutPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const closeUserMenu = () => setUserMenuOpen(false);
  
  const location = useLocation();

  // Get the selected muscle group data
  const muscleGroup = location.state?.muscleGroup;

  const [activeTab, setActiveTab] = useState(muscleGroup?.exercises?.[0] || '');

  const isMobile = window.innerWidth < 768;

  return (
    <div className="workout-wrapper">
      {/* Sidebar */}     
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
      <div
        className={`workout-container 
          ${sidebarOpen && !isMobile ? 'sidebar-opened' : ''} 
          ${sidebarOpen && isMobile ? 'sidebar-blur' : ''}`}
        onClick={() => {
          if (sidebarOpen && isMobile) {
            setSidebarOpen(false);
          }
          // Close user menu if clicking elsewhere
          if (userMenuOpen) {
            closeUserMenu();
          }
        }}
      >
        {/* Header */}
        <div className="chat-header">
          {!sidebarOpen && (
            <div className="sidebar-icon" onClick={toggleSidebar}>☰</div>
          )}
          <div className="chat-logo">MasitdAI</div>
          <div className="user-icon" onClick={toggleUserMenu}>👤</div>
          
          {/* User Menu */}
          <UserMenu isOpen={userMenuOpen} onClose={closeUserMenu} />
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
