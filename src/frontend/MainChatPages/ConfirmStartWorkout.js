import React from 'react';
import './ConfirmStartWorkout.css';

const ConfirmStartWorkout = ({ onConfirm, onCancel }) => {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Start Workout</h3>
        <p>Are you ready to begin this workout session? Make sure you have the necessary equipment prepared.</p>
        <div className="confirm-buttons">
          <button className="confirm-button confirm-no" onClick={onCancel}>
            Not Now
          </button>
          <button className="confirm-button confirm-yes" onClick={onConfirm}>
            Let's Go!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmStartWorkout;
