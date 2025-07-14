import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useScanStore } from '@/store/scanStore';
import Colors from '@/constants/colors';
import { Trash2, Edit3, Info, Plus } from 'lucide-react-native';
import { ScannedItem } from '@/types';

interface ScannedItemsListProps {
  filteredItems?: ScannedItem[];
}

export default function ScannedItemsList({ filteredItems }: ScannedItemsListProps) {
  const router = useRouter();
  const { items, removeItem } = useScanStore();
  const displayItems = filteredItems || items;

  const confirmDelete = (id: string) => {
    Alert.alert(
      "Eintrag löschen",
      "Sind Sie sicher, dass Sie diesen gescannten Eintrag löschen möchten?",
      [
        { text: "Abbrechen", style: "cancel" },
        { text: "Löschen", onPress: () => removeItem(id), style: "destructive" }
      ]
    );
  };

  const handleEdit = (id: string) => {
    router.push(`/(tabs)/edit/${id}`);
  };

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

  const hasAdditionalInfo = (item: ScannedItem) => {
    return item.additionalInfo && Object.keys(item.additionalInfo).length > 0;
  };

  const renderAdditionalInfo = (item: ScannedItem) => {
    if (!hasAdditionalInfo(item)) return null;

    const info = item.additionalInfo!;
    const infoItems = [];

    if (info.animalId) infoItems.push(`Tier-ID: ${info.animalId}`);
    if (info.breed) infoItems.push(`Rasse: ${info.breed}`);
    if (info.birthDate) infoItems.push(`Geburt: ${info.birthDate}`);
    if (info.weight) infoItems.push(`Gewicht: ${info.weight} kg`);
    if (info.ownerName) infoItems.push(`Besitzer: ${info.ownerName}`);
    if (info.location) infoItems.push(`Standort: ${info.location}`);

    return (
      <View style={styles.additionalInfo}>
        <View style={styles.additionalInfoHeader}>
          <Info size={16} color={Colors.light.primary} />
          <Text style={styles.additionalInfoTitle}>Dauerhaft gespeicherte Informationen</Text>
        </View>
        {infoItems.map((item, index) => (
          <Text key={index} style={styles.additionalInfoText}>• {item}</Text>
        ))}
        {info.notes && (
          <Text style={styles.additionalInfoNotes}>Notizen: {info.notes}</Text>
        )}
      </View>
    );
  };

  const renderItem = ({ item }: { item: ScannedItem }) => (
    <View style={[
      styles.itemContainer,
      isEarTag(item.type) && styles.earTagItem,
      hasAdditionalInfo(item) && styles.itemWithInfo
    ]}>
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemType}>
            {getBarcodeTypeLabel(item.type)}
          </Text>
          {isEarTag(item.type) && (
            <View style={styles.earTagBadge}>
              <Text style={styles.earTagBadgeText}>Ohrmarke</Text>
            </View>
          )}
          {hasAdditionalInfo(item) && (
            <View style={styles.infoBadge}>
              <Info size={12} color="#fff" />
              <Text style={styles.infoBadgeText}>Bearbeitet</Text>
            </View>
          )}
          {item.type === 'qr' && !hasAdditionalInfo(item) && (
            <View style={styles.editableBadge}>
              <Plus size={12} color={Colors.light.primary} />
              <Text style={styles.editableBadgeText}>Bearbeitbar</Text>
            </View>
          )}
        </View>
        <Text style={styles.itemText}>{item.content}</Text>
        <Text style={styles.itemDate}>{item.date}</Text>
        
        {renderAdditionalInfo(item)}
      </View>
      
      <View style={styles.actionButtons}>
        {item.type === 'qr' && (
          <TouchableOpacity
            style={[
              styles.editButton,
              hasAdditionalInfo(item) && styles.editButtonWithInfo
            ]}
            onPress={() => handleEdit(item.id)}
          >
            <Edit3 size={18} color={hasAdditionalInfo(item) ? "#fff" : Colors.light.primary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDelete(item.id)}
        >
          <Trash2 size={18} color={Colors.light.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (displayItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Keine gescannten Einträge</Text>
        <Text style={styles.emptyText}>
          Scannen Sie einen QR-Code oder eine Tierohrmarke, um sie hier angezeigt zu bekommen
        </Text>
        <Text style={styles.emptySubtext}>
          QR-Codes können bearbeitet werden und Informationen werden dauerhaft gespeichert
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={displayItems}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  earTagItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#9BB1D2', // Secondary color
  },
  itemWithInfo: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
    backgroundColor: '#f8fffe',
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  itemType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginRight: 8,
  },
  earTagBadge: {
    backgroundColor: '#9BB1D2', // Secondary color
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  earTagBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  infoBadge: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  infoBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
  },
  editableBadge: {
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  editableBadgeText: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 6,
  },
  itemDate: {
    fontSize: 12,
    color: Colors.light.placeholder,
    marginBottom: 8,
  },
  additionalInfo: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e1f0ff',
  },
  additionalInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  additionalInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
    marginLeft: 6,
  },
  additionalInfoText: {
    fontSize: 13,
    color: Colors.light.text,
    marginBottom: 2,
  },
  additionalInfoNotes: {
    fontSize: 13,
    color: Colors.light.text,
    marginTop: 4,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 12,
    gap: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f0f4f8',
  },
  editButtonWithInfo: {
    backgroundColor: Colors.light.primary,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.placeholder,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.primary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});