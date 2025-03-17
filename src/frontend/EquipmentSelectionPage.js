import React, { useState } from "react";
import "./EquipmentSelectionPage.css";

const equipmentOptions = [
  { title: "Full gym", id: "full_gym" },
  { title: "Barbells", id: "barbells" },
  { title: "Dumbbells", id: "dumbbells" },
  { title: "Kettlebells", id: "kettlebells" },
  { title: "Machines", id: "machines" },
  { title: "Cables", id: "cables" },
  { title: "None of the above", id: "none" }
];

function EquipmentSelectionPage({ onBack, onNext }) {
  const [selectedEquipment, setSelectedEquipment] = useState([]);

  const toggleEquipment = (id) => {
    if (id === "none") {
      setSelectedEquipment(["none"]); // Deselect everything else
    } else if (id === "full_gym") {
      setSelectedEquipment((prev) => {
        if (prev.includes("full_gym")) {
          return []; // Deselect everything if Full gym is deselected
        }
        
        const allOptionsExceptFullAndNone = equipmentOptions
          .filter((eq) => eq.id !== "full_gym" && eq.id !== "none")
          .map((eq) => eq.id);
        
        return [...new Set(["full_gym", ...allOptionsExceptFullAndNone])];
      });
    } else {
      setSelectedEquipment((prev) => {
        if (prev.includes("none")) {
          return [id];
        }
        
        const updatedSelection = prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id];
        
        const allOptionsExceptFullAndNone = equipmentOptions
          .filter((eq) => eq.id !== "full_gym" && eq.id !== "none")
          .map((eq) => eq.id);
        
        if (
          allOptionsExceptFullAndNone.every((eq) => updatedSelection.includes(eq))
        ) {
          updatedSelection.push("full_gym");
        }

        return updatedSelection;
      });
    }
  };

  return (
    <div className="equipment-selection-page">
      <div className="equipment-header">
        <button className="back-button" onClick={onBack}>Back</button>
        <div className="equipment-logo">MasidtAI</div>
      </div>

      <h1>Select Available Equipment</h1>

      <div className="equipment-buttons-container">
        {equipmentOptions.map((equipment) => (
          <button
            key={equipment.id}
            className={`equipment-button ${selectedEquipment.includes(equipment.id) ? "selected" : ""} ${equipment.id === "none" ? "none-button" : ""}`}
            onClick={() => toggleEquipment(equipment.id)}
          >
            <div className="checkbox">
              {selectedEquipment.includes(equipment.id) && <span className="checkmark">✔</span>}
            </div>
            <span className="equipment-text">{equipment.title}</span>
          </button>
        ))}
      </div>

      <div className="equipment-footer">
        <button className="next-button" onClick={() => onNext(selectedEquipment)} disabled={selectedEquipment.length === 0}>
          Next
        </button>
      </div>
    </div>
  );
}

export default EquipmentSelectionPage;
