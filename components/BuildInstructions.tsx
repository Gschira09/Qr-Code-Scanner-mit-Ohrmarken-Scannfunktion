import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, ScrollView } from 'react-native';
import Colors from '@/constants/colors';
import { ExternalLink } from 'lucide-react-native';

export default function BuildInstructions() {
  const openExpoLink = () => {
    Linking.openURL('https://expo.dev/');
  };

  const openBuildAppsOnlineLink = () => {
    Linking.openURL('https://appetize.io/');
  };

  const openExpoSnackLink = () => {
    Linking.openURL('https://snack.expo.dev/');
  };

  const openEASLink = () => {
    Linking.openURL('https://docs.expo.dev/build/setup/');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>APK auf dem Smartphone erstellen</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Option 1: Expo Go App (Einfachste Methode)</Text>
          <Text style={styles.description}>
            Die einfachste Methode ist, die App mit Expo Go zu testen:
          </Text>
          <View style={styles.steps}>
            <Text style={styles.step}>1. Laden Sie die Expo Go App aus dem Play Store herunter</Text>
            <Text style={styles.step}>2. Scannen Sie den QR-Code vom Entwickler</Text>
            <Text style={styles.step}>3. Die App wird in Expo Go geöffnet</Text>
          </View>
          <TouchableOpacity style={styles.linkButton} onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=host.exp.exponent')}>
            <Text style={styles.linkButtonText}>Expo Go im Play Store öffnen</Text>
            <ExternalLink size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Option 2: Expo EAS Build (Empfohlen)</Text>
          <Text style={styles.description}>
            Mit Expo EAS können Sie direkt auf Ihrem Smartphone eine APK erstellen:
          </Text>
          <View style={styles.steps}>
            <Text style={styles.step}>1. Installieren Sie die Expo Go App</Text>
            <Text style={styles.step}>2. Erstellen Sie ein Expo-Konto auf expo.dev</Text>
            <Text style={styles.step}>3. Öffnen Sie die Expo Go App und melden Sie sich an</Text>
            <Text style={styles.step}>4. Tippen Sie auf "Create" und wählen Sie "New Project"</Text>
            <Text style={styles.step}>5. Wählen Sie eine Vorlage und erstellen Sie Ihr Projekt</Text>
            <Text style={styles.step}>6. Tippen Sie auf "Build" und wählen Sie "Android"</Text>
            <Text style={styles.step}>7. Folgen Sie den Anweisungen, um die APK zu erstellen</Text>
          </View>
          <Text style={styles.note}>
            Diese Methode erstellt eine echte APK-Datei, die Sie auf anderen Geräten installieren können.
          </Text>
          <TouchableOpacity style={styles.linkButton} onPress={openEASLink}>
            <Text style={styles.linkButtonText}>Expo EAS Build Dokumentation</Text>
            <ExternalLink size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Option 3: APK Builder Apps</Text>
          <Text style={styles.description}>
            Es gibt Apps, mit denen Sie APKs direkt auf Ihrem Smartphone erstellen können:
          </Text>
          <View style={styles.steps}>
            <Text style={styles.step}>1. Laden Sie "APK Builder" oder "BuildAPK" aus dem Play Store</Text>
            <Text style={styles.step}>2. Importieren Sie den Quellcode oder erstellen Sie ein neues Projekt</Text>
            <Text style={styles.step}>3. Folgen Sie den Anweisungen in der App</Text>
            <Text style={styles.step}>4. Installieren Sie die erstellte APK</Text>
          </View>
          <Text style={styles.note}>
            Hinweis: Diese Apps haben möglicherweise Einschränkungen bei komplexen Projekten.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Option 4: Online APK Builder</Text>
          <Text style={styles.description}>
            Es gibt Online-Dienste, die APKs ohne lokale Entwicklungsumgebung erstellen:
          </Text>
          <View style={styles.steps}>
            <Text style={styles.step}>1. Besuchen Sie einen Online APK Builder wie BuildAPKs.online</Text>
            <Text style={styles.step}>2. Laden Sie Ihren Quellcode hoch oder verwenden Sie einen Starter-Code</Text>
            <Text style={styles.step}>3. Konfigurieren Sie die App-Einstellungen</Text>
            <Text style={styles.step}>4. Laden Sie die fertige APK herunter</Text>
          </View>
          <TouchableOpacity style={styles.linkButton} onPress={openBuildAppsOnlineLink}>
            <Text style={styles.linkButtonText}>Online APK Builder öffnen</Text>
            <ExternalLink size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Option 5: Expo Snack (Keine Installation nötig)</Text>
          <Text style={styles.description}>
            Mit Expo Snack können Sie Apps im Browser erstellen und testen:
          </Text>
          <View style={styles.steps}>
            <Text style={styles.step}>1. Besuchen Sie snack.expo.dev im Browser Ihres Smartphones</Text>
            <Text style={styles.step}>2. Erstellen Sie Ihre App direkt im Browser</Text>
            <Text style={styles.step}>3. Klicken Sie auf "Run on device" und scannen Sie den QR-Code</Text>
            <Text style={styles.step}>4. Die App wird in Expo Go auf Ihrem Gerät geöffnet</Text>
          </View>
          <TouchableOpacity style={styles.linkButton} onPress={openExpoSnackLink}>
            <Text style={styles.linkButtonText}>Expo Snack öffnen</Text>
            <ExternalLink size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.expoButton} onPress={openExpoLink}>
          <Text style={styles.expoButtonText}>Expo Website besuchen</Text>
          <ExternalLink size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  steps: {
    marginBottom: 12,
  },
  step: {
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 8,
    paddingLeft: 15,
  },
  codeBlock: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  note: {
    fontSize: 14,
    color: Colors.light.placeholder,
    fontStyle: 'italic',
    marginTop: 8,
  },
  linkButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.secondary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  expoButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 8,
  },
  expoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});