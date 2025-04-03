import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProjectSection from './components/ProjectSection';
//import EditableField from './components/';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <nav className="bg-gray-800 p-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-teal-400 hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/projects" className="text-teal-400 hover:underline">
                Projects
              </Link>
            </li>
            <li>
              <Link to="/editable-field" className="text-teal-400 hover:underline">
                Editable Field
              </Link>
            </li>
          </ul>
        </nav>

        <main className="p-6">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h1 className="text-3xl font-bold underline">Welcome to My App</h1>
                  <p className="mt-4 text-gray-400">
                    Navigate to different sections using the links above.
                  </p>
                </div>
              }
            />
            <Route path="/projects" element={<ProjectSection />} />
            <Route
              path="/editable-field"
              element={
                <EditableField
                  value="Click to edit me!"
                  onSave={(value) => alert(`Saved value: ${value}`)}
                  isEditable={true}
                  fieldType="input"
                  className="text-lg font-medium text-white"
                  inputClassName="bg-gray-700 text-white"
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
