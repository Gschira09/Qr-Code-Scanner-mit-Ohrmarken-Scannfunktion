import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';
import { ExternalLink, Check, AlertCircle } from 'lucide-react-native';

export default function APKScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: "APK Erstellung",
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.title}>Kostenlose APK-Erstellung</Text>
            <Text style={styles.description}>
              Es gibt mehrere kostenlose Online-Dienste, mit denen Sie diese App in eine APK-Datei konvertieren können:
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>1. Expo EAS Build (Empfohlen)</Text>
            <Text style={styles.cardDescription}>
              Der offizielle Weg, um Expo-Apps in APKs zu konvertieren. Erfordert ein kostenloses Expo-Konto.
            </Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Check size={16} color={Colors.light.success} style={styles.featureIcon} />
                <Text style={styles.featureText}>Hohe Qualität und Zuverlässigkeit</Text>
              </View>
              <View style={styles.featureItem}>
                <Check size={16} color={Colors.light.success} style={styles.featureIcon} />
                <Text style={styles.featureText}>Offiziell unterstützt von Expo</Text>
              </View>
              <View style={styles.featureItem}>
                <Check size={16} color={Colors.light.success} style={styles.featureIcon} />
                <Text style={styles.featureText}>Einfache Konfiguration über eas.json</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => openLink('https://docs.expo.dev/build/setup/')}
            >
              <Text style={styles.linkButtonText}>Anleitung öffnen</Text>
              <ExternalLink size={16} color="#fff" style={styles.linkIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>2. Appetize.io</Text>
            <Text style={styles.cardDescription}>
              Ermöglicht das Testen Ihrer App im Browser und bietet auch Build-Dienste an.
            </Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Check size={16} color={Colors.light.success} style={styles.featureIcon} />
                <Text style={styles.featureText}>Einfache Bedienung</Text>
              </View>
              <View style={styles.featureItem}>
                <Check size={16} color={Colors.light.success} style={styles.featureIcon} />
                <Text style={styles.featureText}>Kostenlose Testversion verfügbar</Text>
              </View>
              <View style={styles.featureItem}>
                <AlertCircle size={16} color={Colors.light.error} style={styles.featureIcon} />
                <Text style={styles.featureText}>Begrenzte kostenlose Nutzung</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => openLink('https://appetize.io/')}
            >
              <Text style={styles.linkButtonText}>Website öffnen</Text>
              <ExternalLink size={16} color="#fff" style={styles.linkIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>3. Snack Expo</Text>
            <Text style={styles.cardDescription}>
              Online-Editor für Expo-Apps mit der Möglichkeit, APKs zu erstellen.
            </Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Check size={16} color={Colors.light.success} style={styles.featureIcon} />
                <Text style={styles.featureText}>Direkt im Browser bearbeiten</Text>
              </View>
              <View style={styles.featureItem}>
                <Check size={16} color={Colors.light.success} style={styles.featureIcon} />
                <Text style={styles.featureText}>Keine Installation erforderlich</Text>
              </View>
              <View style={styles.featureItem}>
                <AlertCircle size={16} color={Colors.light.error} style={styles.featureIcon} />
                <Text style={styles.featureText}>Eingeschränkte Funktionalität</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => openLink('https://snack.expo.dev/')}
            >
              <Text style={styles.linkButtonText}>Snack Expo öffnen</Text>
              <ExternalLink size={16} color="#fff" style={styles.linkIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>4. BuildAPK Online</Text>
            <Text style={styles.cardDescription}>
              Ein einfacher Online-Dienst zum Erstellen von APKs aus verschiedenen Quellen.
            </Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Check size={16} color={Colors.light.success} style={styles.featureIcon} />
                <Text style={styles.featureText}>Einfache Benutzeroberfläche</Text>
              </View>
              <View style={styles.featureItem}>
                <Check size={16} color={Colors.light.success} style={styles.featureIcon} />
                <Text style={styles.featureText}>Unterstützt verschiedene Projekttypen</Text>
              </View>
              <View style={styles.featureItem}>
                <AlertCircle size={16} color={Colors.light.error} style={styles.featureIcon} />
                <Text style={styles.featureText}>Möglicherweise nicht für alle Expo-Features geeignet</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => openLink('https://buildapk.online/')}
            >
              <Text style={styles.linkButtonText}>Website öffnen</Text>
              <ExternalLink size={16} color="#fff" style={styles.linkIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Hinweis:</Text>
            <Text style={styles.infoText}>
              Die meisten dieser Dienste erfordern, dass Sie Ihren Quellcode hochladen oder ein GitHub-Repository verlinken. 
              Stellen Sie sicher, dass Sie keine sensiblen Daten oder API-Schlüssel in Ihrem Code haben, bevor Sie ihn hochladen.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>Schritt-für-Schritt-Anleitung</Text>
            <Text style={styles.description}>
              Für die einfachste Methode mit Expo EAS Build:
            </Text>
            <View style={styles.stepList}>
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  Erstellen Sie ein kostenloses Konto auf expo.dev
                </Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  Installieren Sie die EAS CLI: npm install -g eas-cli
                </Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  Melden Sie sich an: eas login
                </Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <Text style={styles.stepText}>
                  Konfigurieren Sie Ihr Projekt: eas build:configure
                </Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>5</Text>
                </View>
                <Text style={styles.stepText}>
                  Starten Sie den Build: eas build -p android
                </Text>
              </View>
            </View>
          </View>
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
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  featureList: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  linkButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  linkIcon: {
    marginLeft: 4,
  },
  infoBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  stepList: {
    marginTop: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
});