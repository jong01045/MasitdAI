import React from 'react';
import './MiniPopup.css';

const MiniPopup = ({ muscleGroup, onClose }) => {
  if (!muscleGroup) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Back Button */}
        <button className="popup-back-button" onClick={onClose}>
          ←
        </button>

        {/* Main Content */}
        <h3>{muscleGroup.name} Details</h3>
        <p>Here are some recommended exercises for <strong>{muscleGroup.name}</strong>:</p>
        <ul>
          {muscleGroup.exercises.map((ex, i) => (
            <li key={i}>{ex}</li>
          ))}
        </ul>

        {/* Start Workout Button */}
        <button className="popup-start-button">
          Start Workout
        </button>
      </div>
    </div>
  );
};

export default MiniPopup;
