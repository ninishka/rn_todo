import React from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';

const WebDateTimePicker = ({ value, onChange, mode = 'datetime' }) => {
  if (Platform.OS !== 'web') {
    return null;
  }

  const handleChange = (e) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate)) {
      onChange({ nativeEvent: { timestamp: newDate.getTime() } }, newDate);
    }
  };

  const formatDateForInput = () => {
    if (!value) return '';
    
    const date = new Date(value);
    if (isNaN(date)) return '';
    
    if (mode === 'date') {
      return date.toISOString().split('T')[0];
    } else if (mode === 'time') {
      return date.toISOString().split('T')[1].slice(0, 5);
    } else {
      return date.toISOString().slice(0, 16);
    }
  };

  const inputType = mode === 'date' ? 'date' : 
                   mode === 'time' ? 'time' : 'datetime-local';

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        value={formatDateForInput()}
        onChange={handleChange}
        inputMode="none"
        type={inputType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: 'white',
  },
});

export default WebDateTimePicker; 