import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ThemeToggle from './components/ThemeToggle';
import './index.css';

function App(){
  return (
    <BrowserRouter>
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Sidebar />
        <div className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Lumibyte — Simplified Chat</h1>
            <ThemeToggle />
          </div>
          <Routes>
            <Route path="/" element={<div className="p-6">Start a <strong>New Chat</strong> or pick a session from the left.</div>} />
            <Route path="/chat/:sessionId" element={<ChatWindow />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App;