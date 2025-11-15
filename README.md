# Lumibyte — Simplified Chat Application (Mock)

This repository contains a frontend (React + Tailwind) and a backend (Node.js + Express) serving mock JSON data.

## Quick start (local)

1. Backend
```
cd backend
npm install
npm start
```
Backend listens on port 4000 by default.

2. Frontend
```
cd frontend
npm install
npm start
```
Frontend runs on port 3000 (React default). The frontend expects the backend at http://localhost:4000.

## What's included
- Backend: server.js, mockData.js, package.json
- Frontend: React components (Sidebar, ChatWindow, TableResponse, ThemeToggle, ChatInput, AnswerFeedback), Tailwind config, package.json