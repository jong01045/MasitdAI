// New file: src/frontend/DemographicPage.js
import React, { useState } from 'react';
import './DemographicPage.css';

function DemographicPage({ onBack, onNext, demographicData, updateDemographic, updateDemoError}) {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    console.log("Change occured");

    const { name, value } = e.target;

    console.log(e.target)
    // Error check
    let newErrors = {...errors};

    // Validate numeric fields (age, weight, height)
    if (["age", "weight", "height"].includes(name)) {
      if (isNaN(value) || parseInt(value) <= 0) {  //Checks for any not number or negative
        newErrors[name] = `Please enter a valid ${name}.`;
      } else {
        delete newErrors[name]; // Remove error if input is valid
      }
    }

    if (name === "gender") {
      delete newErrors.gender;
    }

    setErrors(newErrors);
    updateDemoError(newErrors);
    
    const newData = { ...demographicData, [name]: value }

    updateDemographic(newData);
    
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // // Additional processing here if needed.

    let newErrors = {};

    Object.entries(demographicData).forEach(([key, value]) => {
      if (value === "") {
        newErrors[key] = `Please fill out ${key}.`;
      } 
    });

    if (Object.keys(newErrors).length > 0) {
      console.log("Errors found:", newErrors);
      setErrors(newErrors);
    } else {
      console.log("All fields are filled");
      console.log("Demographic Data Submitted:", demographicData);
      onNext();
    }
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
          <input type="number" name="age" value={demographicData?.age || ""} onChange={handleChange} required 
          onKeyDown={(e) => {
            if (e.key === "e" || e.key === "E" || e.key === "-" || e.key === "+") {
              e.preventDefault();
            }
          }} />
          {errors.age && <p className="error-message">{errors.age}</p>}
        </label>
        <label>
          Gender:
          <select name="gender" value={demographicData?.gender || ""} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="error-message">{errors.gender}</p>}
        </label>
        <label>
          Height (cm):
          <input type="number" name="height" value={demographicData?.height || ""} onChange={handleChange} required 
          onKeyDown={(e) => {
            if (e.key === "e" || e.key === "E" || e.key === "-" || e.key === "+") {
              e.preventDefault();
            }
          }} />
          {errors.height && <p className="error-message">{errors.height}</p>}
        </label>
        <label>
          Weight (kg):
          <input type="number" name="weight" value={demographicData?.weight || ""} onChange={handleChange} required 
          onKeyDown={(e) => {
            if (e.key === "e" || e.key === "E" || e.key === "-" || e.key === "+") {
              e.preventDefault();
            }
          }} />
          {errors.weight && <p className="error-message">{errors.weight}</p>}
        </label>
      </form>

      {/* Footer with Next button */}
      <div className="demographic-footer">
        <button className="next-button" onClick={handleSubmit}>Next</button>
      </div>
    </div>
  );
}

export default DemographicPage;
