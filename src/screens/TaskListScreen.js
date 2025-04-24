import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskCard from '../components/TaskCard';
import useTasks from '../hooks/useTasks';
import { showAlert } from '../utils/webUtils';
import { useTheme } from '../utils/themeContext';
import { useFocusEffect } from '@react-navigation/native';

const TaskListScreen = ({ navigation }) => {
  const {
    tasks,
    loading,
    error,
    removeTask,
    changeTaskStatus,
    sortTasks,
    refreshTasks,
  } = useTasks();
  
  const [sortBy, setSortBy] = useState('date');
  const { theme, colors, toggleTheme } = useTheme();

  useFocusEffect(
    useCallback(() => {
      refreshTasks();
    }, [])
  );
  
  const handleSort = (newSortBy) => {
    setSortBy(newSortBy);
    sortTasks(newSortBy);
  };

  const handleViewTask = (task) => {
    navigation.navigate('TaskDetail', { taskId: task.id });
  };

  const handleDeleteTask = (taskId) => {
    const alertButtons = [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => removeTask(taskId),
        style: 'destructive',
      },
    ];
    
    if (Platform.OS === 'web') {
      showAlert('Delete Task', 'Are you sure you want to delete this task?', alertButtons);
    } else {
      Alert.alert(
        'Delete Task',
        'Are you sure you want to delete this task?',
        alertButtons
      );
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    changeTaskStatus(taskId, newStatus);
  };

  const renderEmptyList = () => (
    <View style={[styles.emptyContainer, {backgroundColor: colors.card}]}>
      <Text style={[styles.emptyText, {color: colors.text}]}>No tasks yet</Text>
      <Text style={[styles.emptySubtext, {color: '#888'}]}>
        Tap the + button to create your first task
      </Text>
    </View>
  );

  if (error) {
    return (
      <View style={[styles.centered, {backgroundColor: colors.background}]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshTasks}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const backgroundStyle = Platform.OS === 'web' 
    ? { backgroundColor: colors.background, backgroundImage: colors.backgroundGradient }
    : { backgroundColor: colors.background };

  return (
    <View style={[styles.container, backgroundStyle]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <View style={[styles.header, {backgroundColor: colors.headerBg}]}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, {color: colors.text}]}>My Tasks</Text>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <Ionicons 
              name={theme === 'dark' ? 'sunny' : 'moon'} 
              size={24} 
              color={colors.accent} 
            />
          </TouchableOpacity>
        </View>
        <View style={styles.sortButtons}>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'date' && [styles.activeSortButton, {backgroundColor: colors.accent}],
              {backgroundColor: sortBy !== 'date' ? '#f0f0f0' : colors.accent}
            ]}
            onPress={() => handleSort('date')}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'date' && styles.activeSortButtonText,
                {color: sortBy === 'date' ? 'white' : colors.tabInactive}
              ]}
            >
              By Date
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'status' && [styles.activeSortButton, {backgroundColor: colors.accent}],
              {backgroundColor: sortBy !== 'status' ? '#f0f0f0' : colors.accent}
            ]}
            onPress={() => handleSort('status')}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'status' && styles.activeSortButtonText,
                {color: sortBy === 'status' ? 'white' : colors.tabInactive}
              ]}
            >
              By Status
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onPress={handleViewTask}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteTask}
              showActions={false}
            />
          )}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyList}
        />
      )}

      <TouchableOpacity
        style={[styles.addButton, {backgroundColor: colors.accent}]}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  themeToggle: {
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  sortButtons: {
    flexDirection: 'row',
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  activeSortButton: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  sortButtonText: {
    fontSize: 14,
  },
  activeSortButtonText: {
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, 
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default TaskListScreen; 