
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Projects API
export const fetchProject = async (projectId = 1) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};

export const updateProject = async (projectId, projectData) => {
  const response = await api.put(`/projects/${projectId}`, projectData);
  return response.data;
};

// Members API
export const fetchMembers = async () => {
  const response = await api.get('/members');
  return response.data;
};

export const addMember = async (memberData) => {
  const response = await api.post('/members', memberData);
  return response.data;
};

export const removeMember = async (memberId) => {
  const response = await api.delete(`/members/${memberId}`);
  return response.data;
};

// Tasks API
export const fetchTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

export const addTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await api.put(`/tasks/${taskId}`, { status });
  return response.data;
};

// Document API
export const fetchDocument = async (projectId = 1) => {
  const response = await api.get(`/documents/${projectId}`);
  return response.data;
};

export const updateDocument = async (projectId, documentData) => {
  const response = await api.put(`/documents/${projectId}`, documentData);
  return response.data;
};

export default api;
