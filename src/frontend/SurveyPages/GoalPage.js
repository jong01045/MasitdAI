// src/frontend/GoalPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GoalPage.css';
import ConfirmationModal from "../Components/ConfirmationModal";

function GoalPage({ onBack, onNext }) {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const goals = [
    "Improve fitness", "Build muscle", "Burn fat",
    "Increase endurance", "Mental strength", "Weight loss",
    "Balance", "Flexibility", "Relieve stress",
    "Optimize workouts", "Agility", "Reduce pain"
  ];

  const [selectedGoals, setSelectedGoals] = useState([]);

  const handleLogoClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmNavigation = () => {
    navigate('/');
  };

  const toggleGoal = (goal) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleNext = () => {
    onNext(selectedGoals);
  };

  return (
    <div className="goal-page">
      <div className="goal-header">
        <button className="back-button" onClick={onBack}>
          <span className="back-icon">←</span>
          <span className="back-text">Back</span>
        </button>
        <div className="goal-logo" onClick={handleLogoClick}>MasidtAI</div>
      </div>

      <div className="goal-content">
        <h1>Choose your goals</h1>

        <div className="goal-card">
          <div className="goal-grid">
            {goals.map((goal) => (
              <div
                key={goal}
                className={`goal-option ${selectedGoals.includes(goal) ? 'selected' : ''}`}
                onClick={() => toggleGoal(goal)}
              >
                {goal}
                {selectedGoals.includes(goal) && <span className="check-icon">✓</span>}
              </div>
            ))}
          </div>
          
          <div className="goal-footer">
            <div className="goal-selection-count">
              {selectedGoals.length > 0 ? `${selectedGoals.length} selected` : 'Select at least one goal'}
            </div>
            <button
              className="next-button"
              onClick={handleNext}
              disabled={selectedGoals.length === 0}
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmNavigation}
      />
    </div>
  );
}

export default GoalPage;
