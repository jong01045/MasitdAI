// New file: src/frontend/DemographicPage.js
import React, { useState } from 'react';
import './DemographicPage.css';

function DemographicPage({ onBack, onNext }) {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Demographic Data Submitted:", formData);
    // Additional processing here if needed.
  };

  return (
    <div className="demographic-page">
      {/* Header with Back button and clickable logo */}
      <div className="demographic-header">
        <button className="back-button" onClick={onBack}>Back</button>
        <div className="demographic-logo" onClick={onBack}>MasidtAI</div>
      </div>

      <h1>Tell me about yourself!</h1>
      <form onSubmit={handleSubmit} className="demographic-form">
        <label>
          Age:
          <input type="number" name="age" value={formData.age} onChange={handleChange} required />
        </label>
        <label>
          Gender:
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Height (cm):
          <input type="number" name="height" value={formData.height} onChange={handleChange} required />
        </label>
        <label>
          Weight (kg):
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
        </label>
        <button type="submit" className="submit-button">Submit</button>
      </form>

      {/* Footer with Next button */}
      <div className="demographic-footer">
        <button className="next-button" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}

export default DemographicPage;
