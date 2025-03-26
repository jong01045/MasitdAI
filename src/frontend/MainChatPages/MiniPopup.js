import React, { useState, useEffect } from 'react';
import './MiniPopup.css';
import ConfirmStartWorkout from './ConfirmStartWorkout';
import { ArrowLeft, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MiniPopup = ({ muscleGroup, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

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
        <button className="popup-start-button" onClick={() => setShowConfirm(true)}>
          <Play size={16} style={{ marginRight: '6px' }} />
          Start Workout
        </button>
        {showConfirm && (
          <ConfirmStartWorkout
            onConfirm={() => {
              setShowConfirm(false);
              onClose(); // Close the modal
              navigate("/workout", { state: { muscleGroup } }); // ✅ Pass data to WorkoutPage
            }}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MiniPopup;
