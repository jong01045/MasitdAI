import React from 'react';
import ReactDOM from 'react-dom';
import './ConfirmationModal.css';

function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;

  // Create portal to render modal at the root level, outside of any slides
  return ReactDOM.createPortal(
    <div className="confirmation-overlay">
      <div className="confirmation-modal">
        <div className="confirmation-content">
          <div className="confirmation-icon">❓</div>
          <p className="confirmation-message">{message || "Do you want to go back to the welcome page?"}</p>
          <div className="confirmation-buttons">
            <button 
              className="confirm-button yes-button" 
              onClick={onConfirm}
            >
              Yes
            </button>
            <button 
              className="confirm-button no-button" 
              onClick={onClose}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body // Render directly to body element
  );
}

export default ConfirmationModal; 