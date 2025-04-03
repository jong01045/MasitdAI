import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserMenu.css';

const UserMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add event listener if menu is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Menu items with icons and actions
  const menuItems = [
    { 
      icon: '👤', 
      label: 'Profile', 
      action: () => console.log('Profile clicked') 
    },
    { 
      icon: '⚙️', 
      label: 'Settings', 
      action: () => console.log('Settings clicked') 
    },
    { 
      icon: '📊', 
      label: 'Workout History', 
      action: () => console.log('Workout History clicked') 
    },
    { 
      icon: '💪', 
      label: 'My Progress', 
      action: () => console.log('My Progress clicked') 
    },
    { 
      divider: true 
    },
    { 
      icon: '🚪', 
      label: 'Logout', 
      action: () => {
        // Navigate to home/welcome page
        navigate('/');
        onClose();
      },
      className: 'logout-item'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className={`user-menu-container ${isOpen ? 'open' : ''}`}>
      <div className="user-menu" ref={menuRef}>
        <div className="user-menu-header">
          <div className="user-avatar">👤</div>
          <div className="user-info">
            <div className="user-name">John Doe</div>
            <div className="user-email">john@example.com</div>
          </div>
        </div>
        
        <ul className="menu-items">
          {menuItems.map((item, index) => 
            item.divider ? (
              <li key={`divider-${index}`} className="menu-divider"></li>
            ) : (
              <li 
                key={item.label} 
                className={`menu-item ${item.className || ''}`}
                onClick={() => {
                  item.action();
                  if (item.label !== 'Logout') onClose();
                }}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserMenu; 