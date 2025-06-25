import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useScanStore } from '@/store/scanStore';
import Colors from '@/constants/colors';
import { Trash } from 'lucide-react-native';

export default function ClearButton() {
  const { items, clearItems } = useScanStore();

  const confirmClear = () => {
    if (items.length === 0) return;
    
    Alert.alert(
      "Alle Einträge löschen",
      "Sind Sie sicher, dass Sie alle gescannten Einträge löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
      [
        { text: "Abbrechen", style: "cancel" },
        { 
          text: "Alle löschen", 
          onPress: clearItems, 
          style: "destructive" 
        }
      ]
    );
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={confirmClear}
    >
      <Trash size={20} color="#fff" style={styles.icon} />
      <Text style={styles.text}>Alle löschen</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: Colors.light.error,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
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