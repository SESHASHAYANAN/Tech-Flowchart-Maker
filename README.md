# Tech Flowchart Maker & Pipeline Builder

A high-performance, interactive system design canvas and pipeline builder built with React, React Flow, and Zustand on the frontend, powered by a FastAPI Python backend for Directed Acyclic Graph (DAG) validation.

## 🚀 Features

*   **Dynamic Node Abstraction**: A single, robust `BaseNode` architecture powers over 18 unique node types (Input, LLM, Database, API Gateway, Services, etc.) minimizing code duplication and maximizing scalability.
*   **System Design Components**: Comprehensive set of architectural nodes categorized neatly into a compact, tabbed segmented control toolbar (Pipeline, System Design, Containers).
*   **Resizable Visual Containers**: "Group Box" nodes utilize React Flow's native `NodeResizer` along with custom state persistence to create responsive, glassmorphic visual containers. Nodes can be freely dragged in and out without breaking layout hierarchies.
*   **Modern Aesthetics**: Glassmorphism UI, custom variable sizing, themed node colors, and dynamic micro-animations for an ultra-premium feel.
*   **State Persistence**: Auto-saves canvas state locally. Includes full manual Save, Load, Rename, and Delete functionality using Zustand.
*   **Backend DAG Validation**: Seamlessly submits pipeline structures to the Python FastAPI backend to calculate node count, edge count, and validate if the connections form a Directed Acyclic Graph.

## 🛠️ Technology Stack

*   **Frontend**: React (v18), React Flow (v11), Zustand (State Management), Vanilla CSS (Custom Design System).
*   **Backend**: Python, FastAPI, Uvicorn.
*   **Deployment/Build**: Node.js, Webpack (via Create React App).

## 💻 Getting Started

### Prerequisites
*   Node.js (v16+)
*   Python (3.9+)

### 1. Run the Backend
Navigate to the backend directory, install requirements (if any), and start the FastAPI server:
```bash
cd backend
pip install fastapi uvicorn pydantic
uvicorn main:app --reload --port 8000
```
The backend will be available at `http://localhost:8000`.

### 2. Run the Frontend
Navigate to the frontend directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm start
```
The application will be available at `http://localhost:3000`.

## 📦 Building for Production
To create an optimized production build for the frontend:
```bash
cd frontend
npm run build
```

## 🏗️ Architecture Decisions
*   **State Management**: Moved away from prop-drilling in favor of a centralized Zustand store for both UI state and React Flow node/edge management.
*   **Visual Grouping over Parent-Child**: Explicitly chose *visual CSS grouping* (with z-index management) over strict React Flow parent-child relationships to prevent the common UX issue where nodes get "trapped" inside containers or cause erratic drag behavior.
*   **Node Dimension Persistence**: Custom dimensions for resizable containers are explicitly saved to `node.data` ensuring sizes persist flawlessly across browser sessions.
