import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EquipmentSelectionPage.css";
import ConfirmationModal from "../Components/ConfirmationModal";

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
  const navigate = useNavigate();
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleLogoClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmNavigation = () => {
    navigate('/');
  };

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
        <button className="back-button" onClick={onBack}>
          <span className="back-icon">←</span>
          <span className="back-text">Back</span>
        </button>
        <div className="equipment-logo" onClick={handleLogoClick}>MasidtAI</div>
      </div>

      <div className="equipment-content">
        <h1>Select Available Equipment</h1>

        <div className="equipment-card">
          <div className="equipment-grid">
            {equipmentOptions.map((equipment) => (
              <div
                key={equipment.id}
                className={`equipment-option ${selectedEquipment.includes(equipment.id) ? "selected" : ""} ${equipment.id === "none" ? "none-option" : ""}`}
                onClick={() => toggleEquipment(equipment.id)}
              >
                <div className="checkbox">
                  {selectedEquipment.includes(equipment.id) && <span className="checkmark">✓</span>}
                </div>
                <span className="equipment-text">{equipment.title}</span>
              </div>
            ))}
          </div>

          <div className="equipment-footer">
            <div className="equipment-selection-count">
              {selectedEquipment.length > 0 ? `${selectedEquipment.length} selected` : 'Select at least one option'}
            </div>
            <button 
              className="next-button" 
              onClick={() => onNext(selectedEquipment)} 
              disabled={selectedEquipment.length === 0}
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

export default EquipmentSelectionPage;
