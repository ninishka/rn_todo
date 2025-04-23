import { Platform } from 'react-native';

export const showAlert = (title, message, buttons = [{ text: 'OK' }]) => {
  if (Platform.OS === 'web') {
    if (buttons.length === 1 && buttons[0].text === 'OK') {

      window.alert(`${title}\n\n${message}`);
      if (buttons[0].onPress) {
        buttons[0].onPress();
      }
    } else if (buttons.length === 2 && 
              (buttons[0].style === 'cancel' || buttons[1].style === 'destructive')) {
                
      const confirmResult = window.confirm(`${title}\n\n${message}`);
      
      if (confirmResult && buttons[1] && buttons[1].onPress) {

        buttons[1].onPress();
      } else if (!confirmResult && buttons[0] && buttons[0].onPress) {

        buttons[0].onPress();
      }
    } else {

      window.alert(`${title}\n\n${message}`);

      const actionButton = buttons.find(btn => btn.style !== 'cancel');
      if (actionButton && actionButton.onPress) {
        actionButton.onPress();
      }
    }
  }

}; 