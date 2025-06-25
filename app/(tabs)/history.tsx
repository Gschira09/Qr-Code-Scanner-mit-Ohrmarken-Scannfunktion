import React, { useState } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import ScannedItemsList from '@/components/ScannedItemsList';
import ExportButton from '@/components/ExportButton';
import ClearButton from '@/components/ClearButton';
import ImageScanInfo from '@/components/ImageScanInfo';
import MLKitInfo from '@/components/MLKitInfo';
import Colors from '@/constants/colors';
import { useScanStore } from '@/store/scanStore';

export default function HistoryScreen() {
  const items = useScanStore((state) => state.items);
  const [filter, setFilter] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(true);
  const [showMLKitInfo, setShowMLKitInfo] = useState(true);
  
  // Apply filter to items
  const filteredItems = filter 
    ? items.filter(item => 
        filter === 'qr' 
          ? item.type === 'qr' 
          : item.type !== 'qr')
    : items;

  // Count items by type
  const qrCount = items.filter(item => item.type === 'qr').length;
  const earTagCount = items.filter(item => item.type !== 'qr').length;

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Gescannte Einträge",
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      
      <View style={styles.container}>
        {showInfo && <ImageScanInfo onDismiss={() => setShowInfo(false)} />}
        {showMLKitInfo && <MLKitInfo onDismiss={() => setShowMLKitInfo(false)} />}
        
        <View style={styles.header}>
          <Text style={styles.title}>
            {items.length > 0 
              ? `${items.length} ${items.length === 1 ? 'Eintrag' : 'Einträge'} gescannt` 
              : 'Keine Einträge gescannt'}
          </Text>
          
          {items.length > 0 && (
            <>
              <View style={styles.filterContainer}>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    filter === null && styles.filterButtonActive
                  ]}
                  onPress={() => setFilter(null)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    filter === null && styles.filterButtonTextActive
                  ]}>
                    Alle ({items.length})
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    filter === 'qr' && styles.filterButtonActive
                  ]}
                  onPress={() => setFilter('qr')}
                >
                  <Text style={[
                    styles.filterButtonText,
                    filter === 'qr' && styles.filterButtonTextActive
                  ]}>
                    QR-Codes ({qrCount})
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    filter === 'ear' && styles.filterButtonActive
                  ]}
                  onPress={() => setFilter('ear')}
                >
                  <Text style={[
                    styles.filterButtonText,
                    filter === 'ear' && styles.filterButtonTextActive
                  ]}>
                    Ohrmarken ({earTagCount})
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.actionButtonsContainer}>
                <View style={styles.exportContainer}>
                  <ExportButton />
                </View>
                <View style={styles.clearContainer}>
                  <ClearButton />
                </View>
              </View>
            </>
          )}
        </View>
        
        <ScannedItemsList filteredItems={filteredItems} />
        
        {Platform.OS === 'web' && (
          <View style={styles.webNotice}>
            <Text style={styles.webNoticeText}>
              Tipp: Im Web können Sie die Ohrmarken-Nummern direkt als CSV herunterladen
            </Text>
          </View>
        )}
        
        {Platform.OS === 'android' && (
          <View style={styles.webNotice}>
            <Text style={styles.webNoticeText}>
              Tipp: Die CSV-Datei mit Ohrmarken-Nummern wird im Downloads-Ordner gespeichert
            </Text>
          </View>
        )}
      </View>
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
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: Colors.light.card,
  },
  filterButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  exportContainer: {
    flex: 1,
    marginRight: 10,
  },
  clearContainer: {
    alignSelf: 'flex-start',
  },
  webNotice: {
    padding: 12,
    backgroundColor: Colors.light.card,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  webNoticeText: {
    fontSize: 14,
    color: Colors.light.placeholder,
    textAlign: 'center',
  },
});