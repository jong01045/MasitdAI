import React, { useState, useEffect } from "react";
import "./ExercisePrefPage.css";
import { Card, Button } from "@mui/material";
import { Select, MenuItem } from "@mui/material";
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
    // Normalize keys to prevent mismatches
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
      <div className="workout-grid">
        {(focusMuscleGroups || []).map((muscle) => (
          <Card key={muscle} className="workout-card">
            <div className="workout-emoji">{muscleGroups[muscle]?.emoji}</div>
            <Select
              value={""}
              onChange={(event) => handleExerciseSelect(muscle, event.target.value)}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>Select an exercise</MenuItem>
              {(muscleGroups[muscle]?.exercises || []).map((exercise) => (
                <MenuItem key={exercise} value={exercise}>
                  {exercise}
                </MenuItem>
              ))}
            </Select>
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