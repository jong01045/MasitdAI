import React, { useState, useEffect, useRef } from 'react';
import './WorkoutPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import UserMenu from './Components/UserMenu';
import { 
  ChevronLeft, Clock, Plus, Trash2, History, Save, 
  BarChart2, Play, Pause, RotateCcw, Volume2 
} from 'lucide-react';

const WorkoutPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [historyType, setHistoryType] = useState('routine'); // 'routine' or 'exercise'
  
  // Timer state
  const [timerDuration, setTimerDuration] = useState(90); // default 90 seconds
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const timerRef = useRef(null);
  
  // Exercise data state
  const [workoutSets, setWorkoutSets] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [setToDelete, setSetToDelete] = useState({ exercise: '', index: -1 });
  
  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'system', text: 'Hello! I\'m your workout assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatDisplayRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Get the selected muscle group data
  const muscleGroup = location.state?.muscleGroup || {
    name: 'Sample Workout',
    exercises: ['Bench Press', 'Shoulder Press', 'Squat']
  };

  // Initialize workout sets data structure
  useEffect(() => {
    const initialSets = {};
    muscleGroup.exercises.forEach(exercise => {
      initialSets[exercise] = [{
        weight: '',
        reps: '',
        id: Date.now() + Math.random()
      }];
    });
    setWorkoutSets(initialSets);
    
    // Set the first exercise as active by default
    if (muscleGroup.exercises.length > 0) {
      setActiveTab(0);
    }
  }, [muscleGroup.exercises]);

  // Timer functionality
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timerActive && timeRemaining === 0) {
      setTimerActive(false);
      setTimerCompleted(true);
      playAlarmSound();
    }

    return () => clearTimeout(timerRef.current);
  }, [timerActive, timeRemaining]);

  const playAlarmSound = () => {
    // Play default alarm sound
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    audio.play();
  };

  const startTimer = () => {
    setTimeRemaining(timerDuration);
    setTimerActive(true);
    setTimerCompleted(false);
  };

  const pauseTimer = () => {
    setTimerActive(false);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimeRemaining(timerDuration);
    setTimerCompleted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle set operations (add, update, delete)
  const addSet = (exercise) => {
    setWorkoutSets(prev => ({
      ...prev,
      [exercise]: [
        ...prev[exercise], 
        { weight: '', reps: '', id: Date.now() + Math.random() }
      ]
    }));
  };

  const updateSet = (exercise, index, field, value) => {
    const newSets = [...workoutSets[exercise]];
    newSets[index] = { ...newSets[index], [field]: value };
    
    setWorkoutSets(prev => ({
      ...prev,
      [exercise]: newSets
    }));
  };

  const confirmDeleteSet = (exercise, index) => {
    // Check if the set has data
    const set = workoutSets[exercise][index];
    if (set.weight || set.reps) {
      setDeleteConfirmOpen(true);
      setSetToDelete({ exercise, index });
    } else {
      deleteSet(exercise, index);
    }
  };

  const deleteSet = (exercise, index) => {
    // Don't delete if it's the last set
    if (workoutSets[exercise].length <= 1) {
      return;
    }
    
    const newSets = workoutSets[exercise].filter((_, i) => i !== index);
    setWorkoutSets(prev => ({
      ...prev,
      [exercise]: newSets
    }));
    
    setDeleteConfirmOpen(false);
  };

  const saveWorkout = () => {
    // Save workout data to localStorage or your backend
    const workoutData = {
      date: new Date().toISOString(),
      muscleGroup: muscleGroup.name,
      exercises: Object.keys(workoutSets).map(exercise => ({
        name: exercise,
        sets: workoutSets[exercise]
      }))
    };
    
    console.log('Saving workout:', workoutData);
    
    // For now, just store in localStorage as an example
    const savedWorkouts = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    savedWorkouts.push(workoutData);
    localStorage.setItem('workoutHistory', JSON.stringify(savedWorkouts));
    
    alert('Workout saved successfully!');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeUserMenu = () => setUserMenuOpen(false);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  // Mock data for workout history
  const mockRoutineHistory = [
    { date: '2023-06-15', exercises: { 'Bench Press': [{ weight: 135, reps: 10 }, { weight: 155, reps: 8 }] } },
    { date: '2023-06-08', exercises: { 'Bench Press': [{ weight: 135, reps: 8 }, { weight: 145, reps: 8 }] } }
  ];
  
  const mockExerciseHistory = [
    { date: '2023-06-15', routine: 'Chest Day', weight: 135, reps: 10 },
    { date: '2023-06-10', routine: 'Full Body', weight: 125, reps: 12 },
    { date: '2023-06-01', routine: 'Upper Body', weight: 135, reps: 8 }
  ];

  const currentExercise = muscleGroup.exercises[activeTab];
  const isMobile = window.innerWidth < 768;

  const handleSendChat = () => {
    if (chatInput.trim()) {
      // Add user message
      setChatMessages(prev => [...prev, { sender: 'user', text: chatInput }]);
      
      // Simulate assistant response (this will be replaced with actual LLM call)
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          sender: 'system', 
          text: `I'll help you with your ${muscleGroup.name} workout. Let me know if you need specific advice!` 
        }]);
      }, 1000);
      
      setChatInput('');
    }
  };
  
  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="workout-wrapper">
      {/* Sidebar */}     
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
      <div
        className={`workout-container 
          ${sidebarOpen && !isMobile ? 'sidebar-opened' : ''} 
          ${sidebarOpen && isMobile ? 'sidebar-blur' : ''}`}
        onClick={() => {
          if (sidebarOpen && isMobile) {
            setSidebarOpen(false);
          }
          // Close user menu if clicking elsewhere
          if (userMenuOpen) {
            closeUserMenu();
          }
        }}
      >
        {/* Header */}
        <div className="workout-header">
          <div className="workout-header-left">
          {!sidebarOpen && (
              <button className="sidebar-toggle" onClick={toggleSidebar}>☰</button>
            )}
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ChevronLeft size={18} />
              <span>Back</span>
            </button>
          </div>
          
          <div className="workout-title">{muscleGroup.name} Workout</div>
          
          <div className="workout-header-right">
            <button className="save-workout-btn" onClick={saveWorkout}>
              <Save size={18} />
              <span>Save</span>
            </button>
            <button className="user-menu-toggle" onClick={toggleUserMenu}>👤</button>
            
            {/* User Menu */}
            <UserMenu isOpen={userMenuOpen} onClose={closeUserMenu} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="workout-content">
          {/* History Overlay */}
          {showHistory && (
            <div className="history-overlay" onClick={() => setShowHistory(false)}>
              <div className="history-panel" onClick={e => e.stopPropagation()}>
                <div className="history-header">
                  <h3>{historyType === 'routine' ? 'Routine History' : `${currentExercise} History`}</h3>
                  <div className="history-tabs">
                    <button 
                      className={historyType === 'routine' ? 'active' : ''} 
                      onClick={() => setHistoryType('routine')}
                    >
                      Routine
                    </button>
                    <button 
                      className={historyType === 'exercise' ? 'active' : ''} 
                      onClick={() => setHistoryType('exercise')}
                    >
                      Exercise
                    </button>
                  </div>
                  <button className="close-history" onClick={() => setShowHistory(false)}>×</button>
                </div>
                
                <div className="history-content">
                  {historyType === 'routine' ? (
                    <div className="routine-history">
                      {mockRoutineHistory.map((session, i) => (
                        <div key={i} className="history-item">
                          <div className="history-date">{new Date(session.date).toLocaleDateString()}</div>
                          <div className="history-sets">
                            {Object.entries(session.exercises).map(([exercise, sets]) => (
                              <div key={exercise} className="history-exercise">
                                <div className="history-exercise-name">{exercise}</div>
                                <div className="history-sets-list">
                                  {sets.map((set, j) => (
                                    <div key={j} className="history-set">
                                      <span className="set-number">Set {j+1}:</span>
                                      <span className="set-weight">{set.weight} lbs</span>
                                      <span className="set-reps">{set.reps} reps</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="exercise-history">
                      {mockExerciseHistory.map((record, i) => (
                        <div key={i} className="history-item">
                          <div className="history-date">{new Date(record.date).toLocaleDateString()}</div>
                          <div className="history-routine">{record.routine}</div>
                          <div className="history-performance">
                            <span className="history-weight">{record.weight} lbs</span>
                            <span>×</span>
                            <span className="history-reps">{record.reps} reps</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
          </div>
          )}

          {/* Exercise Tabs */}
          <div className="exercise-tabs">
            {muscleGroup.exercises.map((exercise, index) => (
                <button
                  key={exercise}
                className={`exercise-tab ${index === activeTab ? 'active' : ''}`}
                onClick={() => setActiveTab(index)}
                >
                  {exercise}
                </button>
              ))}
            </div>

          {/* Workout Tracking Area */}
          <div className="workout-tracking">
            <div className="tracking-header">
              <h2>{currentExercise}</h2>
              <div className="tracking-controls">
                <button className="history-btn" onClick={() => {
                  setHistoryType('exercise');
                  setShowHistory(true);
                }}>
                  <History size={16} />
                  <span>History</span>
                </button>
                <button className="routine-history-btn" onClick={() => {
                  setHistoryType('routine');
                  setShowHistory(true);
                }}>
                  <BarChart2 size={16} />
                  <span>Routine</span>
                </button>
              </div>
            </div>

            {/* Sets Table */}
            <div className="sets-table">
              <div className="table-header">
                <div className="set-col">Set</div>
                <div className="weight-col">Weight (lbs)</div>
                <div className="reps-col">Reps</div>
                <div className="actions-col">Actions</div>
              </div>
              
              <div className="table-body">
                {workoutSets[currentExercise]?.map((set, index) => (
                  <div className="table-row" key={set.id}>
                    <div className="set-col">Set {index+1}</div>
                    <div className="weight-col">
                      <input
                        type="number"
                        placeholder="0"
                        value={set.weight}
                        onChange={(e) => updateSet(currentExercise, index, 'weight', e.target.value)}
                      />
                    </div>
                    <div className="reps-col">
                      <input
                        type="number"
                        placeholder="0"
                        value={set.reps}
                        onChange={(e) => updateSet(currentExercise, index, 'reps', e.target.value)}
                      />
                    </div>
                    <div className="actions-col">
                      <button 
                        className="delete-set-btn"
                        onClick={() => confirmDeleteSet(currentExercise, index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="add-set-btn" onClick={() => addSet(currentExercise)}>
                <Plus size={16} /> Add Set
              </button>
            </div>
          </div>

          {/* Bottom section with Timer and Chat */}
          <div className="workout-bottom-section">
            {/* Timer Section */}
            <div className="timer-section">
              <div className="timer-header">
                <Clock size={18} />
                <h3>Rest Timer</h3>
              </div>
              
              <div className="timer-display">
                <div className={`timer-time ${timerCompleted ? 'completed' : ''}`}>
                  {formatTime(timeRemaining)}
                </div>
                
                <div className="timer-controls">
                  {!timerActive ? (
                    <button className="start-timer" onClick={startTimer}>
                      <Play size={16} />
                    </button>
                  ) : (
                    <button className="pause-timer" onClick={pauseTimer}>
                      <Pause size={16} />
                    </button>
                  )}
                  
                  <button className="reset-timer" onClick={resetTimer}>
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
              
              <div className="timer-settings">
                <div className="timer-presets">
                  <button 
                    className={timerDuration === 60 ? 'active' : ''} 
                    onClick={() => setTimerDuration(60)}
                  >
                    1:00
                  </button>
                  <button 
                    className={timerDuration === 90 ? 'active' : ''} 
                    onClick={() => setTimerDuration(90)}
                  >
                    1:30
                  </button>
                  <button 
                    className={timerDuration === 120 ? 'active' : ''} 
                    onClick={() => setTimerDuration(120)}
                  >
                    2:00
                  </button>
                  <button 
                    className={timerDuration === 180 ? 'active' : ''} 
                    onClick={() => setTimerDuration(180)}
                  >
                    3:00
                  </button>
                </div>
                <div className="custom-timer">
                  <input 
                    type="number" 
                    placeholder="Custom (sec)"
                    onChange={(e) => setTimerDuration(parseInt(e.target.value) || 60)}
                  />
                </div>
              </div>
            </div>

            {/* Chat Section */}
            <div className="workout-chat-section">
              <div className="chat-header">
                <h3>Workout Assistant</h3>
              </div>
              
              <div className="chat-display" ref={chatDisplayRef}>
                {chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'system-message'}`}
                  >
                    <div className="message-content">
                      {msg.text}
                    </div>
                  </div>
                ))}
        </div>

        <div className="chat-input-area">
                <input
                  type="text"
                  placeholder="Ask me anything about your workout..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendChat();
                    }
                  }}
                />
                <button className="send-chat-btn" onClick={handleSendChat}>
                  ⏎
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Set Confirmation */}
      {deleteConfirmOpen && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <h3>Delete Set</h3>
            <p>This set has data. Are you sure you want to delete it?</p>
            <div className="confirmation-actions">
              <button 
                className="cancel-btn" 
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn" 
                onClick={() => deleteSet(setToDelete.exercise, setToDelete.index)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPage;
