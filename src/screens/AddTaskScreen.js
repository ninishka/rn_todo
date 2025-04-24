import React from 'react';
import TaskFormScreen from './TaskFormScreen';
import useTasks from '../hooks/useTasks';
import { createTask } from '../utils/taskModel';

const AddTaskScreen = ({ navigation }) => {
  const { addTask, loading } = useTasks();

  const handleAdd = taskData => addTask(createTask(
    taskData.title, taskData.description, taskData.dateTime, taskData.location
  ));

  return (
    <TaskFormScreen
      mode="add"
      onSubmit={handleAdd}
      loading={loading}
      navigation={navigation}
    />
  );
};

export default AddTaskScreen;