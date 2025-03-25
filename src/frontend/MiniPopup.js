// MiniPopup.js
import React from 'react';
import './MiniPopup.css';

const MiniPopup = ({ muscleGroup, onClose }) => {
  if (!muscleGroup) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{muscleGroup.name} Details</h3>
        <p>This is where details and exercises for <strong>{muscleGroup.name}</strong> will appear.</p>
        <ul>
          {muscleGroup.exercises.map((ex, i) => (
            <li key={i}>{ex}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MiniPopup;
