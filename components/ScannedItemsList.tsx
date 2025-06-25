import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useScanStore } from '@/store/scanStore';
import Colors from '@/constants/colors';
import { Trash2 } from 'lucide-react-native';
import { ScannedItem } from '@/types';

interface ScannedItemsListProps {
  filteredItems?: ScannedItem[];
}

export default function ScannedItemsList({ filteredItems }: ScannedItemsListProps) {
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

  const renderItem = ({ item }: { item: ScannedItem }) => (
    <View style={[
      styles.itemContainer,
      isEarTag(item.type) && styles.earTagItem
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
        </View>
        <Text style={styles.itemText}>{item.content}</Text>
        <Text style={styles.itemDate}>{item.date}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item.id)}
      >
        <Trash2 size={20} color={Colors.light.error} />
      </TouchableOpacity>
    </View>
  );

  if (displayItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Keine gescannten Einträge</Text>
        <Text style={styles.emptyText}>
          Scannen Sie einen QR-Code oder eine Tierohrmarke, um sie hier angezeigt zu bekommen
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
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
  },
  earTagBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
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
  },
  deleteButton: {
    justifyContent: 'center',
    paddingLeft: 12,
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
  },
});