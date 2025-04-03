import React from 'react';
//const EditableField = ({   value,   onSave,   isEditable = true,  fieldType = 'input',  className = '',  inputClassName = ''}) => {  const [isEditing, setIsEditing] = useState(false);  const [editValue, setEditValue] = useState(value);    const handleSave = () => {    onSave(editValue);    setIsEditing(false);  };    const handleKeyDown = (e) => {    if (e.key === 'Enter' && fieldType === 'input') {      handleSave();    }    if (e.key === 'Escape') {      setEditValue(value);      setIsEditing(false);    }  };  if (isEditing && isEditable) {    if (fieldType === 'textarea') {      return (        <div className="flex flex-col">          <textarea            value={editValue}            onChange={(e) => setEditValue(e.target.value)}            onKeyDown={handleKeyDown}            className={`p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 ${inputClassName}`}            rows={3}            autoFocus          />          <div className="flex space-x-2 mt-2">            <button              onClick={handleSave}              className="px-3 py-1 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700"            >              Save            </button>            <button              onClick={() => {                setEditValue(value);                setIsEditing(false);              }}              className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"            >              Cancel            </button>          </div>        </div>      );    }        return (      <div className="flex items-center">        <input          type="text"          value={editValue}          onChange={(e) => setEditValue(e.target.value)}          onKeyDown={handleKeyDown}          className={`p-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 ${inputClassName}`}          autoFocus        />        <button          onClick={handleSave}          className="ml-2 text-teal-500 hover:text-teal-400"        >          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />          </svg>        </button>      </div>    );  }    return (    <div       className={`group ${className}`}       onClick={() => isEditable && setIsEditing(true)}    >      {fieldType === 'textarea' ? (        <p>{value}</p>      ) : (        <span>{value}</span>      )}            {isEditable && (        <button           className="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-teal-400 transition-opacity duration-200 inline-flex"          onClick={(e) => {            e.stopPropagation();            setIsEditing(true);          }}        >          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />          </svg>        </button>      )}    </div>  );};export default EditableField;import React, { useState } from 'react';
import EditableField from './EditableField';

const ProjectSection = () => {
  // Sample project data - this could come from props or API in a real app
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Portfolio Website",
      title: "Personal Portfolio Redesign",
      description: "A modern portfolio website built with React and Tailwind CSS featuring dark mode, animations, and responsive design.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80",
      tags: ["React", "Tailwind CSS", "Framer Motion"],
      isOwner: true,
    },
    {
      id: 2,
      name: "E-Commerce Platform",
      title: "Full-Stack Online Store",
      description: "Complete e-commerce solution with product management, user authentication, payment processing, and order tracking.",
      image: "https://images.unsplash.com/photo-1556742049-0a8061d8b197?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      tags: ["Next.js", "MongoDB", "Stripe", "Tailwind"],
      isOwner: true,
    },
    {
      id: 3,
      name: "Task Management App",
      title: "Team Collaboration Tool",
      description: "Intuitive task management application with drag-and-drop interface, team assignment, and progress tracking.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      tags: ["React", "Firebase", "Redux", "Material UI"],
      isOwner: false,
    },
  ]);

  // Handle project updates
  const updateProject = (id, field, value) => {
    setProjects((projects) =>
      projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
              My Projects
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore my latest work and creative endeavors, showcasing innovation
            and technical expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl border border-gray-700 group"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-80"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-900 bg-opacity-70 text-blue-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <EditableField
                    value={project.name}
                    onSave={(value) => updateProject(project.id, "name", value)}
                    isEditable={project.isOwner}
                    fieldType="input"
                    className="text-xl font-bold text-teal-500"
                    inputClassName="bg-gray-700 text-teal-500"
                  />

                  <EditableField
                    value={project.title}
                    onSave={(value) => updateProject(project.id, "title", value)}
                    isEditable={project.isOwner}
                    fieldType="input"
                    className="text-lg font-medium text-white mt-1"
                    inputClassName="bg-gray-700 text-white"
                  />
                </div>

                <EditableField
                  value={project.description}
                  onSave={(value) =>
                    updateProject(project.id, "description", value)
                  }
                  isEditable={project.isOwner}
                  fieldType="textarea"
                  className="text-gray-400 mb-6"
                  inputClassName="bg-gray-700 text-gray-300"
                />

                <div className="flex justify-between items-center mt-4">
                  <button className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1">
                    View Details
                  </button>

                  {project.isOwner && (
                    <div className="text-gray-400 text-sm italic">
                      You can edit this project
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectSection;

