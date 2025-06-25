import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';
import { Info, X } from 'lucide-react-native';

interface MLKitInfoProps {
  onDismiss: () => void;
}

export default function MLKitInfo({ onDismiss }: MLKitInfoProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Info size={20} color={Colors.light.primary} style={styles.icon} />
          <Text style={styles.title}>Barcode-Scanner Information</Text>
        </View>
        <TouchableOpacity onPress={onDismiss}>
          <X size={20} color={Colors.light.placeholder} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.subtitle}>Hinweise zum Scannen</Text>
        <Text style={styles.description}>
          Diese App scannt QR-Codes und Barcodes und zeigt den tatsächlichen Inhalt ohne Änderungen an. Besonders geeignet für:
        </Text>
        
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <View style={styles.bullet} />
            <Text style={styles.featureText}>Staatliche Ohrmarken-Nummern für Tiere</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.bullet} />
            <Text style={styles.featureText}>QR-Codes mit Weblinks oder Informationen</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.bullet} />
            <Text style={styles.featureText}>Verschiedene Barcode-Formate (EAN, Code128, etc.)</Text>
          </View>
        </View>
        
        <Text style={styles.tipTitle}>Tipps für bessere Scanergebnisse:</Text>
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <View style={styles.bullet} />
            <Text style={styles.featureText}>Halten Sie die Kamera ruhig und fokussieren Sie den Barcode</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.bullet} />
            <Text style={styles.featureText}>Verwenden Sie die Taschenlampe bei schlechten Lichtverhältnissen</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.bullet} />
            <Text style={styles.featureText}>Wählen Sie den richtigen Modus für QR-Codes oder Ohrmarken</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f7fa',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  content: {
    padding: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  featureList: {
    marginVertical: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.primary,
    marginTop: 7,
    marginRight: 8,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 8,
    marginBottom: 8,
  },
});