import React, { useState, useEffect } from 'react';
import './CreateWorkoutRoutine.css';
import { X } from 'lucide-react';

const CreateWorkoutRoutine = ({ onClose }) => {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      onClose();
    }, 250);
  };

  if (!visible) return null;

  return (
    <div className={`modal-overlay ${exiting ? 'fade-out' : ''}`} onClick={handleClose}>
      <div className={`modal-content ${exiting ? 'slide-down' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-button" onClick={handleClose}>
          <X size={20} />
        </button>
        <div className="popup-body">
          <h3>Create Your Own Workout</h3>
          <p>This is where you'll let users add a custom workout routine. (Design later)</p>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkoutRoutine;
