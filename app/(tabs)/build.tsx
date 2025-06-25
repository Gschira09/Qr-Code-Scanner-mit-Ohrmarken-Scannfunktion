import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import BuildInstructions from '@/components/BuildInstructions';
import Colors from '@/constants/colors';

export default function BuildScreen() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: "APK erstellen",
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      
      <View style={styles.container}>
        <BuildInstructions />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});