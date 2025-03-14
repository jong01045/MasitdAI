import React, { useState, useEffect } from 'react';
import DemographicPage from './DemographicPage';
import GymExperiencePage from './GymExperiencePage';
import './SurveyContainer.css';

function SurveyContainer({onBack}) {
  const [currentPage, setCurrentPage] = useState(0); // 0: Demographic, 1: Gym Experience

  const [showDots, setShowDots] = useState(false);

  const totalPages = 9;
  const [visitedPages, setVisitedPages] = useState([0]);

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
    setVisitedPages(prev => prev.includes(pageIndex) ? prev : [...prev, pageIndex]);
  };

  const isEmptyObject = (obj) => Object.keys(obj).length === 0; //Helper function to check empty object

  const handleDotClick = (index) => {
    console.log("User moved to page", index);

    setCurrentPage(index);
  }

  const [surveyData, setSurveyData] = useState({
    demographic: { age: '', gender: '', height: '', weight: '' },
    gymExperience: ''
  });

  const updateDemographic = (data) => {
    setSurveyData(prev => ({ ...prev, demographic: {...prev.demographic, ...data} }));
  };

  const updateGymExperience = (experience) => {
    setSurveyData(prev => ({ ...prev, gymExperience: experience}));
  };

  const [errors, setErrors] = useState({
    demographicError: {},
    gymExperienceError: {}
  });

  const updateDemoError = (errors) => {
    setErrors(prev => ({ ...prev, demographicError: errors}))
  };

  const updateGymError = (errors) => {
    setErrors(prev => ({ ...prev, gymExperienceError: errors}))
  };

  const submitSurvey = () => {
    console.log("Final input data:", surveyData);
    // Backend that store data should go here.

    if (isEmptyObject(errors.demographicError) && isEmptyObject(errors.gymExperienceError)) {
      onBack();
    } else {
      console.log(errors)
    }
  };

  return (
    <div className="survey-container">
      <div className="survey-slider" style={{ transform: `translateX(-${currentPage * 100}%)` }}>
        <div className="survey-slide">
          <DemographicPage onBack={onBack} onNext={() => handlePageChange(1)} demographicData = {surveyData.demographic} updateDemographic={updateDemographic} updateDemoError = {updateDemoError} isEmptyObject = {isEmptyObject} />
        </div>
        <div className="survey-slide">
          <GymExperiencePage onBack={() => handlePageChange(0)} onNext={submitSurvey} gymExpData = {surveyData.gymExperience} updateGymExperience={updateGymExperience} updateGymError = {updateGymError} isEmptyObject = {isEmptyObject} />
        </div>
      </div>
      <div className={`survey-dots ${showDots ? 'visible' : ''}`}>
        {visitedPages.slice(-4).map((page, idx) => (
          <span
            key={page}
            className={`dot ${currentPage === page ? 'active' : ''}`}
            onClick={() => handleDotClick(page)}
          />
        ))}
      </div>
    </div>
  );
}

export default SurveyContainer;
