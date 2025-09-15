import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Tables() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tables</Text>
      <Text>Masa listesi ve QR kod işlemleri burada yapılacak.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 12 },
});
