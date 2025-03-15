import React, { useState } from "react";
import "./HealthIssuePage.css";

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
  const [selectedIssues, setSelectedIssues] = useState([]);

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
        <button className="back-button" onClick={onBack}>Back</button>
        <div className="health-logo">MasidtAI</div>
      </div>

      <h1>Do you have any Health Issues?</h1>

      {/* Health Issue Selection */}
      <div className="health-buttons-container">
        {healthIssues.map((issue) => (
          <button
            key={issue.id}
            className={`health-button ${selectedIssues.includes(issue.id) ? "selected" : ""} ${issue.id === "none" ? "none-button" : ""}`}
            onClick={() => toggleIssue(issue.id)}
          >
            <div className="checkbox">
              {selectedIssues.includes(issue.id) && <span className="checkmark">✔</span>}
            </div>
            <span className="health-text">{issue.title}</span>
          </button>
        ))}
      </div>

      {/* Next Button */}
      <div className="health-footer">
        <button className="next-button" onClick={() => onNext(selectedIssues)} disabled={selectedIssues.length === 0}>
          Next
        </button>
      </div>
    </div>
  );
}

export default HealthIssuePage;
