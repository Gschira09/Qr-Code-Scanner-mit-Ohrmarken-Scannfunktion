import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, Platform, Alert, View } from 'react-native';
import { useScanStore } from '@/store/scanStore';
import { exportToCSV, downloadAsFile } from '@/utils/exportUtils';
import Colors from '@/constants/colors';
import { Download } from 'lucide-react-native';

export default function ExportButton() {
  const [exporting, setExporting] = useState(false);
  const items = useScanStore((state) => state.items);

  const handleExport = async () => {
    if (items.length === 0 || exporting) return;
    
    setExporting(true);
    try {
      console.log('Starte CSV-Export-Prozess...');
      
      if (Platform.OS === 'web') {
        // On web, directly download the CSV file
        await downloadAsFile(items, 'csv');
        Alert.alert(
          "CSV-Export erfolgreich", 
          "Die CSV-Datei mit den Ohrmarken-Nummern wurde erfolgreich heruntergeladen."
        );
      } else if (Platform.OS === 'android') {
        // On Android, try to save to Downloads folder
        const success = await exportToCSV(items);
        
        if (success) {
          Alert.alert(
            "CSV-Export erfolgreich", 
            "Die CSV-Datei mit den Ohrmarken-Nummern wurde erfolgreich im Downloads-Ordner gespeichert."
          );
        } else {
          Alert.alert(
            "CSV-Export fehlgeschlagen", 
            "Beim Exportieren Ihrer Daten ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."
          );
        }
      } else {
        // On iOS, save to document directory
        const success = await exportToCSV(items);
        
        if (success) {
          Alert.alert(
            "CSV-Export erfolgreich", 
            "Die CSV-Datei mit den Ohrmarken-Nummern wurde erfolgreich im Dokumentenordner gespeichert."
          );
        } else {
          Alert.alert(
            "CSV-Export fehlgeschlagen", 
            "Beim Exportieren Ihrer Daten ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."
          );
        }
      }
      
      console.log('CSV-Export erfolgreich abgeschlossen');
    } catch (error) {
      console.error('CSV-Export fehlgeschlagen:', error);
      Alert.alert(
        "CSV-Export fehlgeschlagen", 
        "Beim Exportieren Ihrer Daten ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."
      );
    } finally {
      setExporting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          exporting && styles.buttonDisabled,
        ]}
        onPress={handleExport}
        disabled={exporting || items.length === 0}
      >
        {exporting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Download size={20} color="#fff" style={styles.icon} />
            <Text style={styles.text}>Ohrmarken-Nummern exportieren</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: Colors.light.placeholder,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginRight: 8,
  },
});