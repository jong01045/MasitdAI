import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HealthIssuePage.css";
import ConfirmationModal from "../Components/ConfirmationModal";

const healthIssues = [
  { title: "Can't do jumps", id: "jumps" },
  { title: "Back or hernia", id: "back" },
  { title: "Arms and shoulders", id: "arms" },
  { title: "Hip joints", id: "hip" },
  { title: "Knee", id: "knee" },
  { title: "Wrists", id: "wrists" },
  { title: "Neck", id: "neck" },
  { title: "Ankle", id: "ankle" },
  { title: "None of the above", id: "none" }
];

function HealthIssuePage({ onBack, onNext }) {
  const navigate = useNavigate();
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleLogoClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmNavigation = () => {
    navigate('/');
  };

  const toggleIssue = (id) => {
    if (id === "none") {
      setSelectedIssues(["none"]); // If "None of the above" is clicked, deselect everything else
    } else {
      setSelectedIssues((prev) => {
        if (prev.includes("none")) {
          return [id]; // If "None of the above" was selected, replace with the new selection
        }
        return prev.includes(id) ? prev.filter((issue) => issue !== id) : [...prev, id];
      });
    }
  };

  return (
    <div className="health-issue-page">
      {/* Header */}
      <div className="health-header">
        <button className="back-button" onClick={onBack}>
          <span className="back-icon">←</span>
          <span className="back-text">Back</span>
        </button>
        <div className="health-logo" onClick={handleLogoClick}>MasidtAI</div>
      </div>

      <div className="health-content">
        <h1>Do you have any Health Issues?</h1>

        {/* Health Issue Selection */}
        <div className="health-card">
          <div className="health-grid">
            {healthIssues.map((issue) => (
              <div
                key={issue.id}
                className={`health-option ${selectedIssues.includes(issue.id) ? "selected" : ""} ${issue.id === "none" ? "none-option" : ""}`}
                onClick={() => toggleIssue(issue.id)}
              >
                <div className="checkbox">
                  {selectedIssues.includes(issue.id) && <span className="checkmark">✓</span>}
                </div>
                <span className="health-text">{issue.title}</span>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <div className="health-footer">
            <div className="health-selection-count">
              {selectedIssues.length > 0 ? `${selectedIssues.length} selected` : 'Select at least one option'}
            </div>
            <button 
              className="next-button" 
              onClick={() => onNext(selectedIssues)} 
              disabled={selectedIssues.length === 0}
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

export default HealthIssuePage;
