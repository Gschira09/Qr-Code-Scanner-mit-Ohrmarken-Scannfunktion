import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import Colors from '@/constants/colors';
import { Info, X } from 'lucide-react-native';

interface ImageScanInfoProps {
  onDismiss: () => void;
}

export default function ImageScanInfo({ onDismiss }: ImageScanInfoProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Info size={24} color={Colors.light.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Funktionen</Text>
        <Text style={styles.description}>
          • QR-Codes und Barcodes von Ohrmarken scannen{"\n"}
          • QR-Codes bearbeiten und zusätzliche Informationen hinzufügen{"\n"}
          • Ohrmarken-Nummern im Originalformat anzeigen{"\n"}
          • Keine Formatierung der Nummern{"\n"}
          • Taschenlampe für bessere Scanergebnisse{"\n"}
          • Bilder aus der Galerie scannen{"\n"}
          • Sortiert automatisch QR-Codes und Ohrmarken{"\n"}
          • Scans werden nach Datum sortiert (neueste zuerst){"\n"}
          • Exportieren der Ohrmarken-Nummern als CSV-Datei{"\n"}
          • CSV-Export enthält alle zusätzlichen Informationen
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={onDismiss}
      >
        <X size={18} color={Colors.light.placeholder} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  iconContainer: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.light.placeholder,
    lineHeight: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
});