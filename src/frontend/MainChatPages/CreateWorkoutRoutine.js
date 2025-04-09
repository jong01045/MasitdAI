import React, { useState } from 'react';
import './CreateWorkoutRoutine.css';
import { 
  X, Plus, Search, Dumbbell, Save, ChevronLeft, 
  ChevronRight, GripVertical, BarChart3, XCircle
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
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  
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

  // Show exit confirmation
  const promptExit = () => {
    setShowExitConfirmation(true);
  };

  // Confirm exit
  const confirmExit = () => {
    setShowExitConfirmation(false);
    handleClose();
  };

  // Cancel exit
  const cancelExit = () => {
    setShowExitConfirmation(false);
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
      // Scroll to top when changing steps
      document.querySelector('.workout-modal-content')?.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };
  
  // Go to previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll to top when changing steps
      document.querySelector('.workout-modal-content')?.scrollTo(0, 0);
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
          <div className="workout-step">
            <h3>Name Your Workout Routine</h3>
            <p>Give your workout routine a name that helps you identify it.</p>
            
            <div className="workout-form-group">
              <input
                type="text"
                placeholder="e.g., Monday Upper Body"
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                className="workout-name-input"
                autoFocus
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="workout-step">
            <h3>Select Muscle Groups & Exercises</h3>
            <p>Choose the muscle groups and exercises for your routine.</p>
            
            <div className="workout-muscle-section">
              <h4>Muscle Groups</h4>
              <div className="workout-muscle-grid">
                {muscleGroups.map((muscleGroup) => (
                  <div
                    key={muscleGroup.id}
                    className={`workout-muscle-card ${selectedMuscleGroups.includes(muscleGroup.id) ? 'selected' : ''}`}
                    onClick={() => toggleMuscleGroup(muscleGroup)}
                  >
                    <div className="workout-muscle-icon">{muscleGroup.icon}</div>
                    <div className="workout-muscle-name">{muscleGroup.name}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedMuscleGroups.length > 0 && (
              <div className="workout-exercise-section">
                <div className="workout-search-bar">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="workout-available-exercises">
                  {getFilteredExercises().length === 0 ? (
                    <div className="workout-no-exercises">
                      <p>No exercises match your search</p>
                    </div>
                  ) : (
                    <div className="workout-exercise-list">
                      {getFilteredExercises().map((exercise) => (
                        <div key={exercise.id} className="workout-exercise-item">
                          <div className="workout-exercise-info">
                            <div className="workout-exercise-name">{exercise.name}</div>
                            <div className="workout-exercise-details">
                              <span className="workout-exercise-equipment">{exercise.equipment}</span>
                              <span className="workout-exercise-muscle-group">
                                {muscleGroups.find(mg => mg.id === exercise.muscleGroup)?.icon} 
                                {muscleGroups.find(mg => mg.id === exercise.muscleGroup)?.name}
                              </span>
                            </div>
                          </div>
                          <button 
                            className="workout-add-btn"
                            onClick={() => addExercise(exercise, exercise.muscleGroup)}
                            title="Add exercise"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {selectedMuscleGroups.length === 0 && (
              <div className="workout-select-prompt">
                <Dumbbell size={24} />
                <p>Select muscle groups to see available exercises</p>
              </div>
            )}
            
            <div className="workout-selected-section">
              <div className="workout-selected-header">
                <h4>Selected Exercises</h4>
                <span className="workout-exercise-count">{selectedExercises.length}</span>
              </div>
              
              {selectedExercises.length === 0 ? (
                <div className="workout-no-selected">
                  <p>No exercises selected yet</p>
                </div>
              ) : (
                <div className="workout-selected-list">
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
          <div className="workout-step">
            <h3>Review & Confirm</h3>
            <p>Review your workout routine before creating it.</p>
            
            <div className="workout-review">
              <div className="workout-review-header">
                <BarChart3 size={24} />
                <h4>{routineName || 'Untitled Workout'}</h4>
              </div>
              
              <div className="workout-review-tags">
                {selectedMuscleGroups
                  .filter(muscleGroupId => 
                    selectedExercises.some(ex => ex.muscleGroup === muscleGroupId)
                  )
                  .map(muscleGroupId => {
                    const muscleGroupData = muscleGroups.find(mg => mg.id === muscleGroupId);
                    return (
                      <div key={muscleGroupId} className="workout-review-tag">
                        <span className="workout-review-tag-icon">{muscleGroupData.icon}</span>
                        <span className="workout-review-tag-name">{muscleGroupData.name}</span>
                      </div>
                    );
                  })}
              </div>
              
              <div className="workout-review-content">
                {selectedMuscleGroups.map(muscleGroup => {
                  const groupExercises = selectedExercises.filter(ex => ex.muscleGroup === muscleGroup);
                  if (groupExercises.length === 0) return null;
                  
                  const muscleGroupData = muscleGroups.find(mg => mg.id === muscleGroup);
                  
                  return (
                    <div key={muscleGroup} className="workout-review-group">
                      <div className="workout-review-group-header">
                        <div className="workout-review-icon">{muscleGroupData.icon}</div>
                        <h5>{muscleGroupData.name}</h5>
                        <div className="workout-review-count">{groupExercises.length}</div>
                      </div>
                      
                      <div className="workout-review-exercises">
                        {groupExercises.map((exercise, index) => (
                          <div key={exercise.id} className="workout-review-exercise">
                            <div className="workout-review-name">{exercise.name}</div>
                            <div className="workout-review-details">
                              <span className="workout-review-equipment">{exercise.equipment}</span>
                              <span className="workout-review-sets">{exercise.sets} sets</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <button className="workout-create-btn" onClick={handleSubmit}>
                Create Workout
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!visible) return null;

  return (
    <div className={`workout-overlay ${exiting ? 'workout-fade-out' : ''}`} onClick={(e) => e.stopPropagation()}>
      <div 
        className={`workout-modal ${exiting ? 'workout-slide-down' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="workout-exit-btn" onClick={promptExit} aria-label="Close modal">
          <XCircle size={26} strokeWidth={2} />
        </button>
        
        <div className="workout-header">
          <div className="workout-steps">
            {[1, 2, 3].map(step => (
              <div 
                key={step} 
                className={`workout-step-indicator ${currentStep === step ? 'active' : ''} 
                ${currentStep > step ? 'completed' : ''}`}
              >
                <div className="workout-step-number">{step}</div>
                <div className="workout-step-label">
                  {step === 1 ? 'Name' : step === 2 ? 'Exercises' : 'Review'}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="workout-modal-content">
          {renderStepContent()}
        </div>
        
        <div className="workout-footer">
          <button 
            className="workout-back-btn" 
            onClick={currentStep === 1 ? handleClose : goToPreviousStep}
          >
            {currentStep === 1 ? 'Cancel' : (
              <>
                <ChevronLeft size={18} />
                <span>Back</span>
              </>
            )}
          </button>
          
          <button 
            className="workout-next-btn" 
            onClick={goToNextStep}
            disabled={(currentStep === 1 && !routineName.trim()) || 
                     (currentStep === 2 && selectedExercises.length === 0)}
          >
            {currentStep < 3 ? (
              <>
                <span>Next</span>
                <ChevronRight size={18} />
              </>
            ) : (
              <>
                <span>Create Workout</span>
                <Save size={18} />
              </>
            )}
          </button>
        </div>
        
        {/* Delete Exercise Confirmation Modal */}
        {showDeleteConfirmation && (
          <div className="workout-delete-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="workout-delete-modal" onClick={(e) => e.stopPropagation()}>
              <h4>Remove Exercise</h4>
              <p>Are you sure you want to remove this exercise from your routine?</p>
              
              <div className="workout-delete-actions">
                <button 
                  className="workout-delete-cancel" 
                  onClick={cancelRemoveExercise}
                >
                  Cancel
                </button>
                <button 
                  className="workout-delete-confirm" 
                  onClick={confirmRemoveExercise}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exit Confirmation Modal */}
        {showExitConfirmation && (
          <div className="workout-delete-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="workout-delete-modal" onClick={(e) => e.stopPropagation()}>
              <h4 className="exit-title">Quit Workout Creation</h4>
              <p>Do you want to quit creating routine?</p>
              
              <div className="workout-delete-actions">
                <button 
                  className="workout-delete-cancel" 
                  onClick={cancelExit}
                >
                  No
                </button>
                <button 
                  className="workout-delete-confirm" 
                  onClick={confirmExit}
                >
                  Yes
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
  };

  // Array of possible set values
  const setPossibilities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="workout-selected-item"
      data-dragging={isDragging}
    >
      <div className="workout-selected-drag" {...attributes} {...listeners}>
        <GripVertical size={16} />
      </div>
      
      <div className="workout-selected-info">
        <div className="workout-selected-name">{exercise.name}</div>
        <div className="workout-selected-details">
          <span className="workout-selected-group">
            {muscleGroups.find(mg => mg.id === exercise.muscleGroup)?.icon} 
            {muscleGroups.find(mg => mg.id === exercise.muscleGroup)?.name}
          </span>
          <span className="workout-selected-equipment">{exercise.equipment}</span>
        </div>
      </div>
      
      <div className="workout-selected-sets">
        <select
          className="workout-sets-dropdown"
          value={exercise.sets}
          onChange={(e) => onUpdateSets(exercise.id, e.target.value)}
          aria-label="Number of sets"
        >
          {setPossibilities.map(num => (
            <option key={num} value={num}>{num} sets</option>
          ))}
        </select>
      </div>
      
      <button
        className="workout-remove-btn"
        onClick={() => onRemove(exercise.id)}
        title="Remove exercise"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default CreateWorkoutRoutine;
