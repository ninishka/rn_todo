export const TaskStatus = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const generateTaskId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const createTask = (
  title = '',
  description = '',
  dateTime = new Date(),
  location = '',
  status = TaskStatus.TODO
) => {
  return {
    id: generateTaskId(),
    title,
    description,
    dateTime,
    location,
    status,
    createdAt: new Date(),
  };
}; 