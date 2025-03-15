import React, { useState, useEffect } from 'react';
import DemographicPage from './DemographicPage';
import GymExperiencePage from './GymExperiencePage';
import GoalPage from './GoalPage'
import BodyFocusPage from './BodyFocusPage';
import './SurveyContainer.css';

function SurveyContainer({onBack}) {
  const [currentPage, setCurrentPage] = useState(0); // 0: Demographic, 1: Gym Experience

  const [showDots, setShowDots] = useState(false);

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
          <GymExperiencePage onBack={() => handlePageChange(0)} onNext={() => handlePageChange(2)} gymExpData = {surveyData.gymExperience} updateGymExperience={updateGymExperience} updateGymError = {updateGymError} isEmptyObject = {isEmptyObject} />
        </div>
        <div className="survey-slide">
          <GoalPage 
            onBack={() => handlePageChange(1)} 
            onNext={(selectedGoals) => {
              console.log("Goals received from GoalPage:", selectedGoals);
              handlePageChange(3);  // Assuming GoalPage is your third slide
            }}
          />
        </div>
        <div className="survey-slide">
          <BodyFocusPage
            onBack={() => handlePageChange(2)}
            onNext={(selectedParts) => {
              console.log("Selected body parts:", selectedParts);
              handlePageChange(4);  // Next page index
            }}
          />
        </div>

      </div>
      <div className={`survey-dots ${showDots ? 'visible' : ''}`}>
        {(() => {
          const totalPages = 9; // Adjust dynamically based on the total survey pages
          const dotsToShow = Math.min(visitedPages.length, totalPages); // Show only visited dots

          let startPage = Math.max(0, currentPage - 2); // Try to center currentPage
          let endPage = startPage + 3; // Keep 4 dots max

          if (dotsToShow <= 4) {
            startPage = 0; // Show all visited dots when under 4 pages
            endPage = dotsToShow - 1;
          } else if (endPage >= dotsToShow) {
            endPage = dotsToShow - 1;
            startPage = Math.max(0, endPage - 3);
          }

          return visitedPages.slice(startPage, endPage + 1).map((page) => (
            <span
              key={page}
              className={`dot ${currentPage === page ? 'active' : ''}`}
              onClick={() => handleDotClick(page)}
            />
          ));
        })()}
      </div>
    </div>
  );
}

export default SurveyContainer;
