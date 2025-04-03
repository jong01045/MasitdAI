import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WeeklyPlanPage.css";
import ConfirmationModal from "../Components/ConfirmationModal";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function WeeklyPlanPage({ onBack, onNext }) {
  const navigate = useNavigate();
  const [workoutDays, setWorkoutDays] = useState(4);
  const [selectedDays, setSelectedDays] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleLogoClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmNavigation = () => {
    navigate('/');
  };

  const handleSliderChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    setWorkoutDays(newValue);
    setSelectedDays((prev) => prev.slice(0, newValue));
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      }
      if (prev.length < workoutDays) {
        return [...prev, day];
      }
      return prev;
    });
  };

  return (
    <div className="weekly-plan-page">
      <div className="weekly-header">
        <button className="back-button" onClick={onBack}>Back</button>
        <div className="weekly-logo" onClick={handleLogoClick}>MasidtAI</div>
      </div>

      <h1>Set Your Weekly Workout Plan</h1>
      
      <div className="workout-days-container">
        <strong className="workout-days-count">{workoutDays} Days</strong>
        <p className="workout-days-text">{workoutDays} workouts a week</p>
      </div>

      <input
        type="range"
        min="1"
        max="7"
        value={workoutDays}
        onChange={handleSliderChange}
        className="workout-slider"
      />

      <div className="week-buttons-container">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            className={`week-button ${selectedDays.includes(day) ? "selected" : ""}`}
            onClick={() => toggleDay(day)}
            disabled={selectedDays.length >= workoutDays && !selectedDays.includes(day)}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="weekly-footer">
        <button className="next-button" onClick={() => onNext(selectedDays)} disabled={selectedDays.length === 0}>
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

export default WeeklyPlanPage;