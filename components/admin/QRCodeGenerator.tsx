import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { generateCafeDeepLink, generateCafeQRData, generateCafeWebLink, generateDemoQRCodes } from '../../utils/qrCodeGenerator';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export const QRCodeGenerator: React.FC = () => {
  const [cafeId, setCafeId] = useState('');
  const [cafeName, setCafeName] = useState('');
  const [location, setLocation] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('http://localhost:3000/api');
  const [generatedCodes, setGeneratedCodes] = useState<any>(null);

  const generateQRCode = () => {
    if (!cafeId || !cafeName) {
      Alert.alert('Error', 'Please fill in cafe ID and name');
      return;
    }

    const cafeData = {
      cafeId,
      cafeName,
      location,
      apiEndpoint,
    };

    const codes = {
      json: generateCafeQRData(cafeData),
      deepLink: generateCafeDeepLink(cafeData),
      webLink: generateCafeWebLink(cafeData),
    };

    setGeneratedCodes(codes);
  };

  const generateDemoCodes = () => {
    const demoCodes = generateDemoQRCodes();
    setGeneratedCodes(demoCodes.akafe);
  };

  const copyToClipboard = (text: string, label: string) => {
    // In a real app, you would use Clipboard.setString(text)
    Alert.alert('Copied', `${label} copied to clipboard`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cafe QR Code Generator</Text>
      
      {/* Input Form */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Cafe Data</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cafe ID *</Text>
          <TextInput
            style={styles.input}
            value={cafeId}
            onChangeText={setCafeId}
            placeholder="Example: cafe_001"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cafe Name *</Text>
          <TextInput
            style={styles.input}
            value={cafeName}
            onChangeText={setCafeName}
            placeholder="Example: AKAFE"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Example: Moscow, Arbat St. 1"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>API Endpoint</Text>
          <TextInput
            style={styles.input}
            value={apiEndpoint}
            onChangeText={setApiEndpoint}
            placeholder="http://localhost:3000/api"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.generateButton} onPress={generateQRCode}>
            <Ionicons name="qr-code" size={20} color="#fff" />
            <Text style={styles.generateButtonText}>Generate QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.demoButton} onPress={generateDemoCodes}>
            <Ionicons name="cafe" size={20} color="#666" />
            <Text style={styles.demoButtonText}>Demo QR Code (AKAFE)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Generated Codes */}
      {generatedCodes && (
        <View style={styles.resultsContainer}>
          <Text style={styles.sectionTitle}>Generated Codes</Text>
          
          {/* JSON Data */}
          <View style={styles.codeBlock}>
            <View style={styles.codeHeader}>
              <Text style={styles.codeTitle}>JSON data for QR code</Text>
              <TouchableOpacity 
                style={styles.copyButton}
                                  onPress={() => copyToClipboard(generatedCodes.json, 'JSON data')}
              >
                <Ionicons name="copy" size={16} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.codeText}>{generatedCodes.json}</Text>
          </View>

          {/* Deep Link */}
          <View style={styles.codeBlock}>
            <View style={styles.codeHeader}>
              <Text style={styles.codeTitle}>Deep Link URL</Text>
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={() => copyToClipboard(generatedCodes.deepLink, 'Deep Link')}
              >
                <Ionicons name="copy" size={16} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.codeText}>{generatedCodes.deepLink}</Text>
          </View>

          {/* Web Link */}
          <View style={styles.codeBlock}>
            <View style={styles.codeHeader}>
              <Text style={styles.codeTitle}>Web URL</Text>
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={() => copyToClipboard(generatedCodes.webLink, 'Web URL')}
              >
                <Ionicons name="copy" size={16} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.codeText}>{generatedCodes.webLink}</Text>
          </View>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
                          <Text style={styles.instructionsText}>
                1. Copy JSON data and create QR code using any QR generator
              </Text>
                          <Text style={styles.instructionsText}>
                2. Place QR code on the table in the cafe
              </Text>
                          <Text style={styles.instructionsText}>
                3. Customers will be able to scan the code and open your cafe menu
              </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: isTablet ? 30 : 20,
  },
  title: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: isTablet ? 25 : 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '500',
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: isTablet ? 15 : 12,
    fontSize: isTablet ? 16 : 14,
    backgroundColor: '#fff',
    color: '#333',
  },
  buttonContainer: {
    marginTop: 10,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#666',
    paddingVertical: isTablet ? 15 : 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: isTablet ? 15 : 12,
    borderRadius: 8,
  },
  demoButtonText: {
    color: '#666',
    fontSize: isTablet ? 16 : 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  resultsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: isTablet ? 25 : 20,
  },
  codeBlock: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: isTablet ? 15 : 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeTitle: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '600',
    color: '#333',
  },
  copyButton: {
    padding: 4,
  },
  codeText: {
    fontSize: isTablet ? 12 : 10,
    color: '#666',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  instructionsContainer: {
    backgroundColor: '#E8F4FD',
    borderRadius: 8,
    padding: isTablet ? 15 : 12,
    marginTop: 10,
  },
  instructionsTitle: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: isTablet ? 12 : 10,
    color: '#666',
    lineHeight: 16,
    marginBottom: 4,
  },
});
