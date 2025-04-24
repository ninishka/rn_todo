# Task Manager Mobile App

A React Native mobile application for managing tasks with features to create, view, edit, and track the status of tasks.

## Features

- **Add Tasks**: Create new tasks with title, description, date/time, and location
- **Manage Tasks**: View, edit, and delete tasks
- **Task Status**: Track task status (To Do, In Progress, Completed, Cancelled)
- **Sort Tasks**: Sort tasks by date or status
- **Local Storage**: All data is saved locally using AsyncStorage

## Technologies Used

- React Native
- Expo
- AsyncStorage for local data storage
- React Navigation for screen navigation

## Installation

1. Clone the repository:
```
git clone git@github.com:ninishka/rn_todo.git
cd rn_todo
```

2. Install dependencies:
```
npm install
```

3. Start the Expo development server:
```
npx expo start
```

4. Run on a device or emulator:
```
npm run android
# or
npm run ios
# or
npm run web
```

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── hooks/          # Custom React hooks
  ├── navigation/     # Navigation configuration
  ├── screens/        # App screens
  ├── services/       # Services for data handling
  └── utils/          # Utility functions and models
```

## App Workflow

1. **Home Screen (Task List)**
   - View all tasks
   - Sort tasks by date or status
   - Navigate to task details
   - Quick actions to change task status

2. **Task Detail Screen**
   - View detailed task information
   - Change task status
   - Edit or delete task

3. **Add Task Screen**
   - Create a new task with all required fields
   - Validation to ensure data integrity

4. **Edit Task Screen**
   - Modify any task details
   - Similar to add task screen but pre-filled with existing data
