// src/frontend/GymExperiencePage.js
import React, { useState } from 'react';
import './GymExperiencePage.css';

function GymExperiencePage({ onBack, onNext }) {
  const [experience, setExperience] = useState('');

  const handleChange = (e) => setExperience(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Gym Experience Submitted:", experience);
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
          <input type="radio" name="experience" value="beginner" checked={experience === 'beginner'} onChange={handleChange} />
          Beginner (No experience)
        </label>
        <label>
          <input type="radio" name="experience" value="novice" checked={experience === 'novice'} onChange={handleChange} />
          Novice (1 year)
        </label>
        <label>
          <input type="radio" name="experience" value="intermediate" checked={experience === 'intermediate'} onChange={handleChange} />
          Intermediate (2+ years)
        </label>
        <label>
          <input type="radio" name="experience" value="pro" checked={experience === 'pro'} onChange={handleChange} />
          Pro (4+ years)
        </label>
        <button type="submit" className="submit-button">Submit</button>
      </form>
      <div className="gym-footer">
        <button className="next-button" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}

export default GymExperiencePage;
