# Tech Flowchart Maker & Pipeline Builder

A high-performance, interactive system design canvas and pipeline builder built with React, React Flow, and Zustand on the frontend, powered by a FastAPI Python backend for DAG validation and Groq AI for intelligent architecture generation.

## 🛠️ Technology Stack

*   **Frontend**: React (v18), React Flow (v11), Zustand (State Management), Vanilla CSS (Custom Design System).
*   **Backend**: Python, FastAPI, Uvicorn.
*   **AI**: Groq API (LLaMA 3.3 70B) for intelligent project architecture generation.
*   **Deployment/Build**: Node.js, Webpack (via Create React App).

## 💻 Getting Started

### Prerequisites
*   Node.js (v16+)
*   Python (3.9+)

### 1. Run the Backend
```bash
cd backend
pip install fastapi uvicorn pydantic
uvicorn main:app --reload --port 8000
```

### 2. Run the Frontend
```bash
cd frontend
npm install
npm start
```

## 📦 Building for Production
```bash
cd frontend
npm run build
```

## 🏗️ Architecture Decisions
*   **State Management**: Centralized Zustand store for UI state and React Flow node/edge management.
*   **Visual Grouping over Parent-Child**: Visual CSS grouping with z-index management over strict parent-child relationships.
*   **AI-Powered Generation**: Groq API integration generates full system architectures from natural language prompts with follow-up refinement.
*   **Node Dimension Persistence**: Custom dimensions for resizable containers saved to `node.data` for cross-session persistence.
