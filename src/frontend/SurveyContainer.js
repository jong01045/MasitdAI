import React, { useState } from 'react';
import DemographicPage from './DemographicPage';
import GymExperiencePage from './GymExperiencePage';
import './SurveyContainer.css';

function SurveyContainer({onBack}) {
  const [currentPage, setCurrentPage] = useState(0); // 0: Demographic, 1: Gym Experience

  const handleDotClick = (index) => setCurrentPage(index);

  return (
    <div className="survey-container">
      <div className="survey-slider" style={{ transform: `translateX(-${currentPage * 100}%)` }}>
        <div className="survey-slide">
          <DemographicPage onBack={onBack} onNext={() => setCurrentPage(1)} />
        </div>
        <div className="survey-slide">
          <GymExperiencePage onBack={() => setCurrentPage(0)} onNext={() => { /* next action */ }} />
        </div>
      </div>
      <div className="survey-dots">
        <span className={`dot ${currentPage === 0 ? 'active' : ''}`} onClick={() => handleDotClick(0)}></span>
        <span className={`dot ${currentPage === 1 ? 'active' : ''}`} onClick={() => handleDotClick(1)}></span>
      </div>
    </div>
  );
}

export default SurveyContainer;
