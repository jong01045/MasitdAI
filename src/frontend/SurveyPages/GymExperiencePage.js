import React, { useState } from "react";
import "./GymExperiencePage.css";

const gymExperienceLevels = [
  { title: "Beginner", subtitle: "(No Experience)", emoji: "🆕" },
  { title: "Novice", subtitle: "(1 Year Experience)", emoji: "💪" },
  { title: "Intermediate", subtitle: "(2+ Years Experience)", emoji: "🏋️" },
  { title: "Pro", subtitle: "(4+ Years Experience)", emoji: "🔥" }
];

function GymExperiencePage({ onBack, onNext }) {
  const [selectedExperience, setSelectedExperience] = useState(null);

  return (
    <div className="gym-experience-page">
      {/* Header */}
      <div className="gym-header">
        <button className="back-button" onClick={onBack}>Back</button>
        <div className="gym-logo">MasidtAI</div>
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
    </div>
  );
}

export default GymExperiencePage;
