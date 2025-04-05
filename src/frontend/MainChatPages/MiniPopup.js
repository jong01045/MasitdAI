import React, { useState, useEffect } from 'react';
import './MiniPopup.css';
import ConfirmStartWorkout from './ConfirmStartWorkout';
import { ArrowLeft, Play, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MiniPopup = ({ muscleGroup, onClose, onDelete }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(muscleGroup.id);
    setShowDeleteConfirm(false);
    handleClose();
  };

  if (!visible || !muscleGroup) return null;

  return (
    <div 
      className={`modal-overlay ${exiting ? 'fade-out' : ''}`} 
      onClick={handleClose}
      // Stop event propagation
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className={`modal-content ${exiting ? 'slide-down' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Back button */}
        <button className="popup-back-button" onClick={handleClose}>
          <ArrowLeft size={20} />
        </button>

        <div className="popup-header">
          <h3>{muscleGroup.name} Workout</h3>
        </div>

        <div className="popup-body">
          <p className="popup-description">Here are some recommended exercises for <strong>{muscleGroup.name}</strong>:</p>
          
          <div className="exercise-list">
            {muscleGroup.exercises.map((ex, i) => (
              <div key={i} className="exercise-item">
                <span className="exercise-bullet">•</span>
                <span className="exercise-name">{ex}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="popup-footer">
          {/* Delete button */}
          <button className="popup-delete-button" onClick={handleDelete}>
            <Trash2 size={16} style={{ marginRight: '6px' }} />
            Delete
          </button>

          {/* Start Workout button */}
          <button className="popup-start-button" onClick={() => setShowConfirm(true)}>
            <Play size={16} style={{ marginRight: '6px' }} />
            Start Workout
          </button>
        </div>

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

        {showDeleteConfirm && (
          <div className="delete-confirmation-popup">
            <p>Do you really want to delete this workout?</p>
            <div className="confirmation-buttons">
              <button className="confirm-yes" onClick={confirmDelete}>Yes, Delete</button>
              <button className="confirm-no" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniPopup;
