import React, { useState, useRef } from 'react';
import './MainChatPage.css';
import MiniPopup from './MainChatPages/MiniPopup';
import CreateWorkoutRoutine from './MainChatPages/CreateWorkoutRoutine';

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
  const textareaRef = useRef();
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);


  const handleInput = () => {
    const el = textareaRef.current;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending:', message);
      setMessage('');
      textareaRef.current.style.height = 'auto';
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
      const oldIndex = targetMuscles.findIndex((m) => m.id === active.id);
      const newIndex = targetMuscles.findIndex((m) => m.id === over.id);
      setTargetMuscles((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
      opacity: isDragging ? 0.5 : 1,
    };
  
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="muscle-box"
        onClick={onClick}
      >
        <div
          className="drag-handle"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          🟰
        </div>
        <h4>{muscle.name}</h4>
        <ul>
          {muscle.exercises.map((ex, i) => (
            <li key={i}>{ex}</li>
          ))}
        </ul>
      </div>
    );
  };
  

  return (
    <div className="mainchat-wrapper">
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-close-icon" onClick={toggleSidebar}>☰</div>
          <div className="sidebar-search-icon">🔍</div>
        </div>
        <div className="sidebar-content">
          <h3>Sidebar</h3>
          <p>Some menu items or settings</p>
        </div>
      </div>
      <div
        className={`mainchat-container 
          ${sidebarOpen ? 'sidebar-opened' : ''} 
          ${sidebarOpen && window.innerWidth < 768 ? 'sidebar-blur' : ''} 
          ${modalContent ? 'modal-blur' : ''}`}
        onClick={() => {
          if (window.innerWidth < 768 && sidebarOpen) {
            toggleSidebar();
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
          <div className="user-icon">👤</div>
        </div>

        {/* SCROLLABLE MIDDLE PANE */}
        <div className="scroll-pane">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={targetMuscles.map((m) => m.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="scroll-content">
                {targetMuscles.map((muscle) => (
                  <SortableMuscleBox
                    key={muscle.id}
                    muscle={muscle}
                    onClick={() => setModalContent(muscle)}
                  />
                ))}
                <div
                  className="muscle-box add-own-box"
                  onClick={() => setShowCreateWorkout(true)}
                >
                  <div className="add-icon">＋</div>
                  <p className="add-text">Add your own workout</p>
                </div>
              </div>
            </SortableContext>
          </DndContext>

          
        </div>

        {/* CHAT MESSAGES */}
        <div className="chat-body">
          <p className="chat-placeholder">Chat messages will appear here...</p>
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

        {/* MODAL OVERLAY */}
        <MiniPopup muscleGroup={modalContent} onClose={() => setModalContent(null)} />
        
        {showCreateWorkout && (
          <CreateWorkoutRoutine onClose={() => setShowCreateWorkout(false)} />
        )}
      </div>
    </div>
  );
};

export default MainChatPage;
