import React from 'react';
import TaskFormScreen from './TaskFormScreen';
import useTasks from '../hooks/useTasks';

const EditTaskScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const { tasks, editTask, loading } = useTasks();
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return null; 
  }

  return (
    <TaskFormScreen
      mode="edit"
      initialTask={task}
      onSubmit={editTask}
      loading={loading}
      navigation={navigation}
    />
  );
};

export default EditTaskScreen;
