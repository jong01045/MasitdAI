import React, { useState, useEffect } from 'react';
import './MiniPopup.css';
import { ArrowLeft, Play } from 'lucide-react';

const MiniPopup = ({ muscleGroup, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (muscleGroup) {
      setVisible(true);
      setExiting(false);
    }
  }, [muscleGroup]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      onClose();
    }, 250); // Matches animation duration
  };

  if (!visible || !muscleGroup) return null;

  return (
    <div className={`modal-overlay ${exiting ? 'fade-out' : ''}`} onClick={handleClose}>
      <div
        className={`modal-content ${exiting ? 'slide-down' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Back button */}
        <button className="popup-back-button" onClick={handleClose}>
          <ArrowLeft size={20} />
        </button>

        <div className="popup-body">
          <h3>{muscleGroup.name} Details</h3>
          <p>Here are some recommended exercises for <strong>{muscleGroup.name}</strong>:</p>
          <ul>
            {muscleGroup.exercises.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </div>

        {/* Start Workout button */}
        <button className="popup-start-button">
          <Play size={16} style={{ marginRight: '6px' }} />
          Start Workout
        </button>
      </div>
    </div>
  );
};

export default MiniPopup;
