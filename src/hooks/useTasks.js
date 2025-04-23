import { useState, useEffect } from 'react';
import { getTasks, saveTask, updateTask, deleteTask } from '../services/taskService';
import { TaskStatus } from '../utils/taskModel';

//IN THIS COMPONENT I:
// Load tasks on component mount
// Add a new task
// Update an existing task
// Change task status
// Remove a task
// Sort tasks by creation date or status


export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const loadedTasks = await getTasks();
      setTasks(loadedTasks);
      setError(null);
    } catch (e) {
      setError('Failed to load tasks');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task) => {
    try {
      setLoading(true);
      const updatedTasks = await saveTask(task);
      if (updatedTasks) {
        setTasks(updatedTasks);
        return true;
      }
      return false;
    } catch (e) {
      setError('Failed to add task');
      console.error(e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const editTask = async (updatedTask) => {
    try {
      setLoading(true);
      const updatedTasks = await updateTask(updatedTask);
      if (updatedTasks) {
        setTasks(updatedTasks);
        return true;
      }
      return false;
    } catch (e) {
      setError('Failed to update task');
      console.error(e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changeTaskStatus = async (taskId, newStatus) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return false;
    
    const updatedTask = { ...taskToUpdate, status: newStatus };
    return await editTask(updatedTask);
  };

  const removeTask = async (taskId) => {
    try {
      setLoading(true);
      const updatedTasks = await deleteTask(taskId);
      if (updatedTasks) {
        setTasks(updatedTasks);
        return true;
      }
      return false;
    } catch (e) {
      setError('Failed to delete task');
      console.error(e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sortTasks = (sortBy = 'date') => {
    let sortedTasks = [...tasks];
    
    if (sortBy === 'date') {
      sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'status') {
      const statusOrder = {
        [TaskStatus.IN_PROGRESS]: 1,
        [TaskStatus.TODO]: 2,
        [TaskStatus.COMPLETED]: 3,
        [TaskStatus.CANCELLED]: 4,
      };
      
      sortedTasks.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }
    
    setTasks(sortedTasks);
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    editTask,
    removeTask,
    changeTaskStatus,
    sortTasks,
    refreshTasks: loadTasks,
  };
} 