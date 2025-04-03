import React, { useState } from 'react';

const EditableField = ({ 
  value, 
  onSave, 
  isEditable = true,
  fieldType = 'input',
  className = '',
  inputClassName = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  
  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && fieldType === 'input') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing && isEditable) {
    if (fieldType === 'textarea') {
      return (
        <div className="flex flex-col">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 ${inputClassName}`}
            rows={3}
            autoFocus
          />
          <div className="flex space-x-2 mt-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditValue(value);
                setIsEditing(false);
              }}
              className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex items-center">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`p-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 ${inputClassName}`}
          autoFocus
        />
        <button
          onClick={handleSave}
          className="ml-2 text-teal-500 hover:text-teal-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  }
  
  return (
    <div 
      className={`group ${className}`} 
      onClick={() => isEditable && setIsEditing(true)}
    >
      {fieldType === 'textarea' ? (
        <p>{value}</p>
      ) : (
        <span>{value}</span>
      )}
      
      {isEditable && (
        <button 
          className="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-teal-400 transition-opacity duration-200 inline-flex"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default EditableField;