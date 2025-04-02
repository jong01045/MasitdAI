import React from 'react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const isMobile = window.innerWidth < 768;

  return (
    <>
      {isOpen && isMobile && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-close-icon" onClick={onClose}>☰</div>
          <div className="sidebar-search-icon">🔍</div>
        </div>
        <div className="sidebar-content">
          <h3>Sidebar</h3>
          <p>Some menu items or settings</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
