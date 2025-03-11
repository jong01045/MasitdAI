import React, { useState } from 'react';
import DemographicPage from './DemographicPage';
import GymExperiencePage from './GymExperiencePage';
import './SurveyContainer.css';

function SurveyContainer({onBack}) {
  const [currentPage, setCurrentPage] = useState(0); // 0: Demographic, 1: Gym Experience

  const handleDotClick = (index) => {
    console.log("User moved to page", index)

    setCurrentPage(index);
  }

  const [surveyData, setSurveyData] = useState({
    demographic: { age: '', gender: '', height: '', weight: '' },
    gymExperience: ''
  });

  const updateDemographic = (data) => {
    setSurveyData(prev => ({ ...prev, demographic: data }));
  };

  const updateGymExperience = (experience) => {
    setSurveyData(prev => ({ ...prev, gymExperience: experience }));
  };

  const updateSurvey = () => {
    console.log("Final input data:", surveyData)

    updateDemographic();
    updateGymExperience();
    onBack();
  }

  return (
    <div className="survey-container">
      <div className="survey-slider" style={{ transform: `translateX(-${currentPage * 100}%)` }}>
        <div className="survey-slide">
          <DemographicPage onBack={onBack} onNext={() => setCurrentPage(1)} demographicData = {surveyData.demographic} updateDemographic={updateDemographic} />
        </div>
        <div className="survey-slide">
          <GymExperiencePage onBack={() => setCurrentPage(0)} onNext={updateSurvey} gymExpData = {surveyData.gymExperience} updateGymExperience={updateGymExperience}/>
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
