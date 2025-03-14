import React, { useState, useEffect } from 'react';
import DemographicPage from './DemographicPage';
import GymExperiencePage from './GymExperiencePage';
import './SurveyContainer.css';

function SurveyContainer({onBack}) {
  const [currentPage, setCurrentPage] = useState(0); // 0: Demographic, 1: Gym Experience

  const [showDots, setShowDots] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show dots when scrolled down more than 100px
      if (window.scrollY > 100) {
        setShowDots(true);
      } else {
        setShowDots(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
          <DemographicPage onBack={onBack} onNext={() => setCurrentPage(1)} demographicData = {surveyData.demographic} updateDemographic={updateDemographic} updateDemoError = {updateDemoError} isEmptyObject = {isEmptyObject} />
        </div>
        <div className="survey-slide">
          <GymExperiencePage onBack={() => setCurrentPage(0)} onNext={submitSurvey} gymExpData = {surveyData.gymExperience} updateGymExperience={updateGymExperience} updateGymError = {updateGymError} isEmptyObject = {isEmptyObject} />
        </div>
      </div>
      <div className={`survey-dots ${showDots ? 'visible' : ''}`}>
        <span className={`dot ${currentPage === 0 ? 'active' : ''}`} onClick={() => handleDotClick(0)}></span>
        <span className={`dot ${currentPage === 1 ? 'active' : ''}`} onClick={() => handleDotClick(1)}></span>
      </div>
    </div>
  );
}

export default SurveyContainer;
