import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Dashboard() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Başlık */}
      <Text style={styles.subtitle}>Genel durum ve özet metrikler burada gösterilecek.</Text>

      {/* Özet Kartları */}
      <View style={styles.cardsRow}>
        <SummaryCard
          icon="people-outline"
          title="Aktif Kullanıcı"
          value="1,254"
          color="#3b82f6"
        />
        <SummaryCard
          icon="cart-outline"
          title="Toplam Sipariş"
          value="532"
          color="#10b981"
        />
      </View>

      <View style={styles.cardsRow}>
        <SummaryCard
          icon="cash-outline"
          title="Aylık Gelir"
          value="₺48,200"
          color="#f59e0b"
        />
        <SummaryCard
          icon="alert-circle-outline"
          title="Bekleyen İstek"
          value="8"
          color="#ef4444"
        />
      </View>

      {/* Alt bilgi */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Son Güncellemeler</Text>
        <Text style={styles.sectionText}>
          - Yeni restoran kaydı onaylandı{'\n'}
          - 3 kritik hata giderildi{'\n'}
          - Yeni kampanya başladı
        </Text>
      </View>
    </ScrollView>
  );
}

function SummaryCard({
  icon,
  title,
  value,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  color: string;
}) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Ionicons name={icon} size={28} color={color} style={styles.cardIcon} />
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContent: { padding: 20 },
  pageTitle: { fontSize: 28, fontWeight: '700', marginBottom: 6, color: '#111827' },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 20 },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    elevation: 2, // Android gölge
    shadowColor: '#000', // iOS gölge
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardIcon: { marginRight: 12 },
  cardTitle: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  cardValue: { fontSize: 20, fontWeight: '700', color: '#111827', marginTop: 4 },
  section: { marginTop: 24, backgroundColor: '#fff', padding: 16, borderRadius: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#111827' },
  sectionText: { fontSize: 14, color: '#374151', lineHeight: 20 },
});
