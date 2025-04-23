import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTasks from '../hooks/useTasks';
import { TaskStatus } from '../utils/taskModel';
import { showAlert } from '../utils/webUtils';
import TaskCard from '../components/TaskCard';

const TaskDetailScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const { tasks, loading, changeTaskStatus, removeTask } = useTasks();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const foundTask = tasks.find((t) => t.id === taskId);
    setTask(foundTask);

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('EditTask', { taskId })}
          style={{ marginRight: 15 }}
        >
          <Ionicons name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      ),
    });
  }, [taskId, tasks, navigation]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleStatusChange = async (taskId, newStatus) => {
    await changeTaskStatus(taskId, newStatus);
  };

  const handleDelete = () => {
    const alertButtons = [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          const success = await removeTask(taskId);
          if (success) {
            navigation.goBack();
          }
        },
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

  if (loading || !task) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* Task Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{task.title}</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  task.status === TaskStatus.TODO
                    ? '#3498db'
                    : task.status === TaskStatus.IN_PROGRESS
                    ? '#f39c12'
                    : task.status === TaskStatus.COMPLETED
                    ? '#2ecc71'
                    : '#e74c3c',
              },
            ]}
          >
            <Text style={styles.statusText}>{task.status}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{task.description || 'No description provided'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date and Time</Text>
          <Text style={styles.detailText}>{formatDate(task.dateTime)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.detailText}>{task.location || 'No location set'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Created At</Text>
          <Text style={styles.detailText}>{formatDate(task.createdAt)}</Text>
        </View>

        {/* Task Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Change Status</Text>
          <TaskCard 
            task={task}
            onPress={() => {}} 
            onStatusChange={handleStatusChange}
            onDelete={() => handleDelete()}
            showActions={true}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', 
    backgroundImage: 'linear-gradient(120deg, #f0f8ff, #e6f2ff)',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
  actionsContainer: {
    marginVertical: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 10,
    minWidth: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default TaskDetailScreen; 