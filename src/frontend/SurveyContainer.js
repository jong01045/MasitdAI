import React, { useState, useEffect } from 'react';
import DemographicPage from './SurveyPages/DemographicPage';
import GymExperiencePage from './SurveyPages/GymExperiencePage';
import GoalPage from './SurveyPages/GoalPage'
import BodyFocusPage from './SurveyPages/BodyFocusPage';
import ActivityLevelPage from './SurveyPages/ActivityLevelPage';
import HealthIssuePage from './SurveyPages/HealthIssuePage';
import EquipmentSelectionPage from './SurveyPages/EquipmentSelectionPage';
import WeeklyPlanPage from './SurveyPages/WeeklyPlanPage';
import ExercisePrefPage from './SurveyPages/ExercisePrefPage';

import './SurveyContainer.css';
import { current } from 'immer';

function SurveyContainer({onBack, onComplete}) {
  const [currentPage, setCurrentPage] = useState(0); // 0: Demographic, 1: Gym Experience

  const [showDots, setShowDots] = useState(false);

  const [visitedPages, setVisitedPages] = useState([0]);
  
  const [tempDotIndex, setTempDotIndex] = useState(null);

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
    setVisitedPages(prev => prev.includes(pageIndex) ? prev : [...prev, pageIndex]);
  };

  const isEmptyObject = (obj) => Object.keys(obj).length === 0; //Helper function to check empty object

  const handleDotClick = (index) => {
    console.log("User moved to page", index);

    const isMovingForward = index > currentPage;
    const isMovingBackward = index < currentPage;

    if (isMovingBackward) {
        console.log("Hey! Backward")
        setTempDotIndex(index); // Snap briefly to where the user clicked
    } else if (isMovingForward) {
        console.log("Hey! Forward")
        setTempDotIndex(index); // Snap briefly forward
    }

    // After 150ms, move to the correct position
    setTimeout(() => {
        setCurrentPage(index);
        setTempDotIndex(null); // Reset temporary position
    }, 150);
  };


  const [surveyData, setSurveyData] = useState({
    demographic: { age: '', gender: '', height: '', weight: '' },
    gymExperience: '',
    focusMuscleGroups: [],
    selectedEquipment: [],
    weeklyPlan: [],
    selectedExercises: {}
  });

  const updateDemographic = (data) => {
    setSurveyData(prev => ({ ...prev, demographic: {...prev.demographic, ...data} }));
  };

  const updateGymExperience = (experience) => {
    setSurveyData(prev => ({ ...prev, gymExperience: experience}));
  };

  const updateSelectedEquipment = (equipment) => {
    setSurveyData(prev => ({ ...prev, selectedEquipment: equipment }));
};

const updateWeeklyPlan = (selectedDays) => {
  setSurveyData(prev => ({ ...prev, weeklyPlan: selectedDays }));
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
              setSurveyData(prev => ({ ...prev, focusMuscleGroups: selectedParts }));
              console.log("focusMuscleGroups updated:", surveyData.focusMuscleGroups)
              handlePageChange(4);  // Next page index
            }}
            focusMuscleGroups = {surveyData.focusMuscleGroups}
          />
        </div>
        <div className="survey-slide">
          <ActivityLevelPage
            onBack={() => handlePageChange(3)}
            onNext={(selectedLevel) => {
              console.log("Selected activity level:", selectedLevel);
              handlePageChange(5);  // Next page index
            }}
          />
        </div>
        <div className="survey-slide">
          <HealthIssuePage
            onBack={() => handlePageChange(4)}
            onNext={(selectedIssues) => {
              console.log("Selected health issues:", selectedIssues);
              handlePageChange(6);  // Next page index
            }}
          />
        </div>
        <div className="survey-slide">
            <EquipmentSelectionPage
                onBack={() => handlePageChange(5)}  // Go back to HealthIssuePage
                onNext={(selectedEquipment) => {
                    console.log("Selected equipment:", selectedEquipment);
                    updateSelectedEquipment(selectedEquipment);
                    handlePageChange(7); // Move to the next step
                }}
            />
        </div>
        <div className="survey-slide">
            <WeeklyPlanPage
                onBack={() => handlePageChange(6)} // Navigate back to EquipmentSelectionPage
                onNext={(selectedDays) => {
                    console.log("Selected workout days:", selectedDays);
                    updateWeeklyPlan(selectedDays);
                    handlePageChange(8); // Move to the next page
                }}
            />
        </div>
        <div className="survey-slide">
            <ExercisePrefPage
                focusMuscleGroups={surveyData.focusMuscleGroups}
                onBack={() => handlePageChange(7)} // Adjust this index if needed
                onNext={(selectedExercises) => {
                    console.log("Selected exercises:", selectedExercises);
                    setSurveyData(prev => ({ ...prev, selectedExercises }));
                    onComplete(); 
                }}
            />
        </div>
      </div>
      <div className={`survey-dots ${showDots ? 'visible' : ''}`}>
        {(() => {
          const totalPages = 9; // Adjust dynamically based on the total survey pages
          const dotsToShow = Math.min(visitedPages.length, totalPages); // Show only visited dots

          let startPage = Math.max(0, currentPage - 2); // Try to center currentPage
          let endPage = startPage + 4; // Keep 4 dots max

          if (dotsToShow <= 5) {
            startPage = 0; // Show all visited dots when under 4 pages
            endPage = dotsToShow - 1;
          } else if (endPage >= dotsToShow) {
            endPage = dotsToShow - 1;
            startPage = Math.max(0, endPage - 4);
          }

          return visitedPages.slice(startPage, endPage + 1).map((page) => (
            <span
              key={page}
              className={`dot ${currentPage === page ? 'active' : ''} ${tempDotIndex === page ? 'temp-active' : ''}`}
              onClick={() => handleDotClick(page)}
            />
          ));
        })()}
      </div>
    </div>
  );
}

export default SurveyContainer;
