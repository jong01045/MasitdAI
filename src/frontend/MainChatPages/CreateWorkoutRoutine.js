import React, { useState, useRef } from 'react';
import './CreateWorkoutRoutine.css';
import { X } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const bodyParts = ['Chest', 'Shoulder', 'Back', 'Quads', 'Hamstrings', 'Glutes', 'Arms'];

const exercisesByBodyPart = {
  Chest: ['Bench Press', 'Incline Dumbbell Press', 'Cable Fly'],
  Shoulder: ['Shoulder Press', 'Lateral Raise', 'Front Raise'],
  Back: ['Pull Ups', 'Deadlift', 'Lat Pulldown'],
  Quads: ['Squats', 'Leg Press', 'Lunges'],
  Hamstrings: ['Deadlift', 'Leg Curl', 'Good Mornings'],
  Glutes: ['Hip Thrust', 'Glute Bridge', 'Cable Kickback'],
  Arms: ['Bicep Curl', 'Tricep Extension', 'Hammer Curl'],
};

const CreateWorkoutRoutine = ({ onClose, onConfirm }) => {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showExercisePopup, setShowExercisePopup] = useState(false);
  const [currentMuscle, setCurrentMuscle] = useState(null);
  const [showCreateConfirmation, setShowCreateConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteExerciseConfirm, setShowDeleteExerciseConfirm] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      onClose();
    }, 250);
  };

  const handleMuscleClick = (muscle) => {
    setCurrentMuscle(muscle);
    setShowExercisePopup(true);
  };

  const handleExerciseConfirm = (exercises) => {
    if (exercises.length === 0) {
      setShowExercisePopup(false);
      setCurrentMuscle(null);
      return;
    }
    setSelectedExercises((prev) => {
      const existingGroupIndex = prev.findIndex((group) => group.muscle === currentMuscle);
      if (existingGroupIndex !== -1) {
        const updatedExercises = exercises.map(ex => ({ name: ex, sets: 4 }));
        const updatedGroups = [...prev];
        updatedGroups[existingGroupIndex] = { ...updatedGroups[existingGroupIndex], exercises: updatedExercises };
        return updatedGroups.filter(group => group.exercises.length > 0);
      } else {
        return [...prev, { muscle: currentMuscle, exercises: exercises.map(ex => ({ name: ex, sets: 4 })) }];
      }
    });
    setShowExercisePopup(false);
    setCurrentMuscle(null);
  };

  const handleCreate = () => {
    if (selectedExercises.length === 0) {
      setErrorMessage("You haven't chosen any workout!");
      return;
    }
    setShowCreateConfirmation(true);
  };

  const handleCreateConfirm = (confirm) => {
    if (confirm) {
      console.log('Workout routine created:', selectedExercises);
      onClose();
      onConfirm(selectedExercises);
    }
    setShowCreateConfirmation(false);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const groupIndex = selectedExercises.findIndex((group) => group.exercises.some((ex) => ex.name === active.id));
      const oldIndex = selectedExercises[groupIndex].exercises.findIndex((ex) => ex.name === active.id);
      const newIndex = selectedExercises[groupIndex].exercises.findIndex((ex) => ex.name === over.id);
      setSelectedExercises((prev) => {
        const updatedGroups = [...prev];
        updatedGroups[groupIndex].exercises = arrayMove(updatedGroups[groupIndex].exercises, oldIndex, newIndex);
        return updatedGroups;
      });
    }
  };

  const handleRemoveExercise = (muscle, exerciseName) => {
    setExerciseToDelete({ muscle, exerciseName });
    setShowDeleteExerciseConfirm(true);
  };

  const confirmRemoveExercise = () => {
    if (exerciseToDelete) {
      removeExercise(exerciseToDelete.muscle, exerciseToDelete.exerciseName);
      setExerciseToDelete(null);
    }
    setShowDeleteExerciseConfirm(false);
  };

  const removeExercise = (muscle, exerciseName) => {
    setSelectedExercises((prev) => {
      const updatedGroups = prev.map((group) => {
        if (group.muscle === muscle) {
          const updatedExercises = group.exercises.filter((ex) => ex.name !== exerciseName);
          return { ...group, exercises: updatedExercises };
        }
        return group;
      }).filter(group => group.exercises.length > 0);
      return updatedGroups;
    });
  };

  if (!visible) return null;

  return (
    <div className={`modal-overlay ${exiting ? 'fade-out' : ''}`}>
      <div className={`modal-content ${exiting ? 'slide-down' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-button" onClick={handleClose}>
          <X size={20} />
        </button>
        <div className="popup-body">
          <h3>Create Your Own Workout</h3>
          <div className="body-part-selection">
            {bodyParts.map((part) => (
              <button key={part} className="muscle-button" onClick={() => handleMuscleClick(part)}>
                {part}
              </button>
            ))}
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {selectedExercises.map((group, index) => (
            <div key={index} className="exercise-group">
              <h4>{group.muscle}</h4>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={group.exercises.map((ex) => ex.name)} strategy={verticalListSortingStrategy}>
                  <div className="exercise-pane">
                    {group.exercises.map((exercise) => (
                      <SortableExerciseItem 
                        key={exercise.name} 
                        exercise={exercise} 
                        updateExerciseSets={(name, sets) => {
                          setSelectedExercises((prev) => prev.map((g) =>
                            g.muscle === group.muscle ? {
                              ...g,
                              exercises: g.exercises.map((ex) =>
                                ex.name === name ? { ...ex, sets: parseInt(sets, 10) } : ex
                              )
                            } : g
                          ));
                        }}
                        removeExercise={(name) => handleRemoveExercise(group.muscle, name)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          ))}
          <div className="popup-footer">
            <button className="cancel-button" onClick={handleClose}>Cancel</button>
            <button className="create-button" onClick={handleCreate}>Create</button>
          </div>
        </div>
        {showExercisePopup && <ExerciseSelectionPopup selectedBodyParts={[currentMuscle]} existingExercises={selectedExercises} onConfirm={handleExerciseConfirm} onClose={() => setShowExercisePopup(false)} />}
        {showCreateConfirmation && (
          <div className="confirmation-popup">
            <p>Do you want to make this workout routine?</p>
            <button onClick={() => handleCreateConfirm(true)}>Yes</button>
            <button onClick={() => handleCreateConfirm(false)}>No</button>
          </div>
        )}
        {showDeleteExerciseConfirm && (
          <div className="confirmation-popup">
            <p>Do you want to delete this exercise?</p>
            <button onClick={confirmRemoveExercise}>Yes</button>
            <button onClick={() => setShowDeleteExerciseConfirm(false)}>No</button>
          </div>
        )}
      </div>
    </div>
  );
};

const SortableExerciseItem = ({ exercise, updateExerciseSets, removeExercise }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  return (
    <div ref={setNodeRef} style={style} className="exercise-item">
      <div className="drag-handle" {...attributes} {...listeners}>☰</div>
      {exercise.name}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <select
          className="sets-dropdown"
          value={exercise.sets}
          onChange={(e) => updateExerciseSets(exercise.name, e.target.value)}
          style={{ marginRight: '8px' }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <option key={num} value={num}>{num} sets</option>
          ))}
        </select>
        <button className="remove-exercise-button" onClick={() => removeExercise(exercise.name)}>X</button>
      </div>
    </div>
  );
};

const ExerciseSelectionPopup = ({ selectedBodyParts, existingExercises, onConfirm, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercises, setSelectedExercises] = useState(() => {
    const existingGroup = existingExercises.find((group) => group.muscle === selectedBodyParts[0]);
    return existingGroup ? existingGroup.exercises.map(ex => ex.name) : [];
  });

  const handleConfirm = () => {
    onConfirm(selectedExercises);
  };

  const filteredExercises = (part) => {
    return exercisesByBodyPart[part].filter((exercise) =>
      exercise.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="exercise-popup">
      <h4>Select Exercises</h4>
      <div className="exercise-search">
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="exercise-list">
        {selectedBodyParts.map((part) => (
          <div key={part} className="exercise-group">
            <h5>{part} Exercises</h5>
            {filteredExercises(part).map((ex) => (
              <button
                key={ex}
                className={`exercise-button ${selectedExercises.includes(ex) ? 'selected' : ''}`}
                onClick={() => setSelectedExercises((prev) =>
                  prev.includes(ex) ? prev.filter((e) => e !== ex) : [...prev, ex]
                )}
              >
                {ex}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="popup-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="cancel-button" onClick={onClose}>Cancel</button>
        <button className="confirm-button" onClick={handleConfirm} style={{ alignSelf: 'flex-end' }}>Confirm</button>
      </div>
    </div>
  );
};

export default CreateWorkoutRoutine;
