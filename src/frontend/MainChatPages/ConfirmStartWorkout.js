import React from 'react';
import './ConfirmStartWorkout.css';

const ConfirmStartWorkout = ({ onConfirm, onCancel }) => {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
        <p className="confirm-message">Shall we start grinding?</p>
        <div className="confirm-buttons">
          <button className="btn-secondary" onClick={onCancel}>No</button>
          <button className="btn-primary" onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmStartWorkout;
