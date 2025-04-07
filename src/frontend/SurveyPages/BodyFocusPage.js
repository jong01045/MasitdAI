import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Model, { IExerciseData } from "react-body-highlighter";
import "./BodyFocusPage.css";
import ConfirmationModal from "../Components/ConfirmationModal";

// Define muscle mappings for each body part
const bodyPartsMap = {
  Chest: ["chest"],
  Back: ["upper-back", "lower-back", "trapezius"],
  Shoulder: ["front-deltoids", "back-deltoids", "neck"],
  Arm: ["biceps", "triceps", "forearm"],
  Abs: ["abs", "obliques"],
  Quads: ["quadriceps", "abductors"],
  "Glutes and Hamstring": ["gluteal", "hamstring", "adductor"],
  Legs: ["quadriceps", "adductor", "gluteal", "hamstring", "abductors", "calves", "knees", "left-soleus", "right-soleus"],
  "Upper Body": [
    "upper-back", "lower-back", "trapezius",
    "front-deltoids", "back-deltoids",
    "chest", "abs",
    "biceps", "triceps", "forearm"
  ],
  "Full Body": [
    "upper-back", "lower-back", "trapezius",
    "front-deltoids", "back-deltoids", "neck",
    "chest", "abs", "obliques",
    "biceps", "triceps", "forearm",
    "quadriceps", "adductor", "knees",
    "gluteal", "hamstring", "abductors", "calves"
  ]
};

// Define parent-child relationships for hierarchical toggling
const hierarchy = {
  Legs: ["Quads", "Glutes and Hamstring"],
  "Upper Body": ["Back", "Shoulder", "Chest", "Abs", "Arm"],
  "Full Body": ["Legs", "Upper Body", "Quads", "Glutes and Hamstring", "Back", "Shoulder", "Chest", "Abs", "Arm"]
};

const filterObject = (obj) => {
  if (Array.isArray(obj)) {
      return obj.filter(item => {
          if (item === "Full Body") return false; // Remove Full Body
          if (item === "Upper Body") return false; // Remove Upper Body
          if (item === "Legs") return false; // Remove Legs
          return true; // Keep all other values
      });
  }

  return obj; // If it's not an array, return as-is
};

const bodyParts = Object.keys(bodyPartsMap);

function BodyFocusPage({ onBack, onNext }) {
  const navigate = useNavigate();
  const [selectedParts, setSelectedParts] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleLogoClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmNavigation = () => {
    navigate('/');
  };

  const togglePart = (part) => {
    let newSelection = [...selectedParts];

    if (selectedParts.includes(part)) {
      // Deselecting a part
      newSelection = newSelection.filter((p) => p !== part);

      // If deselecting a group (e.g., Full Body, Legs), remove its children
      if (hierarchy[part]) {
        hierarchy[part].forEach((child) => {
          newSelection = newSelection.filter((p) => p !== child);
        });
      }

      // If deselecting any child part while "Full Body" is active, turn it off
      if (selectedParts.includes("Full Body") && part !== "Full Body") {
        newSelection = newSelection.filter((p) => p !== "Full Body");
      }

      // If deselecting a part that belongs to a group, deselect the parent if necessary
      Object.entries(hierarchy).forEach(([parent, children]) => {
        if (children.includes(part)) {
          const stillSelected = children.some((child) => newSelection.includes(child));
          if (stillSelected) {
            newSelection = newSelection.filter((p) => p !== parent);
          }
        }
      });
    } else {
      // Selecting a part
      newSelection.push(part);

      // If selecting a group (e.g., Full Body, Legs), select its children
      if (hierarchy[part]) {
        hierarchy[part].forEach((child) => {
          if (!newSelection.includes(child)) {
            newSelection.push(child);
          }
        });
      }

      // If selecting all children of a group, turn on the parent
      Object.entries(hierarchy).forEach(([parent, children]) => {
        if (children.includes(part)) {
          const allSelected = children.every((child) => newSelection.includes(child));
          if (allSelected && !newSelection.includes(parent)) {
            newSelection.push(parent);
          }
        }
      });
    }

    setSelectedParts(newSelection);
  };

  // Generate data for `react-body-highlighter` (avoiding duplicates)
  const highlightedData = Array.from(
    new Set(selectedParts.flatMap((part) => bodyPartsMap[part] || []))
  ).map((muscle) => ({ name: muscle, muscles: [muscle] }));

  return (
    <div className="body-focus-page">
      {/* Header */}
      <div className="body-header">
        <button className="back-button" onClick={onBack}>
          <span className="back-icon">←</span>
          <span className="back-text">Back</span>
        </button>
        <div className="body-logo" onClick={handleLogoClick}>MasidtAI</div>
      </div>

      <div className="body-content">
        <h1>What body parts are you focusing?</h1>
        
        <div className="body-card">
          {/* Body part selection buttons */}
          <div className="body-buttons-container">
            {bodyParts.map((part) => (
              <div
                key={part}
                className={`body-option ${selectedParts.includes(part) ? "selected" : ""}`}
                onClick={() => togglePart(part)}
              >
                {part}
              </div>
            ))}
          </div>

          {/* Body diagram (Front & Back views) */}
          <div className="body-diagram">
            <Model data={highlightedData} style={{ width: "150px", height: "225px" }} />
            <Model type="posterior" data={highlightedData} style={{ width: "150px", height: "225px" }} />
          </div>
          
          {/* Footer with Next Button */}
          <div className="body-footer">
            <div className="body-selection-count">
              {selectedParts.length > 0 ? `${selectedParts.length} selected` : 'Select at least one body part'}
            </div>
            <button 
              className="next-button" 
              onClick={() => onNext(filterObject(selectedParts))} 
              disabled={selectedParts.length === 0}
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

export default BodyFocusPage;