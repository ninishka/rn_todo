import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTasks from '../hooks/useTasks';
import { TaskStatus } from '../utils/taskModel';
import { showAlert } from '../utils/webUtils';
import TaskCard from '../components/TaskCard';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../utils/themeContext';

const TaskDetailScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const { tasks, loading, changeTaskStatus, removeTask, refreshTasks } = useTasks();
  const [task, setTask] = useState(null);
  const { theme, colors } = useTheme();

  useFocusEffect(
    useCallback(() => {
      refreshTasks();
    }, [])
  );

  useEffect(() => {
    const foundTask = tasks.find((t) => t.id === taskId);
    setTask(foundTask);

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('EditTask', { taskId })}
          style={{ marginRight: 15 }}
        >
          <Ionicons name="create-outline" size={24} color={colors.primary || '#007AFF'} />
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
      Alert.alert('Delete Task', 'Are you sure you want to delete this task?', alertButtons);
    }
  };

  if (loading || !task) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary || '#007AFF'} />
      </View>
    );
  }

  const dynamicCardStyle = {
    backgroundColor: colors.card,
    borderColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
    borderWidth: 4,
    shadowColor: theme === 'dark' ? '#000' : '#999',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  };

  const dynamicSectionStyle = {
    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    borderColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.05)',
    borderWidth: 4,
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, dynamicCardStyle]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{task.title}</Text>
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

        <View style={[styles.section, dynamicSectionStyle]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <Text style={[styles.description, { color: colors.text }]}>
            {task.description || 'No description provided'}
          </Text>
        </View>

        <View style={[styles.section, dynamicSectionStyle]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Date and Time</Text>
          <Text style={[styles.detailText, { color: colors.text }]}>{formatDate(task.dateTime)}</Text>
        </View>

        <View style={[styles.section, dynamicSectionStyle]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Location</Text>
          <Text style={[styles.detailText, { color: colors.text }]}>
            {task.location || 'No location set'}
          </Text>
        </View>

        <View style={[styles.section, dynamicSectionStyle]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Created At</Text>
          <Text style={[styles.detailText, { color: colors.text }]}>{formatDate(task.createdAt)}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Change Status</Text>
          <TaskCard
            task={task}
            onPress={() => {}}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
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
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 15,
    margin: 16,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
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
    padding: 12,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailText: {
    fontSize: 16,
  },
  actionsContainer: {
    marginVertical: 10,
  },
});

export default TaskDetailScreen;
