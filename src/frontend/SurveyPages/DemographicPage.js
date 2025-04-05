// New file: src/frontend/DemographicPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DemographicPage.css';
import ConfirmationModal from "../Components/ConfirmationModal";

function DemographicPage({ onBack, onNext, demographicData, updateDemographic, updateDemoError}) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
    
    let newErrors = {};

    Object.entries(demographicData).forEach(([key, value]) => {
      if (value === "") {
        newErrors[key] = `Please fill out ${key}.`;
      } 
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
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
                    type="number" 
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
                  <span className="unit-label">years</span>
                </div>
                {errors.age && <p className="error-message">{errors.age}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="height">Height</label>
                <div className="input-wrapper">
                  <input 
                    type="number" 
                    id="height" 
                    name="height" 
                    value={demographicData?.height || ""} 
                    onChange={handleChange} 
                    required 
                    min="1"
                    onKeyDown={(e) => {
                      if (e.key === "e" || e.key === "E" || e.key === "-" || e.key === "+") {
                        e.preventDefault();
                      }
                    }} 
                  />
                  <span className="unit-label">cm</span>
                </div>
                {errors.height && <p className="error-message">{errors.height}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="weight">Weight</label>
                <div className="input-wrapper">
                  <input 
                    type="number" 
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
                  <span className="unit-label">kg</span>
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
