import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Button, SafeAreaView
} from 'react-native';
import WebDateTimePicker from '../components/WebDateTimePicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { showAlert } from '../utils/webUtils';

const TaskFormScreen = ({ mode = 'add', initialTask = null, onSubmit, loading, navigation }) => {
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
      if (Platform.OS === 'web') {
        showAlert('Success', `Task ${mode === 'edit' ? 'updated' : 'created'} successfully!`, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Success', `Task ${mode === 'edit' ? 'updated' : 'created'} successfully!`, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } else {
      const errorMessage = `Failed to ${mode === 'edit' ? 'update' : 'create'} task. Please try again.`;
      if (Platform.OS === 'web') {
        showAlert('Error', errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
    }
  };

  const showMode = currentMode => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (_, selectedDate) => selectedDate && setDate(selectedDate),
      mode: currentMode,
      is24Hour: true,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>{mode === 'edit' ? 'Edit Task' : 'Add New Task'}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date and Time</Text>
            {Platform.OS === 'web' ? (
              <WebDateTimePicker value={date} onChange={(_, selected) => selected && setDate(selected)} mode="datetime" />
            ) : (
              <SafeAreaView>
                <Button onPress={() => showMode('date')} title="Pick Date" />
                <Button onPress={() => showMode('time')} title="Pick Time" />
                <Text>Selected: {date.toLocaleString()}</Text>
              </SafeAreaView>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter location"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>{mode === 'edit' ? 'Update Task' : 'Create Task'}</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContainer: { flex: 1 },
  formContainer: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: 'white',
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
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
});

export default TaskFormScreen;
