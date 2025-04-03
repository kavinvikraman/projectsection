
# CollabHive Project Hub

A collaborative workspace for teams to manage projects, tasks, and share documents.

## Features

- Project management with details editing
- Team member management
- Task tracking with filtering and sorting
- Collaborative document editor
- Real-time updates

## Tech Stack

### Frontend
- React
- Tailwind CSS
- React Query for data fetching
- Shadcn UI components

### Backend
- Flask (Python)
- PostgreSQL database
- RESTful API

## Setup Instructions

### Backend Setup

1. Create a virtual environment:
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```
pip install -r requirements.txt
```

3. Create a PostgreSQL database named `collabhive`

4. Copy `.env.example` to `.env` and update with your database credentials:
```
cp .env.example .env
```

5. Run the Flask application:
```
python app.py
```

### Frontend Setup

1. Install dependencies:
```
npm install
```

2. Copy the frontend environment file:
```
cp .env.example .env.local
```

3. Run the development server:
```
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Projects
- GET `/api/projects` - Get all projects
- GET `/api/projects/:id` - Get a specific project
- POST `/api/projects` - Create a new project
- PUT `/api/projects/:id` - Update a project

### Members
- GET `/api/members` - Get all team members
- POST `/api/members` - Add a new team member
- DELETE `/api/members/:id` - Remove a team member

### Tasks
- GET `/api/tasks` - Get all tasks
- POST `/api/tasks` - Create a new task
- PUT `/api/tasks/:id` - Update a task status

### Documents
- GET `/api/documents/:projectId` - Get project document
- PUT `/api/documents/:projectId` - Update project document
