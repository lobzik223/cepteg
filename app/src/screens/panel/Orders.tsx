import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Orders() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>
      <Text>Sipariş takibi ve yönetimi bu ekranda yapılacak.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 12 },
});
