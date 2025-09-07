import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface QRTestPanelProps {
  onCafeSelected: (cafeData: any) => void;
  onClose: () => void;
}

const demoCafes = [
  {
    id: 'demo_cafe_001',
    name: 'AKAFE',
    location: 'Moscow, Arbat St. 1',
    apiEndpoint: 'http://localhost:3000/api',
    description: 'Cozy cafe in the center of Moscow'
  },
  {
    id: 'demo_cafe_002',
    name: 'Coffee House',
    location: 'St. Petersburg, Nevsky Prospect 50',
    apiEndpoint: 'http://localhost:3001/api',
    description: 'Modern coffee space'
  },
  {
    id: 'demo_cafe_003',
    name: 'Brew & Bean',
    location: 'Kazan, Bauman St. 15',
    apiEndpoint: 'http://localhost:3002/api',
    description: 'Specialized coffee shop'
  },
];

export const QRTestPanel: React.FC<QRTestPanelProps> = ({ onCafeSelected, onClose }) => {
  const [selectedCafe, setSelectedCafe] = useState<string | null>(null);

  const handleCafeSelect = (cafe: any) => {
    setSelectedCafe(cafe.id);
    
    Alert.alert(
      `Connect to ${cafe.name}?`,
      `Do you want to open the cafe menu "${cafe.name}"?\n\n${cafe.description}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Connect',
          onPress: () => {
            const cafeData = {
              cafeId: cafe.id,
              cafeName: cafe.name,
              location: cafe.location,
              apiEndpoint: cafe.apiEndpoint
            };
            onCafeSelected(cafeData);
          },
        },
      ]
    );
  };

  const generateQRCode = (cafe: any) => {
    const qrData = JSON.stringify({
      cafeId: cafe.id,
      cafeName: cafe.name,
      location: cafe.location,
      apiEndpoint: cafe.apiEndpoint
    });
    
    Alert.alert(
      'QR Code for Testing',
      `Copy this JSON to create a QR code:\n\n${qrData}`,
      [
        {
          text: 'Copy',
          onPress: () => {
            // In a real app, this would copy to clipboard
            console.log('QR Data:', qrData);
          },
        },
        {
          text: 'Close',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>QR Code Testing</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Select a cafe for testing or create a QR code for scanning
        </Text>

        {demoCafes.map((cafe) => (
          <View key={cafe.id} style={styles.cafeCard}>
            <View style={styles.cafeInfo}>
              <Text style={styles.cafeName}>{cafe.name}</Text>
              <Text style={styles.cafeLocation}>{cafe.location}</Text>
              <Text style={styles.cafeDescription}>{cafe.description}</Text>
            </View>
            
            <View style={styles.cafeActions}>
              <TouchableOpacity 
                style={styles.connectButton}
                onPress={() => handleCafeSelect(cafe)}
              >
                <Ionicons name="cafe" size={20} color="#fff" />
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.qrButton}
                onPress={() => generateQRCode(cafe)}
              >
                <Ionicons name="qr-code" size={20} color="#666" />
                <Text style={styles.qrButtonText}>QR Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Instructions:</Text>
          <Text style={styles.instructionsText}>
            • Click "Connect" to go directly to the cafe
          </Text>
          <Text style={styles.instructionsText}>
            • Click "QR Code" to get JSON data
          </Text>
          <Text style={styles.instructionsText}>
            • Use JSON to create QR code at qr-code-generator.com
          </Text>
          <Text style={styles.instructionsText}>
            • Scan QR code with simulator camera
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: isTablet ? 16 : 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  cafeCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: isTablet ? 20 : 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cafeInfo: {
    marginBottom: 15,
  },
  cafeName: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  cafeLocation: {
    fontSize: isTablet ? 14 : 12,
    color: '#666',
    marginBottom: 5,
  },
  cafeDescription: {
    fontSize: isTablet ? 14 : 12,
    color: '#666',
    fontStyle: 'italic',
  },
  cafeActions: {
    flexDirection: 'row',
    gap: 10,
  },
  connectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#666',
    paddingVertical: 12,
    borderRadius: 8,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: isTablet ? 14 : 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  qrButtonText: {
    color: '#666',
    fontSize: isTablet ? 14 : 12,
    fontWeight: '500',
    marginLeft: 8,
  },
  instructions: {
    backgroundColor: '#E8F4FD',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  instructionsTitle: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: isTablet ? 14 : 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 5,
  },
});
