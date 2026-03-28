import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, Platform, Alert, View } from 'react-native';
import { useScanStore } from '@/store/scanStore';
import { exportToCSV, downloadAsFile } from '@/utils/exportUtils';
import Colors from '@/constants/colors';
import { Download, FileSpreadsheet } from 'lucide-react-native';

export default function ExportButton() {
  const [exporting, setExporting] = useState(false);
  const items = useScanStore((state) => state.items);

  // Count items with additional information
  const itemsWithAdditionalInfo = items.filter(item => 
    item.additionalInfo && Object.keys(item.additionalInfo).length > 0
  ).length;

  const handleExport = async () => {
    if (items.length === 0 || exporting) return;
    
    setExporting(true);
    try {
      console.log('Starte vollständigen CSV-Export-Prozess...');
      
      if (Platform.OS === 'web') {
        // On web, directly download the CSV file
        await downloadAsFile(items, 'csv');
        Alert.alert(
          "CSV-Export erfolgreich", 
          `Die Excel/CSV-Datei wurde erfolgreich heruntergeladen.\n\n` +
          `Enthält ${items.length} Einträge, davon ${itemsWithAdditionalInfo} mit zusätzlichen Informationen.\n\n` +
          `Alle bearbeiteten QR-Code-Informationen sind in der Excel-Liste enthalten.`
        );
      } else if (Platform.OS === 'android') {
        // On Android, try to save to Downloads folder
        const success = await exportToCSV(items);
        
        if (success) {
          Alert.alert(
            "CSV-Export erfolgreich", 
            `Die Excel/CSV-Datei wurde erfolgreich im Downloads-Ordner gespeichert.\n\n` +
            `Enthält ${items.length} Einträge, davon ${itemsWithAdditionalInfo} mit zusätzlichen Informationen.\n\n` +
            `Alle bearbeiteten QR-Code-Informationen sind in der Excel-Liste enthalten.`
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
            `Die Excel/CSV-Datei wurde erfolgreich im Dokumentenordner gespeichert.\n\n` +
            `Enthält ${items.length} Einträge, davon ${itemsWithAdditionalInfo} mit zusätzlichen Informationen.\n\n` +
            `Alle bearbeiteten QR-Code-Informationen sind in der Excel-Liste enthalten.`
          );
        } else {
          Alert.alert(
            "CSV-Export fehlgeschlagen", 
            "Beim Exportieren Ihrer Daten ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."
          );
        }
      }
      
      console.log('Vollständiger CSV-Export erfolgreich abgeschlossen');
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
            <FileSpreadsheet size={20} color="#fff" style={styles.icon} />
            <Text style={styles.text}>Excel/CSV Export</Text>
          </>
        )}
      </TouchableOpacity>
      
      {itemsWithAdditionalInfo > 0 && (
        <Text style={styles.infoText}>
          {itemsWithAdditionalInfo} Einträge mit zusätzlichen Informationen werden in der Excel-Liste angezeigt
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 8,
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
  infoText: {
    fontSize: 12,
    color: Colors.light.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
});