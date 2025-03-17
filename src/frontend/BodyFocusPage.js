import React, { useState } from "react";
import Model, { IExerciseData } from "react-body-highlighter";
import "./BodyFocusPage.css";

// Define muscle mappings for each body part
const bodyPartsMap = {
  Back: ["upper-back", "lower-back", "trapezius"],
  Arm: ["biceps", "triceps", "forearm"],
  Shoulder: ["front-deltoids", "back-deltoids", "neck"],
  Abs: ["abs", "obliques"],
  Chest: ["chest"],
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

const bodyParts = Object.keys(bodyPartsMap);

function BodyFocusPage({ onBack, onNext }) {
  const [selectedParts, setSelectedParts] = useState([]);

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
    console.log(newSelection);
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
        <button className="back-button" onClick={onBack}>Back</button>
        <div className="body-logo">MasidtAI</div>
      </div>

      <h1>What body parts are you focusing?</h1>
      {/* Body part selection buttons */}
      <div className="body-buttons-container">
        {bodyParts.map((part) => (
          <button
            key={part}
            className={`body-button ${selectedParts.includes(part) ? "selected" : ""}`}
            onClick={() => togglePart(part)}
          >
            {part}
          </button>
        ))}
      </div>

      {/* Body diagram (Front & Back views) */}
      <div className="body-diagram">
        <Model data={highlightedData} style={{ width: "150px", height: "225px" }} />
        <Model type="posterior" data={highlightedData} style={{ width: "150px", height: "225px" }} />
      </div>

      {/* Next Button */}
      <div className="body-footer">
        <button className="next-button" onClick={() => onNext(selectedParts)} disabled={selectedParts.length === 0}>
          Next
        </button>
      </div>
    </div>
  );
}

export default BodyFocusPage;