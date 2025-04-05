import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WeeklyPlanPage.css";
import ConfirmationModal from "../Components/ConfirmationModal";
import TodayIcon from '@mui/icons-material/Today';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const daysOfWeek = [
  { id: "Mon", name: "Monday", short: "Mon" },
  { id: "Tue", name: "Tuesday", short: "Tue" },
  { id: "Wed", name: "Wednesday", short: "Wed" },
  { id: "Thu", name: "Thursday", short: "Thu" },
  { id: "Fri", name: "Friday", short: "Fri" },
  { id: "Sat", name: "Saturday", short: "Sat" },
  { id: "Sun", name: "Sunday", short: "Sun" }
];

function WeeklyPlanPage({ onBack, onNext }) {
  const navigate = useNavigate();
  const [workoutDays, setWorkoutDays] = useState(4);
  const [selectedDays, setSelectedDays] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [animatingDay, setAnimatingDay] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Check screen size for responsive display
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle logo click to show confirmation modal
  const handleLogoClick = () => {
    setShowConfirmModal(true);
  };

  // Handle confirmation to navigate back to home
  const handleConfirmNavigation = () => {
    navigate('/');
  };

  // Handle slider change to update number of workout days
  const handleSliderChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    setWorkoutDays(newValue);
    
    // If we have more selected days than the new value allows, keep only the first N days
    if (selectedDays.length > newValue) {
      setSelectedDays((prev) => prev.slice(0, newValue));
    }
  };

  // Toggle day selection with animation
  const toggleDay = (day) => {
    setAnimatingDay(day.id);
    setTimeout(() => setAnimatingDay(null), 500);

    setSelectedDays((prev) => {
      if (prev.includes(day.id)) {
        return prev.filter((d) => d !== day.id);
      }
      if (prev.length < workoutDays) {
        return [...prev, day.id];
      }
      return prev;
    });
  };

  // Calculate remaining workout slots
  const remainingSlots = workoutDays - selectedDays.length;

  return (
    <div className="weekly-plan-page">
      <div className="weekly-header">
        <button className="back-button" onClick={onBack}>
          <span className="back-icon">←</span>
          <span className="back-text">Back</span>
        </button>
        <div className="weekly-logo" onClick={handleLogoClick}>MasitdAI</div>
      </div>

      <div className="weekly-content">
        <h1>Choose Your Workout Days</h1>
        
        <div className="info-cards">
          <div className="info-card">
            <div className="info-card-icon">
              <FitnessCenterIcon />
            </div>
            <div className="info-card-content">
              <div className="info-card-value">{workoutDays}</div>
              <div className="info-card-label">Workouts per week</div>
            </div>
          </div>
          
          <div className="info-card">
            <div className="info-card-icon">
              <TodayIcon />
            </div>
            <div className="info-card-content">
              <div className="info-card-value">{selectedDays.length}</div>
              <div className="info-card-label">Days selected</div>
            </div>
          </div>
          
          <div className="info-card">
            <div className="info-card-icon status-icon">
              {remainingSlots === 0 ? (
                <CheckCircleIcon className="complete-icon" />
              ) : (
                <span className="remaining-count">{remainingSlots}</span>
              )}
            </div>
            <div className="info-card-content">
              <div className="info-card-value">{remainingSlots === 0 ? "Complete" : `${remainingSlots} more`}</div>
              <div className="info-card-label">{remainingSlots === 0 ? "Ready to continue" : "Days to select"}</div>
            </div>
          </div>
        </div>
        
        <div className="slider-container">
          <div className="slider-label">Adjust workout frequency:</div>
          <input
            type="range"
            min="1"
            max="7"
            value={workoutDays}
            onChange={handleSliderChange}
            className="workout-slider"
          />
          <div className="slider-values">
            <span>1 day</span>
            <span>7 days</span>
          </div>
        </div>

        <div className="calendar-container">
          {daysOfWeek.map((day) => (
            <div 
              key={day.id}
              className={`calendar-day ${selectedDays.includes(day.id) ? "selected" : ""} ${animatingDay === day.id ? "animating" : ""}`}
              onClick={() => toggleDay(day)}
              disabled={selectedDays.length >= workoutDays && !selectedDays.includes(day.id)}
            >
              <div className="day-name">{day.short}</div>
              <div className="day-circle">
                {selectedDays.includes(day.id) && <CheckCircleIcon className="check-icon" />}
              </div>
            </div>
          ))}
        </div>

        <div className="weekly-footer">
          <button 
            className="next-button" 
            onClick={() => onNext(selectedDays)} 
            disabled={selectedDays.length === 0 || selectedDays.length < workoutDays}
          >
            {selectedDays.length < workoutDays 
              ? `Select ${workoutDays - selectedDays.length} more days` 
              : "Continue"}
          </button>
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

export default WeeklyPlanPage;