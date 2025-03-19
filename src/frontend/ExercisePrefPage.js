import React, { useState, useEffect } from "react";
import "./ExercisePrefPage.css";
import { Card, Button, TextField, Autocomplete } from "@mui/material";
import { motion } from "framer-motion";

const muscleGroups = {
  Back: { emoji: "🦻", exercises: ["Pull-Ups", "Lat Pulldown", "Bent-over Rows", "Deadlift"] },
  Arm: { emoji: "💪", exercises: ["Bicep Curls", "Tricep Dips", "Hammer Curls", "Preacher Curls"] },
  Shoulder: { emoji: "🏋️", exercises: ["Shoulder Press", "Lateral Raises", "Front Raises", "Face Pulls"] },
  Abs: { emoji: "🧘", exercises: ["Crunches", "Plank", "Russian Twists", "Leg Raises"] },
  Chest: { emoji: "🏊", exercises: ["Bench Press", "Push-Ups", "Chest Fly", "Dips"] },
  Quads: { emoji: "🦵", exercises: ["Squats", "Lunges", "Leg Press", "Step-Ups"] },
  "Glutes and Hamstring": { emoji: "🤸", exercises: ["Hip Thrusts", "Romanian Deadlift", "Glute Bridges", "Hamstring Curls"] },
};

const ExercisePrefPage = ({ focusMuscleGroups = [], onBack, onNext }) => {
  const [selectedExercises, setSelectedExercises] = useState({});

  useEffect(() => {
    setSelectedExercises((prev) => {
      return Object.fromEntries(
        Object.entries(prev).filter(([muscle]) =>
          focusMuscleGroups.some(group => group.trim().toLowerCase() === muscle.trim().toLowerCase())
        )
      );
    });
  }, [focusMuscleGroups]);

  const handleExerciseSelect = (muscle, exercise) => {
    setSelectedExercises((prev) => ({
      ...prev,
      [muscle]: prev[muscle]?.includes(exercise)
        ? prev[muscle].filter((ex) => ex !== exercise)
        : [...(prev[muscle] || []), exercise],
    }));
  };

  return (
    <div className="workout-survey-container">
      <div className="weekly-header">
        <button className="back-button" onClick={onBack}>Back</button>
        <div className="weekly-logo">MasidtAI</div>
      </div>
      <h1>Select Your Preferred Exercises</h1>
      <div className="workout-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', justifyContent: 'center', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        {(focusMuscleGroups || []).map((muscle) => (
          <Card key={muscle} className="workout-card" style={{ backgroundColor: '#444', border: '1px solid #666', borderRadius: '12px', padding: '1rem' }}>
            <div className="workout-emoji">{muscleGroups[muscle]?.emoji}</div>
            <Autocomplete
              options={(muscleGroups[muscle]?.exercises || []).filter(exercise => !(selectedExercises[muscle] || []).includes(exercise))}
              onChange={(event, newValue) => {
                if (newValue) {
                  handleExerciseSelect(muscle, newValue);
                  setTimeout(() => {
                    const inputElement = document.querySelector('.MuiAutocomplete-input');
                    if (inputElement) inputElement.value = "";
                  }, 0); // Reset search input
                }
              }} 
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select an exercise"
                  variant="outlined"
                  fullWidth
                  sx={{ minHeight: '56px', fontSize: '1rem', minWidth: '250px', backgroundColor: '#777', color: '#fff', '& .MuiInputBase-root': { height: '56px', minWidth: '250px', backgroundColor: '#888' } }}
                />
              )}
              freeSolo
            />
            <motion.div className="border-l-2 border-gray-400 w-full my-2" />
            <div className="scroll-area">
              {(selectedExercises[muscle] || []).map((exercise) => (
                <Button
                  key={exercise}
                  onClick={() => handleExerciseSelect(muscle, exercise)}
                  className="exercise-button"
                >
                  {exercise} ✖
                </Button>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <div className="weekly-footer">
        <Button onClick={() => onNext(selectedExercises)} className="next-button">Next</Button>
      </div>
    </div>
  );
};

export default ExercisePrefPage;
