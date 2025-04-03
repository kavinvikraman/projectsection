import { useState } from 'react';

const useEditableField = (initialValue = '') => {
    const [value, setValue] = useState(initialValue);
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => {
        setIsEditing(prev => !prev);
    };

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const saveChanges = () => {
        // Logic to save changes can be implemented here
        toggleEdit();
    };

    return {
        value,
        isEditing,
        toggleEdit,
        handleChange,
        saveChanges,
    };
};

export default useEditableField;