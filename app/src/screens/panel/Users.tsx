import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Users() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>
      <Text>Kullanıcı ekleme, rol atama ve düzenleme burada olacak.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 12 },
});
