
import React, { useState, useMemo } from "react";
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
import { Plus, CheckCircle, Clock, Circle, Filter, SortDesc, Calendar } from "lucide-react";
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
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  const handleAddTask = () => {
    if (newTask.title) {
      const taskToAdd = {
        id: Date.now().toString(),
        ...newTask,
      };
      
      onAddTask(taskToAdd);
      toast.success("Task added successfully", {
        description: `"${newTask.title}" has been added to your tasks.`
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
  
  return (
    <Card className="shadow-md border-0 mb-5">
      <CardHeader className="bg-gray-50 rounded-t-lg border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-800">Tasks</CardTitle>
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
                      {task.dueDate && (
                        <div className="flex-none">{formatDueDate(task.dueDate)}</div>
                      )}
                      <div className="ml-auto">{renderPriorityBadge(task.priority)}</div>
                    </div>
                  </div>
                  
                  <Select
                    value={task.status}
                    onValueChange={(value) => {
                      onUpdateTaskStatus(task.id, value);
                      toast.success(`Task status updated to ${value}`);
                    }}
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
    </Card>
  );
};

export default TasksList;
