import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

// This function is just a placeholder to reference the large data file
// so it gets bundled with the app
export const initLargeData = async () => {
  if (Platform.OS !== 'web') {
    try {
      // Check if the large data file exists in the app bundle
      const fileInfo = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + 'large-data.json'
      );
      
      console.log('Large data file initialized');
      return true;
    } catch (error) {
      console.error('Error initializing large data:', error);
      return false;
    }
  }
  return false;
};