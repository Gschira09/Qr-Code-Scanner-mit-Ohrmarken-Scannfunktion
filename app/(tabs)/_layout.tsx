import React from 'react';
import { Tabs } from 'expo-router';
import Colors from '@/constants/colors';
import { QrCode, List, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.placeholder,
        tabBarStyle: {
          backgroundColor: Colors.light.background,
          borderTopColor: Colors.light.border,
        },
        headerStyle: {
          backgroundColor: Colors.light.background,
        },
        headerTitleStyle: {
          color: Colors.light.text,
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Scanner",
          tabBarIcon: ({ color }) => <QrCode size={24} color={color} />,
          tabBarLabel: "Scanner",
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Verlauf",
          tabBarIcon: ({ color }) => <List size={24} color={color} />,
          tabBarLabel: "Verlauf",
        }}
      />
      <Tabs.Screen
        name="build"
        options={{
          title: "APK erstellen",
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
          tabBarLabel: "APK",
        }}
      />
    </Tabs>
  );
}