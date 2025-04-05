import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

function SurveyContainer({onBack, onComplete}) {
  const navigate = useNavigate();
  const { pageIndex } = useParams(); // from /survey/:pageIndex
  const currentPage = parseInt(pageIndex || '0', 10);

  const [showDots, setShowDots] = useState(true); // Set to true to show dots

  const [visitedPages, setVisitedPages] = useState([0]);
  
  const [tempDotIndex, setTempDotIndex] = useState(null);

  // Log the current page for debugging
  useEffect(() => {
    console.log("Current page:", currentPage);
    // Update visited pages on page change
    setVisitedPages(prev => prev.includes(currentPage) ? prev : [...prev, currentPage]);
  }, [currentPage]);

  useEffect(() => {
    // Apply smooth scroll to top when changing slides
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handlePageChange = (pageIndex) => {
    console.log("Changing to page:", pageIndex);
    navigate(`/survey/${pageIndex}`);
    // Visited pages updated in useEffect to ensure it captures direct URL changes too
  };

  const isEmptyObject = (obj) => Object.keys(obj).length === 0; //Helper function to check empty object

  const handleDotClick = (index) => {
    console.log("User moved to page", index);

    const isMovingForward = index > currentPage;
    const isMovingBackward = index < currentPage;

    if (isMovingBackward) {
        console.log("Moving backward");
        setTempDotIndex(index); // Snap briefly to where the user clicked
    } else if (isMovingForward) {
        console.log("Moving forward");
        setTempDotIndex(index); // Snap briefly forward
    }

    // After 150ms, move to the correct position
    setTimeout(() => {
      navigate(`/survey/${index}`);
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
        <div className={`survey-slide ${currentPage === 0 ? 'active' : ''}`} data-slide-index="0">
          <DemographicPage onBack={onBack} onNext={() => handlePageChange(1)} demographicData = {surveyData.demographic} updateDemographic={updateDemographic} updateDemoError = {updateDemoError} isEmptyObject = {isEmptyObject} />
        </div>
        <div className={`survey-slide ${currentPage === 1 ? 'active' : ''}`} data-slide-index="1">
          <GymExperiencePage onBack={() => handlePageChange(0)} onNext={() => handlePageChange(2)} gymExpData = {surveyData.gymExperience} updateGymExperience={updateGymExperience} updateGymError = {updateGymError} isEmptyObject = {isEmptyObject} />
        </div>
        <div className={`survey-slide ${currentPage === 2 ? 'active' : ''}`} data-slide-index="2">
          <GoalPage 
            onBack={() => handlePageChange(1)} 
            onNext={(selectedGoals) => {
              console.log("Goals received from GoalPage:", selectedGoals);
              handlePageChange(3);  // Assuming GoalPage is your third slide
            }}
          />
        </div>
        <div className={`survey-slide ${currentPage === 3 ? 'active' : ''}`} data-slide-index="3">
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
        <div className={`survey-slide ${currentPage === 4 ? 'active' : ''}`} data-slide-index="4">
          <ActivityLevelPage
            onBack={() => handlePageChange(3)}
            onNext={(selectedLevel) => {
              console.log("Selected activity level:", selectedLevel);
              handlePageChange(5);  // Next page index
            }}
          />
        </div>
        <div className={`survey-slide ${currentPage === 5 ? 'active' : ''}`} data-slide-index="5">
          <HealthIssuePage
            onBack={() => handlePageChange(4)}
            onNext={(selectedIssues) => {
              console.log("Selected health issues:", selectedIssues);
              handlePageChange(6);  // Next page index
            }}
          />
        </div>
        <div className={`survey-slide ${currentPage === 6 ? 'active' : ''}`} data-slide-index="6">
            <EquipmentSelectionPage
                onBack={() => handlePageChange(5)}  // Go back to HealthIssuePage
                onNext={(selectedEquipment) => {
                    console.log("Selected equipment:", selectedEquipment);
                    updateSelectedEquipment(selectedEquipment);
                    handlePageChange(7); // Move to the next step
                }}
            />
        </div>
        <div className={`survey-slide ${currentPage === 7 ? 'active' : ''}`} data-slide-index="7">
            <WeeklyPlanPage
                onBack={() => handlePageChange(6)} // Navigate back to EquipmentSelectionPage
                onNext={(selectedDays) => {
                    console.log("Selected workout days:", selectedDays);
                    updateWeeklyPlan(selectedDays);
                    handlePageChange(8); // Move to the next page
                }}
            />
        </div>
        <div className={`survey-slide ${currentPage === 8 ? 'active' : ''}`} data-slide-index="8">
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
          const totalPages = 9; // Total number of survey pages
          const dotsToShow = Math.min(visitedPages.length, totalPages); 

          let startPage = Math.max(0, currentPage - 2); // Try to center currentPage
          let endPage = startPage + 4; // Keep 5 dots visible at a time

          if (dotsToShow <= 5) {
            startPage = 0; // Show all visited dots when under 5 pages
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
              aria-label={`Go to page ${page + 1}`}
              role="button"
              tabIndex={0}
            />
          ));
        })()}
      </div>
    </div>
  );
}

export default SurveyContainer;
