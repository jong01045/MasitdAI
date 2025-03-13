// src/frontend/GymExperiencePage.js
import React, { useState } from 'react';
import './GymExperiencePage.css';

function GymExperiencePage({ onBack, onNext, gymExpData, updateGymExperience, updateGymError}) {

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    console.log(e.target.value);
    updateGymExperience(e.target.value)
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (gymExpData === "") {
        newErrors["exp"] = `Please fill out experience.`;
      } else {delete newErrors["exp"]}

    if (Object.keys(newErrors).length > 0) {
      console.log("Errors found:", newErrors);
      setErrors(newErrors);
    } else {
      console.log("Gym Experience Submitted:", gymExpData);
      onNext();
    }

  };

  return (
    <div className="gym-experience-page">
      <div className="gym-header">
        <button className="back-button" onClick={onBack}>Back</button>
        <div className="gym-logo" onClick={onBack}>MasidtAI</div>
      </div>
      <h1>What's Your Gym Experience?</h1>
      <form onSubmit={handleSubmit} className="gym-form">
        <label>
          <input type="radio" name="experience" value="beginner" checked={gymExpData === 'beginner'} onChange={handleChange} />
          Beginner (No experience)
        </label>
        <label>
          <input type="radio" name="experience" value="novice" checked={gymExpData === 'novice'} onChange={handleChange} />
          Novice (1 year)
        </label>
        <label>
          <input type="radio" name="experience" value="intermediate" checked={gymExpData === 'intermediate'} onChange={handleChange} />
          Intermediate (2+ years)
        </label>
        <label>
          <input type="radio" name="experience" value="pro" checked={gymExpData === 'pro'} onChange={handleChange} />
          Pro (4+ years)
          {errors.exp && <p className="error-message">{errors.exp}</p>}
        </label>
      </form>
      <div className="gym-footer">
        <button className="next-button" onClick={handleSubmit}>Next</button>
      </div>
    </div>
  );
}

export default GymExperiencePage;
