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
        <button className="back-button" onClick={onBack}>
          <span className="back-icon">←</span>
          <span className="back-text">Back</span>
        </button>
        <div className="activity-logo" onClick={handleLogoClick}>MasidtAI</div>
      </div>

      <div className="activity-content">
        <h1>How active are you?</h1>

        {/* Activity Level Selection Card */}
        <div className="activity-card">
          <div className="activity-grid">
            {activityLevels.map((level) => (
              <div
                key={level.title}
                className={`activity-option ${selectedLevel === level.title ? "selected" : ""}`}
                onClick={() => setSelectedLevel(level.title)}
              >
                <span className="activity-emoji">{level.emoji}</span>
                <div className="activity-text">
                  <div className="activity-title">{level.title}</div>
                  <div className="activity-subtitle">{level.subtitle}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <div className="activity-footer">
            <button
              className="next-button"
              onClick={() => onNext(selectedLevel)}
              disabled={!selectedLevel}
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

export default ActivityLevelPage;
