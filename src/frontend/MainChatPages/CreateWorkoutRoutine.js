import React, { useState } from 'react';
import './CreateWorkoutRoutine.css';
import { 
  X, Plus, Minus, Search, Dumbbell, Save, ChevronLeft, 
  ChevronRight, GripVertical, BarChart3, ArrowRight
} from 'lucide-react';

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

// Define muscle groups with icons/emojis
const muscleGroups = [
  { id: 'chest', name: 'Chest', icon: '💪' },
  { id: 'back', name: 'Back', icon: '🔙' },
  { id: 'shoulders', name: 'Shoulders', icon: '🏋️‍♂️' },
  { id: 'arms', name: 'Arms', icon: '💪' },
  { id: 'abs', name: 'Abs', icon: '⬡' },
  { id: 'legs', name: 'Legs', icon: '🦵' },
  { id: 'glutes', name: 'Glutes', icon: '🍑' },
  { id: 'calves', name: 'Calves', icon: '🦵' },
  { id: 'cardio', name: 'Cardio', icon: '🏃‍♂️' },
];

// Exercise database
const exercisesByMuscleGroup = {
  chest: [
    { id: 'bench-press', name: 'Bench Press', equipment: 'Barbell' },
    { id: 'incline-press', name: 'Incline Press', equipment: 'Dumbbell' },
    { id: 'chest-fly', name: 'Chest Fly', equipment: 'Cable' },
    { id: 'push-up', name: 'Push Up', equipment: 'Bodyweight' },
    { id: 'dips', name: 'Dips', equipment: 'Bodyweight' },
  ],
  back: [
    { id: 'pull-up', name: 'Pull Up', equipment: 'Bodyweight' },
    { id: 'lat-pulldown', name: 'Lat Pulldown', equipment: 'Cable' },
    { id: 'row', name: 'Row', equipment: 'Barbell' },
    { id: 'deadlift', name: 'Deadlift', equipment: 'Barbell' },
    { id: 'pull-over', name: 'Pull Over', equipment: 'Dumbbell' },
  ],
  shoulders: [
    { id: 'overhead-press', name: 'Overhead Press', equipment: 'Barbell' },
    { id: 'lateral-raise', name: 'Lateral Raise', equipment: 'Dumbbell' },
    { id: 'front-raise', name: 'Front Raise', equipment: 'Dumbbell' },
    { id: 'face-pull', name: 'Face Pull', equipment: 'Cable' },
    { id: 'shrug', name: 'Shrug', equipment: 'Dumbbell' },
  ],
  arms: [
    { id: 'bicep-curl', name: 'Bicep Curl', equipment: 'Dumbbell' },
    { id: 'tricep-extension', name: 'Tricep Extension', equipment: 'Cable' },
    { id: 'hammer-curl', name: 'Hammer Curl', equipment: 'Dumbbell' },
    { id: 'skull-crusher', name: 'Skull Crusher', equipment: 'Barbell' },
    { id: 'chin-up', name: 'Chin Up', equipment: 'Bodyweight' },
  ],
  abs: [
    { id: 'crunch', name: 'Crunch', equipment: 'Bodyweight' },
    { id: 'leg-raise', name: 'Leg Raise', equipment: 'Bodyweight' },
    { id: 'plank', name: 'Plank', equipment: 'Bodyweight' },
    { id: 'russian-twist', name: 'Russian Twist', equipment: 'Kettlebell' },
    { id: 'ab-wheel', name: 'Ab Wheel', equipment: 'Ab Wheel' },
  ],
  legs: [
    { id: 'squat', name: 'Squat', equipment: 'Barbell' },
    { id: 'leg-press', name: 'Leg Press', equipment: 'Machine' },
    { id: 'lunge', name: 'Lunge', equipment: 'Dumbbell' },
    { id: 'leg-extension', name: 'Leg Extension', equipment: 'Machine' },
    { id: 'leg-curl', name: 'Leg Curl', equipment: 'Machine' },
  ],
  glutes: [
    { id: 'hip-thrust', name: 'Hip Thrust', equipment: 'Barbell' },
    { id: 'glute-bridge', name: 'Glute Bridge', equipment: 'Bodyweight' },
    { id: 'kickback', name: 'Kickback', equipment: 'Cable' },
    { id: 'good-morning', name: 'Good Morning', equipment: 'Barbell' },
    { id: 'step-up', name: 'Step Up', equipment: 'Bodyweight' },
  ],
  calves: [
    { id: 'calf-raise', name: 'Calf Raise', equipment: 'Machine' },
    { id: 'seated-calf-raise', name: 'Seated Calf Raise', equipment: 'Machine' },
    { id: 'jump-rope', name: 'Jump Rope', equipment: 'Rope' },
  ],
  cardio: [
    { id: 'running', name: 'Running', equipment: 'Treadmill' },
    { id: 'cycling', name: 'Cycling', equipment: 'Bike' },
    { id: 'jumping-jacks', name: 'Jumping Jacks', equipment: 'Bodyweight' },
    { id: 'burpee', name: 'Burpee', equipment: 'Bodyweight' },
    { id: 'stair-climber', name: 'Stair Climber', equipment: 'Machine' },
  ],
};

const CreateWorkoutRoutine = ({ onClose, onConfirm }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [routineName, setRoutineName] = useState('');
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // Handle close with animation
  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      onClose();
    }, 250);
  };

  // Go to next step
  const goToNextStep = () => {
    if (currentStep === 1 && !routineName.trim()) {
      return; // Don't proceed if no routine name
    }
    
    if (currentStep === 2 && selectedExercises.length === 0) {
      return; // Don't proceed if no exercises selected
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };
  
  // Go to previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Toggle muscle group selection
  const toggleMuscleGroup = (muscleGroup) => {
    if (selectedMuscleGroups.includes(muscleGroup.id)) {
      setSelectedMuscleGroups(prev => prev.filter(id => id !== muscleGroup.id));
    } else {
      setSelectedMuscleGroups(prev => [...prev, muscleGroup.id]);
    }
  };
  
  // Add exercise to routine
  const addExercise = (exercise, muscleGroup) => {
    const newExercise = {
      id: `${exercise.id}-${Date.now()}`,
      baseId: exercise.id,
      name: exercise.name,
      equipment: exercise.equipment,
      muscleGroup,
      sets: 3
    };
    
    setSelectedExercises(prev => [...prev, newExercise]);
  };
  
  // Prompt to remove exercise
  const promptRemoveExercise = (exerciseId) => {
    setExerciseToDelete(exerciseId);
    setShowDeleteConfirmation(true);
  };
  
  // Confirm remove exercise from routine
  const confirmRemoveExercise = () => {
    if (exerciseToDelete) {
      setSelectedExercises(prev => prev.filter(ex => ex.id !== exerciseToDelete));
    }
    setShowDeleteConfirmation(false);
    setExerciseToDelete(null);
  };
  
  // Cancel remove exercise
  const cancelRemoveExercise = () => {
    setShowDeleteConfirmation(false);
    setExerciseToDelete(null);
  };
  
  // Update exercise sets
  const updateSets = (exerciseId, sets) => {
    setSelectedExercises(prev => 
      prev.map(ex => ex.id === exerciseId ? { ...ex, sets: parseInt(sets) } : ex)
    );
  };
  
  // Handle drag and drop for reordering exercises
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setSelectedExercises((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Submit the workout routine
  const handleSubmit = () => {
    const workoutData = selectedExercises.reduce((acc, exercise) => {
      const muscleGroup = exercise.muscleGroup;
      
      if (!acc.find(group => group.muscle === muscleGroup)) {
        acc.push({
          muscle: muscleGroup,
          exercises: []
        });
      }
      
      const groupIndex = acc.findIndex(group => group.muscle === muscleGroup);
      acc[groupIndex].exercises.push({
        name: exercise.name,
        sets: exercise.sets
      });
      
      return acc;
    }, []);
    
    onConfirm(workoutData);
    handleClose();
  };
  
  // Filter available exercises
  const getFilteredExercises = () => {
    if (selectedMuscleGroups.length === 0) return [];
    
    let exercises = [];
    selectedMuscleGroups.forEach(muscleGroupId => {
      exercisesByMuscleGroup[muscleGroupId].forEach(exercise => {
        // Skip if exercise is already selected
        const isAlreadySelected = selectedExercises.some(
          selected => selected.baseId === exercise.id && selected.muscleGroup === muscleGroupId
        );
        
        if (!isAlreadySelected && exercise.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          exercises.push({ ...exercise, muscleGroup: muscleGroupId });
        }
      });
    });
    
    return exercises;
  };
  
  // Render based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>Name Your Workout Routine</h3>
            <p>Give your workout routine a name that helps you identify it.</p>
            
            <div className="form-group">
              <input
                type="text"
                placeholder="e.g., Monday Upper Body"
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                className="routine-name-input"
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="step-content">
            <h3>Select Muscle Groups & Exercises</h3>
            <p>Choose the muscle groups and exercises for your routine.</p>
            
            <div className="muscle-exercise-container">
              <div className="muscle-groups-section">
                <h4>Muscle Groups</h4>
                <div className="muscle-groups-grid">
                  {muscleGroups.map((muscleGroup) => (
                    <div
                      key={muscleGroup.id}
                      className={`muscle-group-card ${selectedMuscleGroups.includes(muscleGroup.id) ? 'selected' : ''}`}
                      onClick={() => toggleMuscleGroup(muscleGroup)}
                    >
                      <div className="muscle-group-icon">{muscleGroup.icon}</div>
                      <div className="muscle-group-name">{muscleGroup.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="exercises-section">
                <div className="exercises-search">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="available-exercises">
                  {selectedMuscleGroups.length === 0 ? (
                    <div className="no-selection-message">
                      <Dumbbell size={24} />
                      <p>Select muscle groups to see available exercises</p>
                    </div>
                  ) : getFilteredExercises().length === 0 ? (
                    <div className="no-exercises-message">
                      <p>No exercises match your search</p>
                    </div>
                  ) : (
                    <div className="exercises-list">
                      {getFilteredExercises().map((exercise) => (
                        <div key={exercise.id} className="exercise-item">
                          <div className="exercise-info">
                            <div className="exercise-name">{exercise.name}</div>
                            <div className="exercise-equipment">{exercise.equipment}</div>
                          </div>
                          <button 
                            className="add-exercise-btn"
                            onClick={() => addExercise(exercise, exercise.muscleGroup)}
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="selected-exercises-section">
              <h4>
                Selected Exercises
                <span className="exercise-count">{selectedExercises.length} exercises</span>
              </h4>
              
              {selectedExercises.length === 0 ? (
                <div className="no-exercises-selected">
                  <p>No exercises selected yet</p>
                </div>
              ) : (
                <div className="selected-exercises-list">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={selectedExercises.map(ex => ex.id)} strategy={verticalListSortingStrategy}>
                      {selectedExercises.map((exercise) => (
                        <SortableExerciseItem 
                          key={exercise.id} 
                          exercise={exercise}
                          onRemove={promptRemoveExercise}
                          onUpdateSets={updateSets}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="step-content">
            <h3>Review & Confirm</h3>
            <p>Review your workout routine before creating it.</p>
            
            <div className="review-container">
              <div className="review-routine-name">
                <BarChart3 size={24} />
                <h4>{routineName || 'Untitled Workout'}</h4>
              </div>
              
              <div className="review-exercises">
                {selectedMuscleGroups.map(muscleGroup => {
                  const groupExercises = selectedExercises.filter(ex => ex.muscleGroup === muscleGroup);
                  if (groupExercises.length === 0) return null;
                  
                  const muscleGroupData = muscleGroups.find(mg => mg.id === muscleGroup);
                  
                  return (
                    <div key={muscleGroup} className="review-muscle-group">
                      <div className="review-muscle-group-header">
                        <span className="review-muscle-icon">{muscleGroupData.icon}</span>
                        <h5>{muscleGroupData.name}</h5>
                        <span className="review-exercise-count">{groupExercises.length} exercises</span>
                      </div>
                      
                      <div className="review-exercise-list">
                        {groupExercises.map(exercise => (
                          <div key={exercise.id} className="review-exercise-item">
                            <div className="review-exercise-name">{exercise.name}</div>
                            <div className="review-exercise-details">
                              <span className="review-equipment">{exercise.equipment}</span>
                              <span className="review-sets">{exercise.sets} sets</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!visible) return null;

  return (
    <div className={`modal-overlay ${exiting ? 'fade-out' : ''}`} onClick={handleClose}>
      <div className={`modal-content create-workout-modal ${exiting ? 'slide-down' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={handleClose}>
          <X size={20} />
        </button>
        
        <div className="steps-indicator">
          {[1, 2, 3].map(step => (
            <div key={step} className={`step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
              <div className="step-number">{step}</div>
              <div className="step-name">
                {step === 1 ? 'Name' : step === 2 ? 'Exercises' : 'Review'}
                  </div>
            </div>
          ))}
          </div>
        
        {renderStepContent()}
        
        <div className="modal-footer">
          <button 
            className="secondary-button" 
            onClick={currentStep === 1 ? handleClose : goToPreviousStep}
          >
            {currentStep === 1 ? 'Cancel' : (
              <>
                <ChevronLeft size={18} />
                Back
              </>
            )}
          </button>
          
          <button 
            className="primary-button" 
            onClick={goToNextStep}
            disabled={(currentStep === 1 && !routineName.trim()) || (currentStep === 2 && selectedExercises.length === 0)}
          >
            {currentStep < 3 ? (
              <>
                Next
                <ChevronRight size={18} />
              </>
            ) : (
              <>
                Create Workout
                <Save size={18} />
              </>
            )}
          </button>
        </div>
        
        {/* Delete Confirmation Modal */}
        {showDeleteConfirmation && (
          <div className="delete-confirmation-overlay" onClick={cancelRemoveExercise}>
            <div className="delete-confirmation-modal" onClick={(e) => e.stopPropagation()}>
              <h4>Remove Exercise</h4>
              <p>Are you sure you want to remove this exercise from your routine?</p>
              <div className="delete-confirmation-actions">
                <button 
                  className="delete-cancel-button" 
                  onClick={cancelRemoveExercise}
                >
                  Cancel
                </button>
                <button 
                  className="delete-confirm-button" 
                  onClick={confirmRemoveExercise}
                >
                  Remove
                </button>
              </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Sortable exercise item component
const SortableExerciseItem = ({ exercise, onRemove, onUpdateSets }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Array of possible set values
  const setPossibilities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="selected-exercise-item"
      data-dragging={isDragging}
    >
      <div className="drag-handle" {...attributes} {...listeners}>
        <GripVertical size={16} />
      </div>
      
      <div className="selected-exercise-info">
        <div className="selected-exercise-name">{exercise.name}</div>
        <div className="selected-exercise-details">
          <span className="selected-muscle-group">
            {muscleGroups.find(mg => mg.id === exercise.muscleGroup)?.name}
          </span>
          <span className="selected-equipment">{exercise.equipment}</span>
        </div>
      </div>
      
      <div className="selected-exercise-sets">
        <div className="sets-dropdown-container">
        <select
          className="sets-dropdown"
          value={exercise.sets}
            onChange={(e) => onUpdateSets(exercise.id, e.target.value)}
        >
            {setPossibilities.map(num => (
            <option key={num} value={num}>{num} sets</option>
          ))}
        </select>
        </div>
      </div>
      
              <button
        className="remove-exercise-btn"
        onClick={() => onRemove(exercise.id)}
        title="Remove exercise"
      >
        <X size={16} />
              </button>
    </div>
  );
};

export default CreateWorkoutRoutine;
