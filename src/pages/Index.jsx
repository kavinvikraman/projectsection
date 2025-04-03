
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProjectHeader from "../components/ProjectHeader";
import MembersList from "../components/MembersList";
import TasksList from "../components/TasksList";
import CollaborativeEditor from "../components/CollaborativeEditor";
import { toast } from "sonner";
import { 
  fetchProject, 
  fetchMembers, 
  fetchTasks, 
  fetchDocument,
  updateProject,
  addMember,
  removeMember,
  addTask,
  updateTaskStatus,
  updateDocument 
} from "../api";

const Index = () => {
  const queryClient = useQueryClient();
  
  // Fetch project data
  const { 
    data: project, 
    isLoading: projectLoading 
  } = useQuery({ 
    queryKey: ['project'], 
    queryFn: () => fetchProject(1) 
  });
  
  // Fetch members data
  const { 
    data: members = [], 
    isLoading: membersLoading 
  } = useQuery({ 
    queryKey: ['members'], 
    queryFn: fetchMembers 
  });
  
  // Fetch tasks data
  const { 
    data: tasks = [], 
    isLoading: tasksLoading 
  } = useQuery({ 
    queryKey: ['tasks'], 
    queryFn: fetchTasks 
  });
  
  // Fetch document data
  const { 
    data: editorContent, 
    isLoading: documentLoading 
  } = useQuery({ 
    queryKey: ['document'], 
    queryFn: () => fetchDocument(1) 
  });
  
  // Project update mutation
  const projectMutation = useMutation({
    mutationFn: (updatedProject) => updateProject(updatedProject.id, updatedProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
      toast.success("Project details updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update project: ${error.message}`);
    }
  });
  
  // Member mutations
  const addMemberMutation = useMutation({
    mutationFn: (newMember) => addMember(newMember),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success(`${data.name} added to the team`);
    },
    onError: (error) => {
      toast.error(`Failed to add member: ${error.response?.data?.error || error.message}`);
    }
  });
  
  const removeMemberMutation = useMutation({
    mutationFn: (memberId) => removeMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success("Team member removed");
    },
    onError: (error) => {
      toast.error(`Failed to remove member: ${error.message}`);
    }
  });
  
  // Task mutations
  const addTaskMutation = useMutation({
    mutationFn: (newTask) => addTask(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("New task created");
    },
    onError: (error) => {
      toast.error(`Failed to create task: ${error.message}`);
    }
  });
  
  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskId, newStatus }) => updateTaskStatus(taskId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Task status updated");
    },
    onError: (error) => {
      toast.error(`Failed to update task: ${error.message}`);
    }
  });
  
  // Document mutation
  const updateDocumentMutation = useMutation({
    mutationFn: (content) => updateDocument(1, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document'] });
      toast.success("Document saved successfully");
    },
    onError: (error) => {
      toast.error(`Failed to save document: ${error.message}`);
    }
  });

  // Handler functions
  const handleProjectUpdate = (updatedProject) => {
    projectMutation.mutate({
      id: project.id,
      ...updatedProject
    });
  };

  const handleAddMember = (newMember) => {
    addMemberMutation.mutate(newMember);
  };

  const handleRemoveMember = (memberId) => {
    removeMemberMutation.mutate(memberId);
  };

  const handleAddTask = (newTask) => {
    addTaskMutation.mutate(newTask);
  };

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    updateTaskStatusMutation.mutate({ taskId, newStatus });
  };

  const handleSaveEditorContent = (content) => {
    updateDocumentMutation.mutate(content);
  };

  if (projectLoading || membersLoading || tasksLoading || documentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-3">Loading...</h2>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full mx-auto animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {project && <ProjectHeader project={project} onUpdate={handleProjectUpdate} />}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <MembersList 
              members={members} 
              onAddMember={handleAddMember} 
              onRemoveMember={handleRemoveMember} 
            />
          </div>
          <div className="md:col-span-2">
            <TasksList 
              tasks={tasks} 
              members={members}
              onAddTask={handleAddTask} 
              onUpdateTaskStatus={handleUpdateTaskStatus} 
            />
            {editorContent && (
              <CollaborativeEditor 
                initialContent={editorContent}
                onSave={handleSaveEditorContent} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
