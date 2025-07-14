import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useScanStore } from '@/store/scanStore';
import Colors from '@/constants/colors';
import { Save, ArrowLeft, Info, Lock } from 'lucide-react-native';

export default function EditItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { items, updateItem } = useScanStore();
  
  const item = items.find(item => item.id === id);
  
  const [formData, setFormData] = useState({
    animalId: '',
    breed: '',
    birthDate: '',
    weight: '',
    notes: '',
    ownerName: '',
    location: '',
  });

  useEffect(() => {
    if (item?.additionalInfo) {
      setFormData({
        animalId: item.additionalInfo.animalId || '',
        breed: item.additionalInfo.breed || '',
        birthDate: item.additionalInfo.birthDate || '',
        weight: item.additionalInfo.weight || '',
        notes: item.additionalInfo.notes || '',
        ownerName: item.additionalInfo.ownerName || '',
        location: item.additionalInfo.location || '',
      });
    }
  }, [item]);

  const handleSave = () => {
    if (!item) return;
    
    // Filter out empty values
    const filteredData = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value.trim()) {
        acc[key as keyof typeof formData] = value.trim();
      }
      return acc;
    }, {} as typeof formData);
    
    updateItem(id, Object.keys(filteredData).length > 0 ? filteredData : undefined);
    
    const itemType = item.type === 'qr' ? 'QR-Code' : 'Ohrmarke';
    
    Alert.alert(
      "Dauerhaft gespeichert",
      `Die zusätzlichen Informationen wurden dauerhaft mit dieser ${itemType} verknüpft und gespeichert. Sie bleiben auch nach App-Neustarts erhalten.`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  const handleCancel = () => {
    router.back();
  };

  const hasExistingData = item?.additionalInfo && Object.keys(item.additionalInfo).length > 0;

  const getBarcodeTypeLabel = (type: string) => {
    if (type === 'qr') return 'QR-Code';
    if (type.includes('code')) return type.toUpperCase();
    if (type.includes('ean')) return `EAN-${type.replace('ean', '')}`;
    if (type === 'upc_e') return 'UPC-E';
    if (type === 'datamatrix') return 'DataMatrix';
    if (type === 'pdf417') return 'PDF417';
    if (type === 'itf14') return 'ITF-14';
    return type.toUpperCase();
  };

  const isEarTag = (type: string) => {
    return type !== 'qr';
  };

  if (!item) {
    return (
      <>
        <Stack.Screen options={{ title: "Eintrag nicht gefunden" }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Der zu bearbeitende Eintrag wurde nicht gefunden.</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
            <ArrowLeft size={20} color="#fff" />
            <Text style={styles.backButtonText}>Zurück</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  const itemTypeLabel = getBarcodeTypeLabel(item.type);
  const isEarTagItem = isEarTag(item.type);

  return (
    <>
      <Stack.Screen 
        options={{
          title: `${itemTypeLabel} dauerhaft bearbeiten`,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEarTagItem ? 'Ohrmarken' : 'QR-Code'} Informationen
          </Text>
          <View style={styles.originalContent}>
            <Text style={styles.originalLabel}>
              Ursprünglicher {itemTypeLabel} Inhalt:
            </Text>
            <Text style={styles.originalText}>{item.content}</Text>
          </View>
          
          <View style={styles.persistenceInfo}>
            <Lock size={16} color={Colors.light.primary} />
            <Text style={styles.persistenceText}>
              Alle Änderungen werden dauerhaft mit dieser {isEarTagItem ? 'Ohrmarke' : 'QR-Code'} gespeichert
            </Text>
          </View>
          
          {hasExistingData && (
            <View style={styles.existingDataInfo}>
              <Info size={16} color={Colors.light.success} />
              <Text style={styles.existingDataText}>
                Diese {isEarTagItem ? 'Ohrmarke' : 'QR-Code'} hat bereits gespeicherte Informationen
              </Text>
            </View>
          )}
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Zusätzliche Informationen hinzufügen</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tier-ID</Text>
            <TextInput
              style={styles.input}
              value={formData.animalId}
              onChangeText={(text) => setFormData(prev => ({ ...prev, animalId: text }))}
              placeholder="z.B. DE123456789"
              placeholderTextColor={Colors.light.placeholder}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rasse</Text>
            <TextInput
              style={styles.input}
              value={formData.breed}
              onChangeText={(text) => setFormData(prev => ({ ...prev, breed: text }))}
              placeholder="z.B. Holstein-Friesian"
              placeholderTextColor={Colors.light.placeholder}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Geburtsdatum</Text>
            <TextInput
              style={styles.input}
              value={formData.birthDate}
              onChangeText={(text) => setFormData(prev => ({ ...prev, birthDate: text }))}
              placeholder="z.B. 15.03.2023"
              placeholderTextColor={Colors.light.placeholder}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gewicht (kg)</Text>
            <TextInput
              style={styles.input}
              value={formData.weight}
              onChangeText={(text) => setFormData(prev => ({ ...prev, weight: text }))}
              placeholder="z.B. 450"
              placeholderTextColor={Colors.light.placeholder}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Besitzer</Text>
            <TextInput
              style={styles.input}
              value={formData.ownerName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, ownerName: text }))}
              placeholder="z.B. Max Mustermann"
              placeholderTextColor={Colors.light.placeholder}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Standort</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
              placeholder="z.B. Stall A, Box 12"
              placeholderTextColor={Colors.light.placeholder}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notizen</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
              placeholder="Zusätzliche Informationen..."
              placeholderTextColor={Colors.light.placeholder}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Abbrechen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save size={20} color="#fff" style={styles.saveIcon} />
            <Text style={styles.saveButtonText}>Dauerhaft speichern</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Die Informationen werden dauerhaft mit dieser {isEarTagItem ? 'Ohrmarke' : 'QR-Code'} verknüpft und bleiben auch nach App-Neustarts erhalten.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 12,
  },
  originalContent: {
    backgroundColor: Colors.light.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  originalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.placeholder,
    marginBottom: 4,
  },
  originalText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '500',
  },
  persistenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f4fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  persistenceText: {
    fontSize: 14,
    color: Colors.light.primary,
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  existingDataInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
  },
  existingDataText: {
    fontSize: 14,
    color: Colors.light.success,
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  form: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.light.card,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    padding: 16,
    paddingTop: 0,
  },
  footerText: {
    fontSize: 14,
    color: Colors.light.placeholder,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  errorText: {
    fontSize: 18,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});