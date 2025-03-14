// src/frontend/GoalPage.js
import React, { useState } from 'react';
import './GoalPage.css';

function GoalPage({ onBack, onNext }) {
  const goals = [
    "Improve fitness", "Build muscle", "Burn fat",
    "Increase endurance", "Boost mental strength", "Weight loss",
    "Balance", "Flexibility", "Relieve stress",
    "Optimise workouts", "Agility", "Reduce back pain"
  ];

  const [selectedGoals, setSelectedGoals] = useState([]);

  const toggleGoal = (goal) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleNext = () => {
    console.log("Goals selected:", selectedGoals);
    onNext(selectedGoals); // Pass selected goals to parent component if needed
  };

  return (
    <div className="goal-page">
      <div className="goal-header">
        <button className="back-button" onClick={onBack}>Back</button>
        <div className="goal-logo" onClick={onBack}>MasidtAI</div>
      </div>

      <h1>Choose your goals</h1>

      <div className="goal-buttons-container">
        {goals.map((goal) => (
          <button
            key={goal}
            className={`goal-button ${selectedGoals.includes(goal) ? 'selected' : ''}`}
            onClick={() => toggleGoal(goal)}
          >
            {goal}
          </button>
        ))}
      </div>

      <div className="goal-footer">
        <button
          className="next-button"
          onClick={handleNext}
          disabled={selectedGoals.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default GoalPage;
