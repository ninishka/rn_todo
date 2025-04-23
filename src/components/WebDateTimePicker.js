import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

const WebDateTimePicker = ({ value, onChange, mode = 'datetime' }) => {
  if (Platform.OS !== 'web') {
    return null;
  }
  function toLocalISOString(date) {
    const offsetMs = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
    return localISOTime;
  }

  const handleChange = (e) => {
    const localDate = new Date(e.target.value); // Local time input
    if (!isNaN(localDate)) {
      const utcISOString = localDate.toISOString(); 
      onChange({ nativeEvent: { timestamp: localDate.getTime() } }, utcISOString);
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
      <input
        style={styles.input}
        type={inputType}
        value={value ? toLocalISOString(new Date(value)) : ''}
        onChange={handleChange}
      />
    </View>
  );
};

const styles = {
  container: {
    width: '100%',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: '0 10px',
    margin: '10px 0',
    backgroundColor: 'white',
    fontSize: 16,
    width: '100%',
    boxSizing: 'border-box',
  },
};

export default WebDateTimePicker;
