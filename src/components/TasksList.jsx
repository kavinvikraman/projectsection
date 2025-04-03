
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, CheckCircle, Clock, Circle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const getStatusIcon = (status) => {
  switch (status) {
    case "Todo":
      return <Circle className="h-4 w-4 text-task-todo" />;
    case "In Progress":
      return <Clock className="h-4 w-4 text-task-progress" />;
    case "Completed":
      return <CheckCircle className="h-4 w-4 text-task-completed" />;
    default:
      return <Circle className="h-4 w-4" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "Todo":
      return "border-l-task-todo";
    case "In Progress":
      return "border-l-task-progress";
    case "Completed":
      return "border-l-task-completed";
    default:
      return "border-l-gray-300";
  }
};

const TasksList = ({ tasks, members, onAddTask, onUpdateTaskStatus }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "Todo",
    assignee: "",
    dueDate: "",
    priority: "Medium",
  });

  const handleAddTask = () => {
    if (newTask.title) {
      onAddTask({
        id: Date.now().toString(),
        ...newTask,
      });
      setNewTask({
        title: "",
        description: "",
        status: "Todo",
        assignee: "",
        dueDate: "",
        priority: "Medium",
      });
      setIsDialogOpen(false);
    }
  };

  const handleChange = (field, value) => {
    setNewTask((prev) => ({ ...prev, [field]: value }));
  };

  const renderPriorityBadge = (priority) => {
    const colors = {
      High: "bg-red-500",
      Medium: "bg-yellow-500",
      Low: "bg-green-500",
    };
    
    return (
      <Badge className={`${colors[priority] || "bg-gray-500"} text-white`}>
        {priority}
      </Badge>
    );
  };

  const getAssigneeName = (assigneeId) => {
    const member = members.find((m) => m.id === assigneeId);
    return member ? member.name : "Unassigned";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Tasks</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Task Title
                </label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter task title"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select
                    value={newTask.status}
                    onValueChange={(value) => handleChange("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todo">To Do</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="assignee" className="text-sm font-medium">
                    Assignee
                  </label>
                  <Select
                    value={newTask.assignee}
                    onValueChange={(value) => handleChange("assignee", value)}
                  >
                    <SelectTrigger id="assignee">
                      <SelectValue placeholder="Assign to..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="dueDate" className="text-sm font-medium">
                    Due Date
                  </label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => handleChange("dueDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium">
                    Priority
                  </label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => handleChange("priority", value)}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`border-l-4 ${getStatusColor(
              task.status
            )} bg-gray-50 p-4 rounded-md`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(task.status)}
                  <h3 className="font-medium text-gray-800">{task.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs text-gray-500">
                    Assigned to: {getAssigneeName(task.assignee)}
                  </span>
                  {task.dueDate && (
                    <span className="text-xs text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {renderPriorityBadge(task.priority)}
                </div>
              </div>
              <Select
                value={task.status}
                onValueChange={(value) => onUpdateTaskStatus(task.id, value)}
              >
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="Update status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todo">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No tasks yet. Click "Add Task" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksList;
