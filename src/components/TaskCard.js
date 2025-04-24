import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { TaskStatus } from '../utils/taskModel';
import { useTheme } from '../utils/themeContext';

const TaskCard = ({ task, onPress, onStatusChange, onDelete, showActions = false }) => {
  const { colors, theme } = useTheme();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case TaskStatus.TODO:
        return '#3498db';
      case TaskStatus.IN_PROGRESS:
        return '#f39c12';
      case TaskStatus.COMPLETED:
        return '#2ecc71';
      case TaskStatus.CANCELLED:
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const statusOptions = [
    { label: 'In Progress', value: TaskStatus.IN_PROGRESS, color: '#f39c12' },
    { label: 'Complete', value: TaskStatus.COMPLETED, color: '#2ecc71' },
    { label: 'Cancel', value: TaskStatus.CANCELLED, color: '#e74c3c' },
  ];

  return (
    <TouchableOpacity onPress={() => onPress(task)} style={styles.container}>
      <View style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            },
        ]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {task.title}
          </Text>
        </View>

        <Text style={[styles.date, { color: colors.tabInactive }]}>
          {formatDate(task.dateTime)}
        </Text>

        {!showActions && (
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
            <Text style={styles.statusText}>{task.status}</Text>
          </View>
        )}

        {showActions && (
          <View style={styles.actionsGroup}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.actionButton, { backgroundColor: option.color }]}
                onPress={() => onStatusChange(task.id, option.value)}
              >
                <Text style={styles.buttonText}>{option.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
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
    marginBottom: 12,
    elevation: 2,
  },
  card: {
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 4,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  header: {
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
  },
  actionsGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 10,
  },
  actionButton: {
    flexGrow: 1,
    flexBasis: '30%',
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#d63031',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default TaskCard;
