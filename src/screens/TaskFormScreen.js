import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, SafeAreaView, StatusBar
} from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useTheme } from '../utils/themeContext';

const TaskFormScreen = ({ mode = 'add', initialTask = null, onSubmit, loading, navigation }) => {
  const { theme, colors } = useTheme(); 
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [location, setLocation] = useState(initialTask?.location || '');
  const [date, setDate] = useState(initialTask?.dateTime ? new Date(initialTask.dateTime) : new Date());
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const taskPayload = {
      ...(initialTask || {}),
      title,
      description,
      location,
      dateTime: date,
    };

    const success = await onSubmit(taskPayload);

    if (success) {
      Alert.alert('Success', `Task ${mode === 'edit' ? 'updated' : 'created'} successfully!`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      const errorMessage = `Failed to ${mode === 'edit' ? 'update' : 'create'} task. Please try again.`;
      Alert.alert('Error', errorMessage);
    }
  };

  const showMode = currentMode => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (_, selectedDate) => selectedDate && setDate(selectedDate),
      mode: currentMode,
      is24Hour: false, 
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{mode === 'edit' ? 'Edit Task' : 'Add New Task'}</Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Title *</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError, { color: colors.text, backgroundColor: colors.card }]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor={colors.tabInactive}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, { color: colors.text, backgroundColor: colors.card }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor={colors.tabInactive}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Date and Time</Text>

            <SafeAreaView style={styles.datePickerContainer}>
              <TouchableOpacity
                onPress={() => showMode('date')}
                style={[styles.dateTimeButton, { backgroundColor: colors.card }]}
              >
                <Text style={[styles.dateTimeButtonText, { color: colors.text }]}>Pick Date</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => showMode('time')}
                style={[styles.dateTimeButton, { backgroundColor: colors.card }]}
              >
                <Text style={[styles.dateTimeButtonText, { color: colors.text }]}>Pick Time</Text>
              </TouchableOpacity>

              <Text style={[styles.selectedDate, { color: colors.text }]}>
                Selected: {date.toLocaleString()}
              </Text>
            </SafeAreaView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Location</Text>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.card }]}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter location"
              placeholderTextColor={colors.tabInactive}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.accent }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>{mode === 'edit' ? 'Update Task' : 'Create Task'}</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flex: 1 },
  formContainer: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  inputError: { borderColor: '#e74c3c' },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  errorText: { color: '#e74c3c', fontSize: 14, marginTop: 5 },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  dateTimeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateTimeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerContainer: { marginTop: 10 },
  selectedDate: { marginTop: 10, fontSize: 14 },
});

export default TaskFormScreen;
