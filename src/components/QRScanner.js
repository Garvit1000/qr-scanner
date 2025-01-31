import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import validUIDs from '../data/validUIDs.json';
import QRService from '../services/qrService';

export default function QRScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(0);
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleScanAgain = () => {
    setScanned(false);
    setScanResult(null);
    setIsProcessing(false);
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    try {
      // Prevent multiple rapid scans (debounce)
      const currentTime = Date.now();
      if (currentTime - lastScanTime < 2000) { // 2 seconds cooldown
        return;
      }
      setLastScanTime(currentTime);

      // Set scanning state
      setScanned(true);
      setIsProcessing(true);

      // Check if QR is valid
      const isValid = validUIDs.uids.includes(data);

      // Check if already scanned
      const isAlreadyScanned = await QRService.checkIfScanned(data);

      if (isAlreadyScanned) {
        setScanResult({
          isValid: false,
          data,
          timestamp: new Date().toLocaleTimeString(),
          message: 'This QR code has already been scanned!'
        });
      } else if (isValid) {
        // Add scan to database if valid
        await QRService.addScan({
          uid: data,
          isValid: true
        });
        setScanResult({
          isValid: true,
          data,
          timestamp: new Date().toLocaleTimeString(),
          message: 'Access Granted'
        });
      } else {
        setScanResult({
          isValid: false,
          data,
          timestamp: new Date().toLocaleTimeString(),
          message: 'Invalid QR Code'
        });
      }

    } catch (error) {
      console.error('QR Scan Error:', error);
      setScanResult({
        isValid: false,
        data: 'Error scanning code',
        timestamp: new Date().toLocaleTimeString(),
        message: 'Error processing QR code'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (hasPermission === null) {
    return <Text style={styles.message}>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text style={styles.message}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
      />
      
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.processingText}>Processing...</Text>
        </View>
      )}

      {scanResult && (
        <View style={[
          styles.resultOverlay,
          { backgroundColor: scanResult.isValid ? 'rgba(0,255,0,0.7)' : 'rgba(255,0,0,0.7)' }
        ]}>
          <Text style={styles.resultText}>{scanResult.message}</Text>
          <Text style={styles.resultData}>{scanResult.data}</Text>
          <Text style={styles.resultTime}>{scanResult.timestamp}</Text>
          <TouchableOpacity 
            style={styles.scanAgainButton}
            onPress={handleScanAgain}
          >
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
  },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultData: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'center',
  },
  resultTime: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  scanAgainButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scanAgainText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
  },
});
