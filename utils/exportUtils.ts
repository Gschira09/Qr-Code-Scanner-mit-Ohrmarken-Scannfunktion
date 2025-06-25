import * as FileSystem from 'expo-file-system';
import { Platform, Share } from 'react-native';
import { ScannedItem } from '@/types';

// Generate a CSV file with the original scanned content
export const generateCSV = (items: ScannedItem[]): string => {
  // Sort items by type (QR codes first, then ear tags) and then by timestamp (newest first)
  const qrItems = items.filter(item => item.type === 'qr')
    .sort((a, b) => b.timestamp - a.timestamp);
  const earTagItems = items.filter(item => item.type !== 'qr')
    .sort((a, b) => b.timestamp - a.timestamp);
  
  const sortedItems = [...qrItems, ...earTagItems];
  
  // Simple CSV with just the ear tag numbers
  // No header row, just the values
  let csv = "";
  
  // Add each item as a row with just the content
  sortedItems.forEach(item => {
    // Use the original scanned content for export - no formatting
    let content = item.originalContent;
    
    // Replace "040" with "AT" if present
    content = content.replace(/^040/g, "AT");
    
    // Add the content as a plain text value (not a formula)
    csv += `${content}\r\n`;
  });
  
  return csv;
};

// Helper function to get readable type names
const getReadableTypeName = (type: string): string => {
  if (type === 'qr') return 'QR-Code';
  if (type.includes('code')) return type.toUpperCase();
  if (type.includes('ean')) return `EAN-${type.replace('ean', '')}`;
  if (type === 'upc_e') return 'UPC-E';
  if (type === 'datamatrix') return 'DataMatrix';
  if (type === 'pdf417') return 'PDF417';
  if (type === 'itf14') return 'ITF-14';
  return type.toUpperCase();
};

export const exportToCSV = async (items: ScannedItem[]): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') {
      // For web, create a CSV file and trigger a direct download
      return await downloadAsFile(items, 'csv');
    } else {
      // For mobile platforms
      const csv = generateCSV(items);
      const fileName = `ohrmarken_nummern_${Date.now()}.csv`;
      
      if (Platform.OS === 'android') {
        // On Android, try to save to Downloads folder using StorageAccessFramework
        try {
          // First, save to app's cache directory
          const tempFilePath = `${FileSystem.cacheDirectory}${fileName}`;
          await FileSystem.writeAsStringAsync(tempFilePath, csv, {
            encoding: FileSystem.EncodingType.UTF8
          });
          
          console.log(`Temporäre Datei geschrieben nach: ${tempFilePath}`);
          
          // Then use StorageAccessFramework to save to Downloads
          // This will prompt the user to select a location
          const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
          
          if (permissions.granted) {
            const downloadsDirUri = permissions.directoryUri;
            const destinationUri = await FileSystem.StorageAccessFramework.createFileAsync(
              downloadsDirUri,
              fileName,
              'text/csv'
            );
            
            // Read the temp file and write to the destination
            const fileContent = await FileSystem.readAsStringAsync(tempFilePath);
            await FileSystem.StorageAccessFramework.writeAsStringAsync(
              destinationUri,
              fileContent,
              { encoding: FileSystem.EncodingType.UTF8 }
            );
            
            console.log(`Datei erfolgreich in Downloads-Ordner gespeichert: ${destinationUri}`);
            
            // Clean up the temp file
            await FileSystem.deleteAsync(tempFilePath);
            
            return true;
          } else {
            console.log('Berechtigungen für Downloads-Ordner nicht erteilt');
            
            // Fall back to document directory
            const filePath = `${FileSystem.documentDirectory}${fileName}`;
            await FileSystem.writeAsStringAsync(filePath, csv, {
              encoding: FileSystem.EncodingType.UTF8
            });
            
            console.log(`Datei im Dokumentenordner gespeichert: ${filePath}`);
            return true;
          }
        } catch (error) {
          console.error('Fehler beim Speichern in Downloads-Ordner:', error);
          
          // Fall back to document directory
          const filePath = `${FileSystem.documentDirectory}${fileName}`;
          await FileSystem.writeAsStringAsync(filePath, csv, {
            encoding: FileSystem.EncodingType.UTF8
          });
          
          console.log(`Datei im Dokumentenordner gespeichert: ${filePath}`);
          return true;
        }
      } else {
        // For iOS, we can't directly save to Downloads due to sandbox restrictions
        // Save to document directory instead
        const filePath = `${FileSystem.documentDirectory}${fileName}`;
        
        console.log(`CSV-Datei wird geschrieben nach: ${filePath}`);
        
        // Write the CSV file
        await FileSystem.writeAsStringAsync(filePath, csv, {
          encoding: FileSystem.EncodingType.UTF8
        });
        
        console.log(`Datei erfolgreich geschrieben nach: ${filePath}`);
        
        return true;
      }
    }
  } catch (error) {
    console.error('Fehler beim Exportieren der Daten:', error);
    return false;
  }
};

// Function to download data as a file (for web)
export const downloadAsFile = async (items: ScannedItem[], fileType: 'csv'): Promise<boolean> => {
  try {
    if (Platform.OS !== 'web') {
      console.log('Direkter Download ist nur im Web verfügbar');
      return await exportToCSV(items);
    }
    
    const content = generateCSV(items);
    const mimeType = 'text/csv;charset=utf-8';
    const fileName = `ohrmarken_nummern_${Date.now()}.csv`;
    
    // Create a blob and download link
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    // Create a hidden link and click it programmatically to trigger download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error(`Fehler beim Herunterladen als CSV:`, error);
    return false;
  }
};