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

## Package Configuration

```json
{
  "name": "collabhive",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview",
    "start": "react-scripts start",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.0",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-alert-dialog": "^1.1.1",
    "@radix-ui/react-aspect-ratio": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.1.1",
    "@radix-ui/react-collapsible": "^1.1.0",
    "@radix-ui/react-context-menu": "^2.2.1",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-hover-card": "^1.1.1",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-menubar": "^1.1.1",
    "@radix-ui/react-navigation-menu": "^1.2.0",
    "@radix-ui/react-popover": "^1.1.1",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.0",
    "@radix-ui/react-scroll-area": "^1.1.0",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.1",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.4",
    "@tanstack/react-query": "^5.56.2",
    "axios": "^1.8.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.3.0",
    "input-otp": "^1.2.4",
    "lucide-react": "^0.462.0",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.53.0",
    "react-resizable-panels": "^2.1.3",
    "react-router-dom": "^6.26.2",
    "recharts": "^2.12.7",
    "sonner": "^1.5.0",
    "tailwind-merge": "^2.5.2",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.3",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.0",
    "@tailwindcss/typography": "^0.5.15",
    "@types/node": "^22.5.5",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.9.0",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.9",
    "globals": "^15.9.0",
    "lovable-tagger": "^1.1.7",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.11",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.0.1",
    "vite": "^5.4.1"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

# React Project Overview

This project is a React application that utilizes Tailwind CSS for styling. It features a Project Overview Panel where project owners can view and edit project details such as the project name, title, and an optional description.

## Project Structure

```
react-project-overview
├── public
│   └── index.html
├── src
│   ├── components
│   │   ├── ProjectOverviewPanel.jsx
│   │   └── EditableField.jsx
│   ├── contexts
│   │   └── ProjectContext.jsx
│   ├── hooks
│   │   └── useEditableField.js
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd react-project-overview
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to view the application.

## Usage

- The Project Overview Panel displays the project name, title, and description.
- Project owners can click on the description to edit it.
- Changes are saved automatically when the user finishes editing.

## Technologies Used

- React
- Tailwind CSS
- Context API for state management

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

