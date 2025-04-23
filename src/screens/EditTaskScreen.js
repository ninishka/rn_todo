import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import useTasks from '../hooks/useTasks';
import WebDateTimePicker from '../components/WebDateTimePicker';
import { showAlert } from '../utils/webUtils';

const EditTaskScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const { tasks, editTask, loading, refreshTasks } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [initialTask, setInitialTask] = useState(null);

  useEffect(() => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setInitialTask(task);
      setTitle(task.title);
      setDescription(task.description || '');
      setLocation(task.location || '');
      setDate(new Date(task.dateTime));
    } else {
      const alertButtons = [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ];
      
      if (Platform.OS === 'web') {
        showAlert('Error', 'Task not found', alertButtons);
      } else {
        Alert.alert('Error', 'Task not found', alertButtons);
      }
    }
  }, [taskId, tasks, navigation]);

  const validateForm = () => {
    let newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS !== 'web');
  
    if (selectedDate) {
      const utcISOString = new Date(selectedDate).toISOString();
      setDate(utcISOString);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleString();
  };

  const handleUpdateTask = async () => {
    if (!validateForm() || !initialTask) return;

    const updatedTask = {
      ...initialTask,
      title,
      description,
      dateTime: date,
      location,
    };

    const success = await editTask(updatedTask);

    if (success) {
      const navigateBack = () => {
        setTimeout(() => {
          navigation.goBack();
        }, 300);
      };
      
      const alertButtons = [
        {
          text: 'OK',
          onPress: navigateBack,
        },
      ];
      
      if (Platform.OS === 'web') {
        showAlert('Success', 'Task updated successfully!', alertButtons);
      } else {
        Alert.alert('Success', 'Task updated successfully!', alertButtons);
      }
    } else {
      if (Platform.OS === 'web') {
        showAlert('Error', 'Failed to update task. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to update task. Please try again.');
      }
    }
  };

  if (!initialTask) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Edit Task</Text>

          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor="#999"
            />
            {errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter task description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Date Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date and Time</Text>
            {Platform.OS === 'web' ? (
              <WebDateTimePicker
                value={date}
                onChange={onDateChange}
                mode="datetime"
              />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.datePickerText}>{formatDate(date)}</Text>
                  <Ionicons name="calendar-outline" size={20} color="#007AFF" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="datetime"
                    display="default"
                    onChange={onDateChange}
                  />
                )}
              </>
            )}
          </View>

          {/* Location Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter location"
              placeholderTextColor="#999"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleUpdateTask}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.buttonText}>Update Task</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
  },
  datePickerButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default EditTaskScreen; 