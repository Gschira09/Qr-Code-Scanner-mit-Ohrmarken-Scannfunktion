import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useScanStore } from '@/store/scanStore';
import Colors from '@/constants/colors';
import { Scan, RotateCcw, Image as ImageIcon, Flashlight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { SCAN_MODES } from '@/constants/barcodeTypes';
import * as ImagePicker from 'expo-image-picker';

export default function QRScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [scannedType, setScannedType] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<string>(SCAN_MODES.QR_CODE);
  const [processingImage, setProcessingImage] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const addItem = useScanStore((state) => state.addItem);
  const cameraRef = useRef(null);
  const lastScannedRef = useRef<string | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (scannedCode) {
      const timer = setTimeout(() => {
        setScannedCode(null);
        setScannedType(null);
        setScanning(true);
        lastScannedRef.current = null;
        
        // If we have more images to process, continue with the next one
        if (selectedImages.length > 0 && currentImageIndex < selectedImages.length - 1) {
          setCurrentImageIndex(prevIndex => prevIndex + 1);
          // Process the next image
          processNextImage();
        } else if (selectedImages.length > 0) {
          // We've processed all images, clear the selection
          setSelectedImages([]);
          setCurrentImageIndex(0);
          setProcessingImage(false);
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [scannedCode, selectedImages, currentImageIndex]);

  // Handle barcode scanning - directly use the raw data without any formatting
  const handleBarCodeScanned = ({ data, type }: BarcodeScanningResult) => {
    console.log("Barcode detected:", { data, type });
    
    if (!scanning || !data) return;
    
    // Prevent scanning the same code multiple times in quick succession
    if (data === lastScannedRef.current) {
      console.log("Duplicate scan prevented");
      return;
    }
    
    console.log("Processing scanned barcode:", { data, type });
    
    // Store the current code to prevent duplicates
    lastScannedRef.current = data;
    
    // Clear any existing timeout
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }
    
    // Temporarily disable scanning
    setScanning(false);
    
    // Store the raw scanned data without any formatting
    setScannedCode(data);
    setScannedType(type);
    
    // Add the raw data to the store
    addItem(data, type);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Set a timeout to allow scanning again after a delay
    scanTimeoutRef.current = setTimeout(() => {
      lastScannedRef.current = null;
    }, 3000);
  };

  const toggleScanMode = () => {
    setScanMode(prevMode => 
      prevMode === SCAN_MODES.QR_CODE ? SCAN_MODES.EAR_TAG : SCAN_MODES.QR_CODE
    );
    // Reset scanning state when changing modes
    setScanning(true);
    setScannedCode(null);
    setScannedType(null);
    lastScannedRef.current = null;
  };

  const toggleFlashlight = () => {
    setFlashlightOn(prev => !prev);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Process the next image
  const processNextImage = async () => {
    try {
      setProcessingImage(true);
      
      // In a real implementation, we would use ML Kit to analyze the image
      // For this demo, we'll simulate processing with a delay
      setTimeout(() => {
        setProcessingImage(false);
        Alert.alert(
          "Bildverarbeitung",
          "Die Bildverarbeitung ist in dieser Version nicht verfügbar. Bitte verwenden Sie die Kamera zum Scannen.",
          [{ text: "OK" }]
        );
        setSelectedImages([]);
        setCurrentImageIndex(0);
      }, 1500);
    } catch (error) {
      console.error("Fehler bei der Bildverarbeitung:", error);
      setProcessingImage(false);
    }
  };

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        allowsMultipleSelection: true,
        selectionLimit: 100,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProcessingImage(true);
        
        // Store the selected image URIs
        const imageUris = result.assets.map(asset => asset.uri);
        setSelectedImages(imageUris);
        setCurrentImageIndex(0);
        
        // Process the first image
        processNextImage();
      }
    } catch (error) {
      console.error("Fehler beim Auswählen der Bilder:", error);
      setProcessingImage(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Kameraberechtigungen werden geladen...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Scan size={64} color={Colors.light.primary} />
        <Text style={styles.permissionTitle}>Kamerazugriff erforderlich</Text>
        <Text style={styles.permissionText}>
          Wir benötigen Kamerazugriff, um Barcodes zu scannen
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Berechtigung erteilen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (processingImage && selectedImages.length > 0) {
    return (
      <View style={styles.processingContainer}>
        <Image 
          source={{ uri: selectedImages[currentImageIndex] }} 
          style={styles.previewImage} 
          resizeMode="contain"
        />
        <View style={styles.processingOverlay}>
          <Text style={styles.processingText}>Bild wird verarbeitet...</Text>
          <Text style={styles.processingSubtext}>Suche nach Barcodes...</Text>
          {selectedImages.length > 1 && (
            <Text style={styles.processingCounter}>
              Bild {currentImageIndex + 1} von {selectedImages.length}
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          // In Expo SDK 52, we need to pass the barcode types as strings
          barcodeTypes: scanMode === SCAN_MODES.QR_CODE 
            ? ['qr'] 
            : ['code128', 'code39', 'code93', 'ean13', 'ean8', 'upc_e', 'datamatrix', 'itf14', 'pdf417'],
        }}
        onBarcodeScanned={scanning ? handleBarCodeScanned : undefined}
        // In Expo SDK 52, flashlight is controlled via enableTorch prop
        enableTorch={flashlightOn}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
          
          <View style={styles.modeIndicator}>
            <Text style={styles.modeText}>
              {scanMode === SCAN_MODES.QR_CODE ? 'QR-Code Modus' : 'Ohrmarken Modus'}
            </Text>
          </View>
          
          {/* Flashlight button */}
          <TouchableOpacity 
            style={[
              styles.flashlightButton,
              flashlightOn && styles.flashlightButtonActive
            ]}
            onPress={toggleFlashlight}
          >
            <Flashlight 
              size={24} 
              color={flashlightOn ? "#fff" : Colors.light.primary} 
            />
          </TouchableOpacity>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.modeToggle}
              onPress={toggleScanMode}
            >
              <RotateCcw size={20} color="#fff" style={styles.toggleIcon} />
              <Text style={styles.toggleText}>
                Wechseln zu {scanMode === SCAN_MODES.QR_CODE ? 'Ohrmarken' : 'QR-Code'} Modus
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.imagePickerButton}
              onPress={pickImages}
            >
              <ImageIcon size={20} color="#fff" style={styles.toggleIcon} />
              <Text style={styles.toggleText}>
                Bilder aus Galerie (max. 100)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {scannedCode && (
          <View style={styles.scannedOverlay}>
            <View style={styles.scannedContent}>
              <Text style={styles.scannedTitle}>
                {scanMode === SCAN_MODES.QR_CODE ? 'QR-Code' : 'Ohrmarke'} gescannt!
              </Text>
              <Text style={styles.scannedType}>
                Typ: {scannedType}
              </Text>
              {scannedCode && (
                <Text style={styles.formattedNumber}>
                  {scannedCode}
                </Text>
              )}
              {selectedImages.length > 1 && (
                <Text style={styles.scannedCounter}>
                  Bild {currentImageIndex + 1} von {selectedImages.length}
                </Text>
              )}
            </View>
          </View>
        )}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  modeIndicator: {
    position: 'absolute',
    top: 50,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  flashlightButton: {
    position: 'absolute',
    top: 120,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  flashlightButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    width: '90%',
    gap: 12,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleIcon: {
    marginRight: 8,
  },
  toggleText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  scannedOverlay: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  scannedContent: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scannedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.success,
    marginBottom: 4,
    textAlign: 'center',
  },
  scannedType: {
    fontSize: 14,
    color: Colors.light.placeholder,
    marginBottom: 8,
    textAlign: 'center',
  },
  formattedNumber: {
    fontSize: 18,
    color: Colors.light.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  scannedCounter: {
    fontSize: 12,
    color: Colors.light.placeholder,
    textAlign: 'center',
    marginTop: 8,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 20,
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 16,
    color: Colors.light.placeholder,
    textAlign: 'center',
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  processingContainer: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  previewImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  processingText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  processingSubtext: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  processingCounter: {
    color: '#fff',
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
});