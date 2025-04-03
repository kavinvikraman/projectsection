import React, { useState, useMemo, useRef } from "react";
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
import { Plus, CheckCircle, Clock, Circle, Filter, SortDesc, Calendar, FileEdit, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

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

const TasksList = ({ 
  tasks, 
  members, 
  onAddTask, 
  onUpdateTaskStatus, 
  currentUser = {}, 
  userRole = "viewer" 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "Todo",
    assignee: "unassigned", // Change from empty string to "unassigned"
    dueDate: "",
    priority: "Medium",
    owner: currentUser?.id || "", // Set default owner to current user
    htmlFile: null, // Add this line
    htmlFileName: ""  // Add this line
  });
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if it's an HTML file
    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
      toast.error("Invalid file type", {
        description: "Please select an HTML file"
      });
      return;
    }
    
    setNewTask(prev => ({ 
      ...prev, 
      htmlFile: file,
      htmlFileName: file.name
    }));
    
    toast.success("HTML file selected", {
      description: `"${file.name}" will be attached to this task.`
    });
  };

  const handleAddTask = (e) => {
    if (e) e.preventDefault();
    
    if (newTask.title) {
      // Log what's happening
      console.log("Form values:", newTask);
      console.log("Assignee before processing:", newTask.assignee);
      
      const taskToAdd = {
        id: Date.now().toString(),
        ...newTask,
        // Convert "unassigned" to empty string if needed by your backend
        assignee: newTask.assignee === "unassigned" ? "" : newTask.assignee,
        owner: newTask.owner || currentUser?.id || "", // Ensure owner is set
      };
      
      console.log("Task being sent to backend:", taskToAdd);
      
      // If there's an HTML file, we need to upload it first
      if (newTask.htmlFile) {
        // In a real application, you'd upload the file to your server
        // For now, we'll just simulate this
        console.log("Would upload HTML file:", newTask.htmlFile);
        
        // You would use code like this:
        // const formData = new FormData();
        // formData.append('file', newTask.htmlFile);
        // const response = await fetch('/api/upload-html', {
        //   method: 'POST',
        //   body: formData
        // });
        // const data = await response.json();
        // taskToAdd.htmlFileId = data.fileId;
      }
      
      onAddTask(taskToAdd);
      toast.success("Task added successfully", {
        description: `"${newTask.title}" has been added to your tasks.`
      });
      
      // Add specific toast for assignment
      if (taskToAdd.assignee) {
        const assigneeName = getAssigneeName(taskToAdd.assignee);
        toast.success(`Task assigned to ${assigneeName}`, {
          description: `"${newTask.title}" has been assigned with ${newTask.htmlFileName ? 'an HTML file' : 'no HTML file'}.`
        });
      }
      
      setNewTask({
        title: "",
        description: "",
        status: "Todo",
        assignee: "unassigned",
        dueDate: "",
        priority: "Medium",
        owner: currentUser?.id || "",
        htmlFile: null,
        htmlFileName: ""
      });
      setIsDialogOpen(false);
    } else {
      toast.error("Task title is required");
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
    if (!assigneeId || assigneeId === "unassigned") return "Unassigned";
    const member = members.find((m) => m.id === assigneeId);
    return member ? member.name : "Unassigned";
  };

  const formatDueDate = (date) => {
    if (!date) return null;
    
    const taskDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const oneWeek = new Date(today);
    oneWeek.setDate(oneWeek.getDate() + 7);
    
    if (taskDate < today) {
      return (
        <span className="text-xs text-red-500 font-medium flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          Overdue: {taskDate.toLocaleDateString()}
        </span>
      );
    } else if (taskDate.toDateString() === today.toDateString()) {
      return (
        <span className="text-xs text-orange-500 font-medium flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          Due today
        </span>
      );
    } else if (taskDate.toDateString() === tomorrow.toDateString()) {
      return (
        <span className="text-xs text-yellow-500 font-medium flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          Due tomorrow
        </span>
      );
    } else if (taskDate <= oneWeek) {
      return (
        <span className="text-xs text-blue-500 font-medium flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          Due this week: {taskDate.toLocaleDateString()}
        </span>
      );
    }
    
    return (
      <span className="text-xs text-gray-500 flex items-center">
        <Calendar className="h-3 w-3 mr-1" />
        Due: {taskDate.toLocaleDateString()}
      </span>
    );
  };

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    
    // Apply filters
    if (filterBy !== "all") {
      if (filterBy === "completed") {
        result = result.filter(task => task.status === "Completed");
      } else if (filterBy === "inprogress") {
        result = result.filter(task => task.status === "In Progress");
      } else if (filterBy === "todo") {
        result = result.filter(task => task.status === "Todo");
      } else if (filterBy === "high") {
        result = result.filter(task => task.priority === "High");
      }
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "dueDate") {
        // Sort by due date (ascending)
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === "priority") {
        // Sort by priority (high to low)
        const priorityValues = { High: 3, Medium: 2, Low: 1 };
        return priorityValues[b.priority] - priorityValues[a.priority];
      } else if (sortBy === "title") {
        // Sort by title (A-Z)
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
    
    return result;
  }, [tasks, filterBy, sortBy]);

  const getFilterCount = (filter) => {
    if (filter === "all") return tasks.length;
    if (filter === "completed") return tasks.filter(t => t.status === "Completed").length;
    if (filter === "inprogress") return tasks.filter(t => t.status === "In Progress").length;
    if (filter === "todo") return tasks.filter(t => t.status === "Todo").length;
    if (filter === "high") return tasks.filter(t => t.priority === "High").length;
    return 0;
  };
  
  // Add this check for the Add Task button visibility
  const canAddTask = userRole === "admin" || userRole === "editor";
  
  return (
    <Card className="shadow-md border-0 mb-5">
      <CardHeader className="bg-gray-50 rounded-t-lg border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-800">Tasks</CardTitle>
          {/* Fixed button to prevent form submission */}
          <Button 
            size="sm" 
            type="button" 
            onClick={(e) => {
              e.preventDefault();
              setIsDialogOpen(true);
              console.log("Opening dialog");
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <Tabs 
              value={filterBy}
              onValueChange={setFilterBy}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="all">
                  All ({getFilterCount("all")})
                </TabsTrigger>
                <TabsTrigger value="todo">
                  To Do ({getFilterCount("todo")})
                </TabsTrigger>
                <TabsTrigger value="inprogress">
                  In Progress ({getFilterCount("inprogress")})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({getFilterCount("completed")})
                </TabsTrigger>
                <TabsTrigger value="high">
                  High Priority ({getFilterCount("high")})
                </TabsTrigger>
                </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2">
              <SortDesc className="h-4 w-4 text-gray-500" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] h-8 text-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Sort by Due Date</SelectItem>
                  <SelectItem value="priority">Sort by Priority</SelectItem>
                  <SelectItem value="title">Sort by Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
              <div className="flex flex-col items-center justify-center">
                <Filter className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm">No tasks match your current filters</p>
                <Button 
                  variant="link" 
                  className="mt-1" 
                  onClick={() => {
                    setFilterBy("all");
                    setSortBy("dueDate");
                  }}
                >
                  Reset filters
                </Button>
              </div>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`border-l-4 ${getStatusColor(task.status)} bg-white shadow-sm hover:shadow-md transition-shadow p-4 rounded-md border border-l-[6px]`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(task.status)}
                      <h3 className="font-medium text-gray-800">{task.title}</h3>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 mt-3 items-center text-sm">
                      <span className="text-xs flex items-center text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        Assigned to: {getAssigneeName(task.assignee)}
                      </span>
                      {task.owner && (
                        <span className="text-xs flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          Owner: {getAssigneeName(task.owner)}
                        </span>
                      )}
                      {task.dueDate && (
                        <div className="flex-none">{formatDueDate(task.dueDate)}</div>
                      )}
                      <div className="ml-auto">{renderPriorityBadge(task.priority)}</div>
                    </div>
                    {task.htmlFileName && (
                      <div className="mt-2 flex items-center px-2 py-1 bg-blue-50 rounded text-xs text-blue-600">
                        <FileEdit className="h-3 w-3 mr-1" />
                        <span>HTML File: {task.htmlFileName}</span>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="ml-2 h-5 p-0 text-xs"
                          onClick={() => {
                            // In a real app, this would open the file in your editor
                            // For now, we'll just show a toast
                            toast.info(`Opening ${task.htmlFileName} in editor`);
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <Select
                    value={task.status}
                    onValueChange={(value) => {
                      onUpdateTaskStatus(task.id, value);
                      toast.success(`Task status updated to ${value}`);
                    }}
                    disabled={!(currentUser?.role === 'admin' || currentUser?.id === task.owner || currentUser?.id === task.assignee)}
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
            ))
          )}
        </div>
      </CardContent>
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => {
          // Close when clicking outside the modal
          if (e.target === e.currentTarget) {
            setIsDialogOpen(false);
          }
        }}>
          <div className="bg-white p-6 rounded-lg w-[500px] max-w-[95%] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Create New Task</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsDialogOpen(false)}
                className="h-8 w-8 p-0 rounded-full"
              >
                ✕
              </Button>
            </div>
            
            {/* Title field - this was missing from your form */}
            <div className="space-y-2 mb-4">
              <label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter task title"
              />
            </div>
            
            {/* Description field - this was missing from your form */}
            <div className="space-y-2 mb-4">
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
            
            {/* Due date field - this was missing from your form */}
            <div className="space-y-2 mb-4">
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
            
            {/* Priority field - this was missing from your form */}
            <div className="space-y-2 mb-4">
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
            
            {/* Assignee field */}
            <div className="space-y-2 mb-4">
              <label htmlFor="assignee" className="text-sm font-medium">
                Assign Task To
              </label>
              <Select
                value={newTask.assignee}
                onValueChange={(value) => handleChange("assignee", value)}
              >
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                The person responsible for completing this task
              </p>
            </div>
            
            {/* Owner field */}
            <div className="space-y-2 mb-4">
              <label htmlFor="owner" className="text-sm font-medium">
                Task Owner
              </label>
              <Select
                value={newTask.owner || currentUser?.id}
                onValueChange={(value) => handleChange("owner", value)}
              >
                <SelectTrigger id="owner">
                  <SelectValue placeholder="Select task owner" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}{member.id === currentUser?.id ? " (You)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                The person who created this task (defaults to you)
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium">
                Attach HTML File
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".html,.htm"
                />
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  {newTask.htmlFileName ? "Change File" : "Select HTML File"}
                </Button>
                {newTask.htmlFileName && (
                  <span className="ml-2 text-sm text-gray-600">
                    {newTask.htmlFileName}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Attach an HTML file that needs to be edited as part of this task
              </p>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddTask();
                }}
              >
                Create Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TasksList;
