
import React, { useState } from "react";
import ProjectHeader from "../components/ProjectHeader";
import MembersList from "../components/MembersList";
import TasksList from "../components/TasksList";
import CollaborativeEditor from "../components/CollaborativeEditor";
import { toast } from "sonner";

// Sample project data
const initialProject = {
  id: "proj-123",
  title: "CollabHive Project Hub",
  description: "A collaborative workspace for teams to manage projects, tasks, and share documents.",
  createdAt: "2025-04-01",
  updatedAt: "2025-04-03"
};

// Sample members data
const initialMembers = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    role: "Owner",
    avatar: null
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Editor",
    avatar: null
  },
  {
    id: "user-3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Viewer",
    avatar: null
  }
];

// Sample tasks data
const initialTasks = [
  {
    id: "task-1",
    title: "Setup project structure",
    description: "Create initial project structure and component hierarchy",
    status: "Completed",
    assignee: "user-1",
    dueDate: "2025-04-02",
    priority: "High"
  },
  {
    id: "task-2",
    title: "Design UI components",
    description: "Create designs for all the required UI components",
    status: "In Progress",
    assignee: "user-2",
    dueDate: "2025-04-10",
    priority: "Medium"
  },
  {
    id: "task-3",
    title: "Implement collaborative editor",
    description: "Add real-time collaboration features to the editor",
    status: "Todo",
    assignee: "",
    dueDate: "2025-04-15",
    priority: "High"
  }
];

// Sample editor content
const initialEditorContent = {
  text: "# Project Notes\n\nThis is a collaborative space for the team to share notes and ideas.\n\n## Goals\n- Create a user-friendly interface\n- Implement real-time collaboration\n- Integrate with existing systems\n\n## Resources\n- Design documents: [link]\n- API documentation: [link]",
  code: "// Example code\nfunction calculateProjectProgress(tasks) {\n  const completed = tasks.filter(task => task.status === 'Completed').length;\n  return (completed / tasks.length) * 100;\n}"
};

const Index = () => {
  const [project, setProject] = useState(initialProject);
  const [members, setMembers] = useState(initialMembers);
  const [tasks, setTasks] = useState(initialTasks);
  const [editorContent, setEditorContent] = useState(initialEditorContent);

  const handleProjectUpdate = (updatedProject) => {
    setProject(updatedProject);
    toast("Project details updated successfully");
  };

  const handleAddMember = (newMember) => {
    setMembers([...members, newMember]);
    toast(`${newMember.name} added to the team`);
  };

  const handleRemoveMember = (memberId) => {
    setMembers(members.filter(member => member.id !== memberId));
    toast("Team member removed");
  };

  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
    toast("New task created");
  };

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    toast("Task status updated");
  };

  const handleSaveEditorContent = (content) => {
    setEditorContent(content);
    toast("Document saved successfully");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <ProjectHeader project={project} onUpdate={handleProjectUpdate} />

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
            <CollaborativeEditor 
              initialContent={editorContent}
              onSave={handleSaveEditorContent} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
