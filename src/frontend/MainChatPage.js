import React, { useState, useRef, useEffect } from 'react';
import './MainChatPage.css';
import MiniPopup from './MainChatPages/MiniPopup';
import CreateWorkoutRoutine from './MainChatPages/CreateWorkoutRoutine';
import Sidebar from './Components/Sidebar';
import UserMenu from './Components/UserMenu';
import { GripVertical, X, Plus, ChevronLeft, MoreVertical, Edit, Trash2, Settings } from 'lucide-react';
import { FolderIcon } from 'lucide-react';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';

import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

const initialMuscles = [
  { id: '1', name: 'Chest', exercises: ['Bench Press', 'Incline Dumbbell', 'Cable Fly'] },
  { id: '2', name: 'Back', exercises: ['Pull Ups', 'Deadlift', 'Lat Pulldown'] },
  { id: '3', name: 'Legs', exercises: ['Squats', 'Lunges', 'Leg Press'] },
];

const MainChatPage = () => {
  const [targetMuscles, setTargetMuscles] = useState(initialMuscles);
  const [modalContent, setModalContent] = useState(null);
  const [message, setMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const textareaRef = useRef();
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [muscleToDelete, setMuscleToDelete] = useState(null);
  const [messages, setMessages] = useState([]);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const closeUserMenu = () => setUserMenuOpen(false);
  const chatBodyRef = useRef();
  const mainContainerRef = useRef(null);
  const [folders, setFolders] = useState({
    'Initial Recommendations': initialMuscles,
  });
  const [currentFolder, setCurrentFolder] = useState('Initial Recommendations');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderOptions, setShowFolderOptions] = useState(false);
  const [folderToRename, setFolderToRename] = useState('');
  const [newRenameFolderName, setNewRenameFolderName] = useState('');
  const [showFolderDeleteConfirmation, setShowFolderDeleteConfirmation] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState('');

  // Function to scroll chat body to bottom
  const scrollChatToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  // Function to scroll main container to bottom
  const scrollMainToBottom = () => {
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollTop = mainContainerRef.current.scrollHeight;
    }
  };

  // Scroll both when messages change
  useEffect(() => {
    scrollChatToBottom();
    scrollMainToBottom();
  }, [messages]);

  const handleInput = () => {
    const el = textareaRef.current;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const handleSend = () => {
    if (message.trim()) {
      // Add user message
      const newUserMessage = {
        text: message,
        isUser: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newUserMessage]);
      setMessage('');
      textareaRef.current.style.height = 'auto';

      // Add dummy assistant response after a short delay
      setTimeout(() => {
        const dummyResponses = [
          "I understand your question about workouts. Let me help you with that.",
          "That's a great question! Here's what I recommend for your workout routine.",
          "I can help you create a personalized workout plan based on your goals.",
          "Let me analyze your request and provide a detailed response.",
          "I'll help you optimize your workout routine for better results."
        ];
        const randomResponse = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
        
        const newAssistantMessage = {
          text: randomResponse,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newAssistantMessage]);
      }, 1000); // 1 second delay to simulate response time
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      if (currentFolder) {
        setFolders(prev => {
          const updatedFolders = {...prev};
          const currentItems = [...updatedFolders[currentFolder]];
          const oldIndex = currentItems.findIndex((m) => m.id === active.id);
          const newIndex = currentItems.findIndex((m) => m.id === over.id);
          
          updatedFolders[currentFolder] = arrayMove(currentItems, oldIndex, newIndex);
          return updatedFolders;
        });
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleDeleteMuscle = (muscleId) => {
    console.log(`Deleting muscle group with ID: ${muscleId}`);
    
    // Remove from folders structure
    if (currentFolder) {
      setFolders(prev => {
        const updatedFolders = {...prev};
        if (updatedFolders[currentFolder]) {
          updatedFolders[currentFolder] = updatedFolders[currentFolder].filter(
            muscle => muscle.id !== muscleId
          );
        }
        return updatedFolders;
      });
    }
    
    setShowDeleteConfirmation(false);
  };

  const SortableMuscleBox = ({ muscle, onClick }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: muscle.id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
  
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="muscle-box"
        onClick={onClick}
        data-dragging={isDragging}
      >
        <div className="muscle-box-header">
          <div
            className="drag-handle"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={16} />
          </div>
          <h4>{muscle.name}</h4>
          <button 
            className="delete-button" 
            onClick={(e) => {
              e.stopPropagation();
              setMuscleToDelete(muscle.id);
              setShowDeleteConfirmation(true);
            }}
          >
            <X size={14} />
          </button>
        </div>
        
        <div className="muscle-box-content">
          <div className="exercise-list">
            {muscle.exercises.map((ex, i) => (
              <div key={i} className="exercise-item">
                <div className="exercise-bullet"></div>
                <div className="exercise-name">{ex}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const isMobile = window.innerWidth < 768;
  
  const handleCreateWorkoutConfirm = (newWorkouts) => {
    const combinedName = newWorkouts.map(workout => workout.muscle).join(', ');
    const allExercises = newWorkouts.flatMap(workout => workout.exercises.map(ex => ex.name));
    const newMuscle = {
      id: `${Date.now()}`,  // Use timestamp to ensure unique ID
      name: combinedName,
      exercises: allExercises,
    };
    
    // Add the new routine to the current folder
    setFolders(prev => {
      // Create a copy of the folders object
      const updatedFolders = {...prev};
      
      // Add the new routine to the current folder's array
      if (currentFolder && updatedFolders[currentFolder]) {
        updatedFolders[currentFolder] = [...updatedFolders[currentFolder], newMuscle];
      } else {
        // Fallback to default folder if no current folder
        updatedFolders['Initial Recommendations'] = [
          ...updatedFolders['Initial Recommendations'] || [],
          newMuscle
        ];
      }
      
      return updatedFolders;
    });
    
    setShowCreateWorkout(false);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      setFolders((prev) => ({ ...prev, [newFolderName.trim()]: [] }));
      setNewFolderName('');
      setShowCreateFolder(false);
    }
  };

  const handleEnterFolder = (folderName) => {
    setCurrentFolder(folderName);
  };

  const handleBackToParent = () => {
    setCurrentFolder(''); // Assuming '' is the root
  };

  const handleFolderOptions = (e) => {
    e.stopPropagation();
    setShowFolderOptions(true);
  };

  const handleRenameFolder = () => {
    if (newRenameFolderName.trim() && newRenameFolderName.trim() !== folderToRename) {
      setFolders(prev => {
        const updatedFolders = { ...prev };
        
        // Copy the folder contents to the new name
        updatedFolders[newRenameFolderName.trim()] = [...updatedFolders[folderToRename]];
        
        // Delete the old folder
        delete updatedFolders[folderToRename];
        
        return updatedFolders;
      });
      
      // If we're in the renamed folder, update currentFolder
      if (currentFolder === folderToRename) {
        setCurrentFolder(newRenameFolderName.trim());
      }
      
      // Reset states
      setNewRenameFolderName('');
      setFolderToRename('');
      setShowFolderOptions(false);
    } else {
      // Just close if name is the same or empty
      setNewRenameFolderName('');
      setFolderToRename('');
      setShowFolderOptions(false);
    }
  };

  const openFolderRenameDialog = () => {
    setFolderToRename(currentFolder);
    setNewRenameFolderName(currentFolder);
    setShowFolderOptions(false);
  };

  const openFolderDeleteConfirmation = () => {
    setFolderToDelete(currentFolder);
    setShowFolderDeleteConfirmation(true);
    setShowFolderOptions(false);
  };

  const handleDeleteFolder = () => {
    setFolders(prev => {
      const updatedFolders = { ...prev };
      delete updatedFolders[folderToDelete];
      return updatedFolders;
    });
    
    setCurrentFolder('');  // Navigate back to root
    setShowFolderDeleteConfirmation(false);
    setFolderToDelete('');
  };

  return (
    <div className="mainchat-wrapper">
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
      
      {/* Main Container */}
      <div
        ref={mainContainerRef}
        className={`mainchat-container 
          ${sidebarOpen && !isMobile? 'sidebar-opened' : ''} 
          ${sidebarOpen && isMobile ? 'sidebar-blur' : ''}`}
        onClick={() => {
          if (isMobile && sidebarOpen) {
            toggleSidebar();
          }
          // Close user menu if clicking elsewhere
          if (userMenuOpen) {
            closeUserMenu();
          }
        }}
      >
        {/* HEADER */}
        <div className="chat-header">
          {/* Only show ☰ when on small screens */}
          {!sidebarOpen && (
            <div className="sidebar-icon" onClick={toggleSidebar}>☰</div>
          )}
          <div className="chat-logo">MasidAI</div>
          <div className="user-icon" onClick={toggleUserMenu}>👤</div>
          
          {/* User Menu */}
          <UserMenu isOpen={userMenuOpen} onClose={closeUserMenu} />
        </div>
        
        {/* SCROLLABLE MIDDLE PANE */}
        <div className="scroll-pane">
          <div className="workout-routines-header">
            <div className="folder-navigation">
              {currentFolder && (
                <button 
                  className="back-button"
                  onClick={handleBackToParent}
                >
                  <ChevronLeft size={20} />
                  <span>Back</span>
                </button>
              )}
              <h3>{currentFolder || 'Folders'}</h3>
              {currentFolder && (
                <button 
                  className="folder-options-button"
                  onClick={handleFolderOptions}
                >
                  <Settings size={18} />
                </button>
              )}
            </div>
            <div className="header-actions">
              {currentFolder ? (
                <button 
                  className="add-routine-button"
                  onClick={() => setShowCreateWorkout(true)}
                >
                  <Plus size={18} />
                  <span>New Routine</span>
                </button>
              ) : (
                <button 
                  className="add-folder-button"
                  onClick={() => setShowCreateFolder(true)}
                >
                  <Plus size={18} />
                  <span>New Folder</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="scroll-content">
            {currentFolder ? (
              <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={folders[currentFolder].map(muscle => muscle.id)} 
                  strategy={horizontalListSortingStrategy}
                >
                  {folders[currentFolder].map((muscle) => (
                    <SortableMuscleBox
                      key={muscle.id}
                      muscle={muscle}
                      onClick={() => setModalContent(muscle)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              Object.keys(folders).map((folderName) => (
                <div 
                  key={folderName} 
                  className="folder-item" 
                  onClick={() => handleEnterFolder(folderName)}
                >
                  <h4>{folderName}</h4>
                  <FolderIcon className="folder-icon" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* CHAT MESSAGES */}
        <div className="chat-body" ref={chatBodyRef}>
          {messages.length === 0 ? (
            <p className="chat-placeholder">Chat messages will appear here...</p>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className={`chat-message ${msg.isUser ? 'user-message' : 'assistant-message'}`}
              >
                {msg.text}
              </div>
            ))
          )}
        </div>

        {/* CHAT INPUT */}
        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <div className="chat-input-row">
              <textarea
                ref={textareaRef}
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onInput={handleInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your message..."
                className="chat-input"
              />
              <button className="chat-send-button" onClick={handleSend}>
                ⏎
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL OVERLAY - Moved outside the main container to prevent blur */}
      {modalContent && (
        <MiniPopup 
          muscleGroup={modalContent} 
          onClose={() => setModalContent(null)} 
          onDelete={handleDeleteMuscle}
        />
      )}

      {showCreateWorkout && (
        <CreateWorkoutRoutine 
          onClose={() => setShowCreateWorkout(false)} 
          onConfirm={handleCreateWorkoutConfirm} 
        />
      )}

      {showDeleteConfirmation && (
        <div className="confirmation-popup">
          <div className="confirmation-content">
            <h3>Delete Workout Routine</h3>
            <p>Are you sure you want to delete this workout routine?</p>
            <div className="confirmation-actions">
              <button 
                className="cancel-btn" 
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn" 
                onClick={() => handleDeleteMuscle(muscleToDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Folder Popup */}
      {showCreateFolder && (
        <>
          <div className="folder-popup-backdrop"></div>
          <div className="create-folder-popup">
            <div className="popup-header">
              <h3>Create New Folder</h3>
              <button 
                className="close-button"
                onClick={() => setShowCreateFolder(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="popup-content">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="folder-name-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateFolder();
                  }
                }}
                autoFocus
              />
            </div>
            <div className="popup-footer">
              <button 
                className="cancel-button"
                onClick={() => setShowCreateFolder(false)}
              >
                Cancel
              </button>
              <button 
                className="create-button"
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </>
      )}

      {/* Folder Options Popup */}
      {showFolderOptions && (
        <>
          <div className="folder-popup-backdrop" onClick={() => setShowFolderOptions(false)}></div>
          <div className="folder-options-popup">
            <div className="popup-header">
              <h3>Folder Options</h3>
              <button 
                className="close-button"
                onClick={() => setShowFolderOptions(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="popup-content">
              <button className="folder-action-button" onClick={openFolderRenameDialog}>
                <Edit size={18} />
                <span>Rename Folder</span>
              </button>
              <button className="folder-action-button delete-action" onClick={openFolderDeleteConfirmation}>
                <Trash2 size={18} />
                <span>Delete Folder</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Rename Folder Popup */}
      {folderToRename && (
        <>
          <div className="folder-popup-backdrop"></div>
          <div className="create-folder-popup">
            <div className="popup-header">
              <h3>Rename Folder</h3>
              <button 
                className="close-button"
                onClick={() => {
                  setFolderToRename('');
                  setNewRenameFolderName('');
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="popup-content">
              <input
                type="text"
                value={newRenameFolderName}
                onChange={(e) => setNewRenameFolderName(e.target.value)}
                placeholder="Enter new folder name"
                className="folder-name-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRenameFolder();
                  }
                }}
                autoFocus
              />
            </div>
            <div className="popup-footer">
              <button 
                className="cancel-button"
                onClick={() => {
                  setFolderToRename('');
                  setNewRenameFolderName('');
                }}
              >
                Cancel
              </button>
              <button 
                className="create-button"
                onClick={handleRenameFolder}
                disabled={!newRenameFolderName.trim() || newRenameFolderName.trim() === folderToRename}
              >
                Rename
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Folder Confirmation */}
      {showFolderDeleteConfirmation && (
        <div className="confirmation-popup">
          <div className="confirmation-content">
            <h3>Delete Folder</h3>
            <p>Are you sure you want to delete this folder? This will permanently delete all workout routines within the folder.</p>
            <div className="confirmation-actions">
              <button 
                className="cancel-btn" 
                onClick={() => setShowFolderDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn delete-btn" 
                onClick={handleDeleteFolder}
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

export default MainChatPage;
