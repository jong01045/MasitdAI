// New file: src/frontend/DemographicPage.js
import React, { useState } from 'react';
import './DemographicPage.css';

function DemographicPage({ onBack, onNext, demographicData, updateDemographic}) {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    console.log("Change occured")
    const { name, value } = e.target;
    const newData = { ...demographicData, [name]: value }

    let newErrors = { ...errors };

    // Validate numeric fields (age, weight, height)
    if (["age", "weight", "height"].includes(name)) {
      if (value === "" || isNaN(value) || parseInt(value) <= 0) {
        newErrors[name] = `Please enter a valid ${name}.`;
      } else {
        delete newErrors[name]; // Remove error if input is valid
      }
    }

    if (name === "gender" && value === "") {
      newErrors.gender = "Please select a gender.";
    } else if (name === "gender") {
      delete newErrors.gender;
    }

    setErrors(newErrors);

    updateDemographic(newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Demographic Data Submitted:", demographicData);
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
          <input type="number" name="age" value={demographicData?.age || ""} onChange={handleChange} required />
        </label>
        <label>
          Gender:
          <select name="gender" value={demographicData?.gender || ""} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Height (cm):
          <input type="number" name="height" value={demographicData?.height || ""} onChange={handleChange} required />
        </label>
        <label>
          Weight (kg):
          <input type="number" name="weight" value={demographicData?.weight || ""} onChange={handleChange} required />
        </label>
      </form>

      {/* Footer with Next button */}
      <div className="demographic-footer">
        <button className="next-button" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}

export default DemographicPage;
