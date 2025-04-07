import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ExercisePrefPage.css";
import { Card, Button, TextField, Autocomplete, ThemeProvider, createTheme, Chip, Box, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import ConfirmationModal from "../Components/ConfirmationModal";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CloseIcon from '@mui/icons-material/Close';

// Create a custom MUI theme to match our design system
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4f91f3',
    },
    secondary: {
      main: '#2ecc71',
    },
    background: {
      paper: '#223048',
      default: '#1e293b',
    },
    text: {
      primary: '#f5f7fa',
      secondary: '#a3b1cc',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4f91f3',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4f91f3',
            borderWidth: 2,
          },
          backgroundColor: 'rgba(30, 41, 59, 0.6)',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: '#293752',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
        option: {
          '&:hover': {
            backgroundColor: 'rgba(79, 145, 243, 0.15)',
          },
          '&[aria-selected="true"]': {
            backgroundColor: 'rgba(79, 145, 243, 0.25)',
          },
        },
        inputRoot: {
          width: '100%',
        },
        popper: {
          width: 'fit-content !important',
          minWidth: '250px !important',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(46, 204, 113, 0.2)',
          borderColor: 'rgba(46, 204, 113, 0.5)',
          color: '#f5f7fa',
          margin: '4px',
          '&:hover': {
            backgroundColor: 'rgba(46, 204, 113, 0.3)',
          },
        },
        deleteIcon: {
          color: '#f5f7fa',
          '&:hover': {
            color: '#ff6b6b',
          }
        }
      }
    }
  },
});

const muscleGroups = {
  Back: { emoji: "🔙", exercises: ["Pull-Ups", "Lat Pulldown", "Bent-over Rows", "Deadlift", "T-Bar Rows", "Seated Rows", "Pull-overs", "Face Pulls", "Renegade Rows"] },
  Arm: { emoji: "💪", exercises: ["Bicep Curls", "Tricep Dips", "Hammer Curls", "Preacher Curls", "Skull Crushers", "Overhead Extensions", "Concentration Curls", "Cable Pushdowns", "Rope Hammer Curls"] },
  Shoulder: { emoji: "🏋️", exercises: ["Shoulder Press", "Lateral Raises", "Front Raises", "Face Pulls", "Upright Rows", "Arnold Press", "Reverse Flyes", "Shrugs", "Military Press"] },
  Abs: { emoji: "⬡", exercises: ["Crunches", "Plank", "Russian Twists", "Leg Raises", "Mountain Climbers", "Ab Rollouts", "Bicycle Crunches", "Dragon Flags", "Hollow Hold"] },
  Chest: { emoji: "👕", exercises: ["Bench Press", "Push-Ups", "Chest Fly", "Dips", "Incline Press", "Decline Press", "Cable Crossovers", "Svend Press", "Landmine Press"] },
  Quads: { emoji: "🦵", exercises: ["Squats", "Lunges", "Leg Press", "Step-Ups", "Box Jumps", "Front Squats", "Hack Squats", "Pistol Squats", "Bulgarian Split Squats"] },
  "Glutes and Hamstring": { emoji: "🍑", exercises: ["Hip Thrusts", "Romanian Deadlift", "Glute Bridges", "Hamstring Curls", "Good Mornings", "Cable Pull-throughs", "Sumo Deadlifts", "Back Extensions", "Kettlebell Swings"] },
};

const ExercisePrefPage = ({ focusMuscleGroups = [], onBack, onNext }) => {
  const navigate = useNavigate();
  const [selectedExercises, setSelectedExercises] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    setSelectedExercises((prev) => {
      return Object.fromEntries(
        Object.entries(prev).filter(([muscle]) =>
          focusMuscleGroups.some(group => group.trim().toLowerCase() === muscle.trim().toLowerCase())
        )
      );
    });
  }, [focusMuscleGroups]);

  const handleLogoClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmNavigation = () => {
    navigate('/');
  };

  const handleExerciseSelect = (muscle, exercise) => {
    setSelectedExercises((prev) => ({
      ...prev,
      [muscle]: prev[muscle]?.includes(exercise)
        ? prev[muscle].filter((ex) => ex !== exercise)
        : [...(prev[muscle] || []), exercise],
    }));
  };

  // Count total selected exercises
  const totalSelectedExercises = Object.values(selectedExercises).reduce(
    (sum, exercises) => sum + exercises.length, 
    0
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="workout-survey-container">
        <div className="weekly-header">
          <button className="back-button" onClick={onBack}>
            <span className="back-icon">←</span>
            <span className="back-text">Back</span>
          </button>
          <div className="weekly-logo" onClick={handleLogoClick}>MasidtAI</div>
        </div>
        
        <h1>Select Your Preferred Exercises</h1>
        
        <div className="stats-bar">
          <div className="stats-item">
            <div className="stats-value">{focusMuscleGroups.length}</div>
            <div className="stats-label">Muscle Groups</div>
          </div>
          <div className="stats-item">
            <div className="stats-value">{totalSelectedExercises}</div>
            <div className="stats-label">Exercises Selected</div>
          </div>
        </div>
        
        <div className="workout-grid">
          {(focusMuscleGroups || []).map((muscle) => (
            <Card key={muscle} className="workout-card" elevation={4}>
              <div className="card-header">
                <div className="workout-emoji">{muscleGroups[muscle]?.emoji}</div>
                <Typography variant="h5" className="workout-title">{muscle}</Typography>
              </div>
              
              <Autocomplete
                options={(muscleGroups[muscle]?.exercises || []).filter(
                  exercise => !(selectedExercises[muscle] || []).includes(exercise)
                )}
                onChange={(event, newValue) => {
                  if (newValue) {
                    handleExerciseSelect(muscle, newValue);
                    // Clear the input value after selection
                    event.target.value = "";
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add exercise"
                    variant="outlined"
                    fullWidth
                    sx={{ 
                      my: 2,
                      '& .MuiInputBase-input': { 
                        color: '#f5f7fa' 
                      },
                      '& .MuiInputLabel-root': { 
                        color: '#a3b1cc' 
                      }
                    }}
                  />
                )}
                freeSolo
                id={`autocomplete-${muscle}`}
                ListboxProps={{
                  style: { maxHeight: '200px' }
                }}
                key={`${muscle}-${selectedExercises[muscle]?.length || 0}`}
              />
              
              <motion.div className="separator" />
              
              <div className="selected-exercises">
                {selectedExercises[muscle]?.length > 0 ? (
                  <Stack direction="row" flexWrap="wrap">
                    {selectedExercises[muscle].map((exercise) => (
                      <Chip
                        key={exercise}
                        label={exercise}
                        onDelete={() => handleExerciseSelect(muscle, exercise)}
                        className="exercise-chip"
                        deleteIcon={<CloseIcon />}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Box className="no-exercises">
                    <FitnessCenterIcon sx={{ fontSize: '2rem', opacity: 0.5, mb: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      No exercises selected yet
                    </Typography>
                  </Box>
                )}
              </div>
            </Card>
          ))}
        </div>
        
        <div className="weekly-footer">
          <Button
            variant="contained"
            className="next-button"
            onClick={() => onNext(selectedExercises)}
            disabled={totalSelectedExercises === 0}
          >
            Continue
          </Button>
        </div>
      </div>
      
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmNavigation}
      />
    </ThemeProvider>
  );
};

export default ExercisePrefPage;
