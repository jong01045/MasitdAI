// src/frontend/GymExperiencePage.js
import React, { useState } from 'react';
import './GymExperiencePage.css';

function GymExperiencePage({ onBack, onNext, gymExpData, updateGymExperience}) {

  const handleChange = (e) => updateGymExperience(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Gym Experience Submitted:", experience);
    onNext();
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
        </label>
      </form>
      <div className="gym-footer">
        <button className="next-button" onClick={handleSubmit}>Next</button>
      </div>
    </div>
  );
}

export default GymExperiencePage;
