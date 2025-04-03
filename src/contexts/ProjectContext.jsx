import React, { createContext, useState } from 'react';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const [project, setProject] = useState({
        name: '',
        title: '',
        description: ''
    });

    const updateProject = (updatedFields) => {
        setProject((prevProject) => ({
            ...prevProject,
            ...updatedFields
        }));
    };

    return (
        <ProjectContext.Provider value={{ project, updateProject }}>
            {children}
        </ProjectContext.Provider>
    );
};