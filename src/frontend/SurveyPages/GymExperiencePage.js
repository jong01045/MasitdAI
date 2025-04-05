import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GymExperiencePage.css";
import ConfirmationModal from "../Components/ConfirmationModal";

const gymExperienceLevels = [
  { title: "Beginner", subtitle: "(No Experience)", emoji: "🆕" },
  { title: "Novice", subtitle: "(1 Year Experience)", emoji: "💪" },
  { title: "Intermediate", subtitle: "(2+ Years Experience)", emoji: "🏋️" },
  { title: "Pro", subtitle: "(4+ Years Experience)", emoji: "🔥" }
];

function GymExperiencePage({ onBack, onNext }) {
  const navigate = useNavigate();
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleLogoClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmNavigation = () => {
    navigate('/');
  };

  return (
    <div className="gym-experience-page">
      {/* Header */}
      <div className="gym-header">
        <button className="back-button" onClick={onBack}>
          <span className="back-icon">←</span>
          <span className="back-text">Back</span>
        </button>
        <div className="gym-logo" onClick={handleLogoClick}>MasidtAI</div>
      </div>

      <div className="gym-content">
        <h1>What's Your Gym Experience?</h1>

        {/* Experience Selection Cards */}
        <div className="gym-card">
          <div className="gym-grid">
            {gymExperienceLevels.map((level) => (
              <div
                key={level.title}
                className={`gym-option ${selectedExperience === level.title ? "selected" : ""}`}
                onClick={() => setSelectedExperience(level.title)}
              >
                <span className="gym-emoji">{level.emoji}</span>
                <div className="gym-text">
                  <div className="gym-title">{level.title}</div>
                  <div className="gym-subtitle">{level.subtitle}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <div className="gym-footer">
            <button
              className="next-button"
              onClick={() => onNext(selectedExperience)}
              disabled={!selectedExperience}
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

export default GymExperiencePage;
