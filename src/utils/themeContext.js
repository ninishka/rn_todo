import React, { createContext, useState, useContext, useEffect } from 'react';

export const themes = {
  light: {
    background: '#f5f5f5',
    backgroundGradient: 'linear-gradient(135deg, #f5f5f5, #e0e0e0)',
    card: 'white',
    text: '#333333',
    headerBg: 'white',
    accent: '#007AFF',
    tabInactive: '#888888',
    input: {
      bg: 'white',
      border: '#ddd',
      text: '#333333',
      placeholder: '#999'
    }
  },
  dark: {
    background: '#121212',
    backgroundGradient: 'linear-gradient(135deg, #121212, #2d2d2d)',
    card: '#1e1e1e',
    text: '#ffffff',
    headerBg: '#1e1e1e',
    accent: '#0a84ff',
    tabInactive: '#888888',
    input: {
      bg: '#2d2d2d',
      border: '#444',
      text: '#ffffff',
      placeholder: '#aaa'
    }
  },
  blue: {
    background: '#e6f2ff',
    backgroundGradient: 'linear-gradient(135deg, #e6f2ff, #c5e1ff)',
    card: 'white',
    text: '#333333',
    headerBg: '#f0f8ff',
    accent: '#007AFF',
    tabInactive: '#888888',
    input: {
      bg: 'white',
      border: '#c5e1ff',
      text: '#333333',
      placeholder: '#999'
    }
  },
  purple: {
    background: '#f0e7ff',
    backgroundGradient: 'linear-gradient(135deg, #f0e7ff, #d8c2ff)',
    card: 'white',
    text: '#333333',
    headerBg: '#f8f0ff',
    accent: '#8a3df9',
    tabInactive: '#888888',
    input: {
      bg: 'white',
      border: '#d8c2ff',
      text: '#333333',
      placeholder: '#999'
    }
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); 
  
  useEffect(() => {
    // Check if we're between 7PM and 6AM to set dark theme
    const hours = new Date().getHours();
    if (hours >= 19 || hours < 6) {
      setTheme('dark');
    }
  }, []);
  
  const toggleTheme = () => {
    const themeOrder = ['light', 'dark', 'blue', 'purple'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };
  
  const colors = themes[theme];
  
  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 