import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { TaskStatus } from '../utils/taskModel';
import { useTheme } from '../utils/themeContext';

// Component to display a task card in the list
const TaskCard = ({ task, onPress, onStatusChange, onDelete, showActions = false }) => {
  const { colors } = useTheme();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case TaskStatus.TODO:
        return '#3498db'; // Blue
      case TaskStatus.IN_PROGRESS:
        return '#f39c12'; // Orange
      case TaskStatus.COMPLETED:
        return '#2ecc71'; // Green
      case TaskStatus.CANCELLED:
        return '#e74c3c'; // Red
      default:
        return '#95a5a6'; // Gray
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress(task)} style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {task.title}
        </Text>
      </View>

      <Text style={[styles.date, { color: colors.tabInactive }]}>{formatDate(task.dateTime)}</Text>

      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
        <Text style={styles.statusText}>{task.status}</Text>
      </View>

        {showActions && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#3498db' }]}
              onPress={() => onStatusChange(task.id, TaskStatus.IN_PROGRESS)}
            >
              <Text style={styles.buttonText}>In Progress</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#2ecc71' }]}
              onPress={() => onStatusChange(task.id, TaskStatus.COMPLETED)}
            >
              <Text style={styles.buttonText}>Complete</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#e74c3c' }]}
              onPress={() => onStatusChange(task.id, TaskStatus.CANCELLED)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#777' }]}
              onPress={() => onDelete(task.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}

        {!showActions && (
          <View style={styles.actionsSimple}>
            <TouchableOpacity
              style={[styles.buttonDelete, { backgroundColor: '#e74c3c' }]}
              onPress={() => onDelete(task.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    borderRadius: 8,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
    marginTop: 4,
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  date: {
    fontSize: 14,
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionsSimple: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 5,
    marginBottom: 5,
    minWidth: '22%',
  },
  buttonDelete: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default TaskCard; 