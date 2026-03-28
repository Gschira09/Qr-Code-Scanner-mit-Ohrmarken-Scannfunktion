import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { Stack } from 'expo-router';
import QRScanner from '@/components/QRScanner';
import Colors from '@/constants/colors';

export default function ScannerScreen() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: "Barcode Scanner",
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      
      <View style={styles.container}>
        {Platform.OS === 'web' ? (
          <View style={styles.webWarning}>
            <Text style={styles.webWarningTitle}>Nur für Android-Geräte</Text>
            <Text style={styles.webWarningText}>
              Diese Barcode-Scanner-App ist nur für Android-Geräte konzipiert. Bitte öffnen Sie diese App auf einem Android-Gerät, um die Scanner-Funktionalität zu nutzen.
            </Text>
          </View>
        ) : (
          <QRScanner />
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
  webWarning: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webWarningTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 12,
  },
  webWarningText: {
    fontSize: 16,
    color: Colors.light.placeholder,
    textAlign: 'center',
    maxWidth: 400,
  },
});