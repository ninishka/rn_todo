import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTask } from '../utils/taskModel';

const STORAGE_KEY = '@tasks';

export const getTasks = async () => {
  try {
    const tasksJSON = await AsyncStorage.getItem(STORAGE_KEY);
    return tasksJSON ? JSON.parse(tasksJSON) : [];
  } catch (error) {
    console.error('Error loading tasks: ', error);
    return [];
  }
};

export const saveTask = async (task) => {
  try {
    const tasks = await getTasks();
    const newTasks = [...tasks, task];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    return newTasks;
  } catch (error) {
    console.error('Error saving task: ', error);
    return null;
  }
};

export const updateTask = async (updatedTask) => {
  try {
    const tasks = await getTasks();
    const updatedTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    return updatedTasks;
  } catch (error) {
    console.error('Error updating task: ', error);
    return null;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const tasks = await getTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));
    return filteredTasks;
  } catch (error) {
    console.error('Error deleting task: ', error);
    return null;
  }
}; 