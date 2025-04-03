import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ActivityLevelPage.css";
import ConfirmationModal from "../Components/ConfirmationModal";

const activityLevels = [
  { title: "Sedentary", subtitle: "(Little to No Exercise)", emoji: "🛋️" },
  { title: "Lightly Active", subtitle: "(Light Exercise 1-3 Days/Week)", emoji: "🚶" },
  { title: "Moderately Active", subtitle: "(Moderate Exercise 3-5 Days/Week)", emoji: "🏃" },
  { title: "Very Active", subtitle: "(Hard Exercise 6-7 Days/Week)", emoji: "🏋️" },
  { title: "Super Active", subtitle: "(Athlete Level / Intense Job)", emoji: "🔥" },
];

function ActivityLevelPage({ onBack, onNext }) {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleLogoClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmNavigation = () => {
    navigate('/');
  };

  return (
    <div className="activity-level-page">
      {/* Header */}
      <div className="activity-header">
        <button className="back-button" onClick={onBack}>Back</button>
        <div className="activity-logo" onClick={handleLogoClick}>MasidtAI</div>
      </div>

      <h1>How active are you?</h1>

      {/* Activity Level Selection */}
      <div className="activity-buttons-container">
        {activityLevels.map((level) => (
          <button
            key={level.title}
            className={`activity-button ${selectedLevel === level.title ? "selected" : ""}`}
            onClick={() => setSelectedLevel(level.title)}
          >
            <div className="activity-text">
              <span className="activity-title">{level.title}</span>
              <span className="activity-subtitle">{level.subtitle}</span>
            </div>
            <span className="activity-emoji">{level.emoji}</span>
          </button>
        ))}
      </div>

      {/* Next Button */}
      <div className="activity-footer">
        <button
          className="next-button"
          onClick={() => onNext(selectedLevel)}
          disabled={!selectedLevel}
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

export default ActivityLevelPage;
