// New file: src/frontend/DemographicPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DemographicPage.css';
import ConfirmationModal from "../Components/ConfirmationModal";

function DemographicPage({ onBack, onNext, demographicData, updateDemographic, updateDemoError}) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [units, setUnits] = useState({
    height: 'cm',
    weight: 'kg'
  });

  const handleLogoClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmNavigation = () => {
    navigate('/');
  };

  const isFormValid =
    demographicData.age &&
    demographicData.gender &&
    demographicData.height &&
    demographicData.weight &&
    Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Error check
    let newErrors = {...errors};

    // Validate numeric fields (age, weight, height)
    if (["age", "weight", "height"].includes(name)) {
      if (isNaN(value) || parseFloat(value) <= 0) {  //Checks for any not number or negative
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

  const handleUnitSwitch = (field) => {
    let newValue;
    let newUnit;

    // For height: switch between cm and ft/in
    if (field === 'height') {
      if (units.height === 'cm') {
        // Convert cm to feet/inches (stored as decimal feet)
        newValue = demographicData.height ? (parseFloat(demographicData.height) / 30.48).toFixed(2) : '';
        newUnit = 'ft';
      } else {
        // Convert feet to cm
        newValue = demographicData.height ? (parseFloat(demographicData.height) * 30.48).toFixed(0) : '';
        newUnit = 'cm';
      }
    }
    
    // For weight: switch between kg and lbs
    if (field === 'weight') {
      if (units.weight === 'kg') {
        // Convert kg to lbs
        newValue = demographicData.weight ? (parseFloat(demographicData.weight) * 2.20462).toFixed(1) : '';
        newUnit = 'lbs';
      } else {
        // Convert lbs to kg
        newValue = demographicData.weight ? (parseFloat(demographicData.weight) / 2.20462).toFixed(1) : '';
        newUnit = 'kg';
      }
    }

    // Update the units state
    setUnits({
      ...units,
      [field]: newUnit
    });

    // Update the value in the form
    const newData = { ...demographicData, [field]: newValue };
    updateDemographic(newData);
  };

  const displayHeightValue = () => {
    if (!demographicData.height) return '';
    
    if (units.height === 'ft') {
      const totalFeet = parseFloat(demographicData.height);
      const feet = Math.floor(totalFeet);
      const inches = Math.round((totalFeet - feet) * 12);
      return `${feet}'${inches}"`;
    }
    
    return demographicData.height;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let newErrors = {};

    Object.entries(demographicData).forEach(([key, value]) => {
      if (value === "") {
        newErrors[key] = `Please fill out ${key}.`;
      } 
    });

    // Convert all measurements to metric before submitting if they're not already
    let finalData = { ...demographicData };
    
    // Convert height to cm if it's in feet
    if (units.height === 'ft') {
      finalData.height = (parseFloat(demographicData.height) * 30.48).toFixed(0);
    }
    
    // Convert weight to kg if it's in pounds
    if (units.weight === 'lbs') {
      finalData.weight = (parseFloat(demographicData.weight) / 2.20462).toFixed(1);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Update the demographic data with converted values
      updateDemographic(finalData);
      onNext();
    }
  };

  // Gender options presented as cards
  const genderOptions = [
    { value: "female", label: "Female" },
    { value: "male", label: "Male" },
    { value: "other", label: "Other" }
  ];

  return (
    <div className="demographic-page">
      {/* Header with Back button and clickable logo */}
      <div className="demographic-header">
        <button className="back-button" onClick={onBack}>
          <span className="back-icon">←</span>
          <span className="back-text">Back</span>
        </button>
        <div className="demographic-logo" onClick={handleLogoClick}>MasitdAI</div>
      </div>

      <div className="demographic-content">
        <h1>Tell me about yourself</h1>
        
        <div className="demographic-card">
          <form className="demographic-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    id="age" 
                    name="age" 
                    value={demographicData?.age || ""} 
                    onChange={handleChange} 
                    required 
                    min="1"
                    onKeyDown={(e) => {
                      if (e.key === "e" || e.key === "E" || e.key === "-" || e.key === "+") {
                        e.preventDefault();
                      }
                    }} 
                  />
                  <div className="unit-display">years</div>
                </div>
                {errors.age && <p className="error-message">{errors.age}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="height">Height</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    id="height" 
                    name="height" 
                    value={units.height === 'ft' ? displayHeightValue() : demographicData?.height || ""} 
                    onChange={handleChange} 
                    required 
                    min="1"
                    onKeyDown={(e) => {
                      if (e.key === "e" || e.key === "E" || e.key === "-" || e.key === "+") {
                        e.preventDefault();
                      }
                    }} 
                  />
                  <button 
                    type="button" 
                    className="unit-switch" 
                    onClick={() => handleUnitSwitch('height')}
                    title="Click to toggle units"
                  >
                    {units.height}
                  </button>
                </div>
                {errors.height && <p className="error-message">{errors.height}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="weight">Weight</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    id="weight" 
                    name="weight" 
                    value={demographicData?.weight || ""} 
                    onChange={handleChange} 
                    required 
                    min="1"
                    onKeyDown={(e) => {
                      if (e.key === "e" || e.key === "E" || e.key === "-" || e.key === "+") {
                        e.preventDefault();
                      }
                    }} 
                  />
                  <button 
                    type="button" 
                    className="unit-switch" 
                    onClick={() => handleUnitSwitch('weight')}
                    title="Click to toggle units"
                  >
                    {units.weight}
                  </button>
                </div>
                {errors.weight && <p className="error-message">{errors.weight}</p>}
              </div>
            </div>
            
            <div className="gender-section">
              <label className="gender-label">Gender</label>
              <div className="gender-options">
                {genderOptions.map(option => (
                  <div 
                    key={option.value}
                    className={`gender-card ${demographicData?.gender === option.value ? 'selected' : ''}`}
                    onClick={() => handleChange({
                      target: { name: 'gender', value: option.value }
                    })}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
              {errors.gender && <p className="error-message">{errors.gender}</p>}
            </div>
          </form>
          
          <div className="form-actions">
            <button 
              className="next-button" 
              onClick={handleSubmit} 
              disabled={!isFormValid}
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

export default DemographicPage;
