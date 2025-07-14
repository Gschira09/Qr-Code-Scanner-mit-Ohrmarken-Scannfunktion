import * as FileSystem from 'expo-file-system';
import { Platform, Share } from 'react-native';
import { ScannedItem } from '@/types';

// Country code mapping for animal ear tags
// Format: numeric prefix -> ISO country code
const COUNTRY_PREFIXES = {
  // European Union countries
  '040': 'AT', // Austria
  '056': 'BE', // Belgium
  '100': 'BG', // Bulgaria
  '191': 'HR', // Croatia
  '196': 'CY', // Cyprus
  '203': 'CZ', // Czech Republic
  '208': 'DK', // Denmark
  '233': 'EE', // Estonia
  '246': 'FI', // Finland
  '250': 'FR', // France
  '276': 'DE', // Germany
  '300': 'GR', // Greece
  '348': 'HU', // Hungary
  '372': 'IE', // Ireland
  '380': 'IT', // Italy
  '428': 'LV', // Latvia
  '440': 'LT', // Lithuania
  '442': 'LU', // Luxembourg
  '470': 'MT', // Malta
  '528': 'NL', // Netherlands
  '616': 'PL', // Poland
  '620': 'PT', // Portugal
  '642': 'RO', // Romania
  '703': 'SK', // Slovakia
  '705': 'SI', // Slovenia
  '724': 'ES', // Spain
  '752': 'SE', // Sweden
  
  // Non-EU European countries
  '756': 'CH', // Switzerland
  '826': 'GB', // United Kingdom
  '578': 'NO', // Norway
  '352': 'IS', // Iceland
  '643': 'RU', // Russia
  '804': 'UA', // Ukraine
  '807': 'MK', // North Macedonia
  '688': 'RS', // Serbia
  '499': 'ME', // Montenegro
  '070': 'BA', // Bosnia and Herzegovina
  '008': 'AL', // Albania
  
  // Americas
  '124': 'CA', // Canada
  '840': 'US', // United States
  '484': 'MX', // Mexico
  '076': 'BR', // Brazil
  '032': 'AR', // Argentina
  '152': 'CL', // Chile
  '170': 'CO', // Colombia
  '604': 'PE', // Peru
  
  // Asia & Oceania
  '036': 'AU', // Australia
  '554': 'NZ', // New Zealand
  '392': 'JP', // Japan
  '410': 'KR', // South Korea
  '156': 'CN', // China
  '356': 'IN', // India
  '360': 'ID', // Indonesia
  '458': 'MY', // Malaysia
  '764': 'TH', // Thailand
  '704': 'VN', // Vietnam
  
  // Africa
  '710': 'ZA', // South Africa
  '404': 'KE', // Kenya
  '231': 'ET', // Ethiopia
  '504': 'MA', // Morocco
  '818': 'EG', // Egypt
  '788': 'TN', // Tunisia
  '012': 'DZ', // Algeria
  '566': 'NG', // Nigeria
};

// Generate a CSV file with the original scanned content and additional information
export const generateCSV = (items: ScannedItem[]): string => {
  // Sort items by type (QR codes first, then ear tags) and then by timestamp (newest first)
  const qrItems = items.filter(item => item.type === 'qr')
    .sort((a, b) => b.timestamp - a.timestamp);
  const earTagItems = items.filter(item => item.type !== 'qr')
    .sort((a, b) => b.timestamp - a.timestamp);
  
  const sortedItems = [...qrItems, ...earTagItems];
  
  // CSV with headers for additional information
  let csv = "Inhalt,Typ,Datum,Tier-ID,Rasse,Geburtsdatum,Gewicht,Besitzer,Standort,Notizen\r\n";
  
  // Add each item as a row
  sortedItems.forEach(item => {
    // Use the original scanned content for export - no formatting
    let content = item.originalContent;
    
    // Replace numeric country prefixes with ISO country codes for ear tags
    if (item.type !== 'qr') {
      for (const [prefix, countryCode] of Object.entries(COUNTRY_PREFIXES)) {
        if (content.startsWith(prefix)) {
          content = content.replace(new RegExp(`^${prefix}`), countryCode);
          break; // Stop after first match
        }
      }
    }
    
    // Get additional info or empty strings
    const info = item.additionalInfo || {};
    const animalId = info.animalId || '';
    const breed = info.breed || '';
    const birthDate = info.birthDate || '';
    const weight = info.weight || '';
    const ownerName = info.ownerName || '';
    const location = info.location || '';
    const notes = info.notes || '';
    
    // Escape quotes and commas in CSV
    const escapeCSV = (str: string) => {
      if (str.includes('"') || str.includes(',') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    csv += `${escapeCSV(content)},${escapeCSV(getReadableTypeName(item.type))},${escapeCSV(item.date)},${escapeCSV(animalId)},${escapeCSV(breed)},${escapeCSV(birthDate)},${escapeCSV(weight)},${escapeCSV(ownerName)},${escapeCSV(location)},${escapeCSV(notes)}\r\n`;
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