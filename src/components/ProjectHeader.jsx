
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save } from "lucide-react";

const ProjectHeader = ({ project, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);

  const handleSave = () => {
    onUpdate({ 
      ...project, 
      title, 
      description 
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-5">
      {!isEditing ? (
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-800">{project.title}</h1>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          <p className="text-gray-600">{project.description || "No description provided."}</p>
          {project.updatedAt && (
            <p className="text-xs text-gray-500">Last updated: {new Date(project.updatedAt).toLocaleString()}</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-700">
              Project Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Project Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHeader;
