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
        <button className="back-button" onClick={onBack}>Back</button>
        <div className="gym-logo" onClick={handleLogoClick}>MasidtAI</div>
      </div>

      <h1>What's Your Gym Experience?</h1>

      {/* Experience Selection Buttons */}
      <div className="gym-buttons-container">
        {gymExperienceLevels.map((level) => (
          <button
            key={level.title}
            className={`gym-button ${selectedExperience === level.title ? "selected" : ""}`}
            onClick={() => setSelectedExperience(level.title)}
          >
            <div className="gym-text">
              <span className="gym-title">{level.title}</span>
              <span className="gym-subtitle">{level.subtitle}</span>
            </div>
            <span className="gym-emoji">{level.emoji}</span>
          </button>
        ))}
      </div>

      {/* Next Button */}
      <div className="gym-footer">
        <button
          className="next-button"
          onClick={() => onNext(selectedExperience)}
          disabled={!selectedExperience}
        >
          Next
        </button>
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
