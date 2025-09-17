import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function cashboard() {
  const revenueData = [12, 19, 15, 25, 30, 40, 38]; // Örnek aylık gelir
  const ordersData = [20, 35, 40, 30, 50, 60, 45];  // Örnek sipariş grafiği

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Başlık */}

      {/* Özet Kartlar */}
      <View style={styles.cardsGrid}>
        <SummaryCard icon="people-outline" title="Aktif Kullanıcı" value="1,254" color="#3b82f6" />
        <SummaryCard icon="cart-outline" title="Toplam Sipariş" value="532" color="#10b981" />
        <SummaryCard icon="cash-outline" title="Aylık Gelir" value="₺48,200" color="#f59e0b" />
        <SummaryCard icon="alert-circle-outline" title="Bekleyen İstek" value="8" color="#ef4444" />
      </View>

      {/* Grafik Alanları */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Aylık Gelir Grafiği</Text>
        <LineChart
          data={{
            labels: ['Ocak', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem'],
            datasets: [{ data: revenueData }],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="₺"
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Haftalık Sipariş Grafiği</Text>
        <BarChart
  data={{
    labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts', 'Paz'],
    datasets: [{ data: ordersData }],
  }}
  width={screenWidth - 40}
  height={220}
  yAxisLabel=""       // ← eklendi
  yAxisSuffix=" adet" // ← eklendi
  chartConfig={chartConfig}
  style={styles.chart}
/>

      </View>

      {/* Son Güncellemeler */}
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

/* --- Chart Config --- */
const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
  labelColor: () => '#6b7280',
  strokeWidth: 2,
  barPercentage: 0.6,
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#3b82f6',
  },
};

/* --- Stil --- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContent: { padding: 20 },

  pageTitle: { fontSize: 28, fontWeight: '700', marginBottom: 4, color: '#111827' },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 24 },

  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 24,
  },
  card: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  cardIcon: { marginRight: 12 },
  cardTitle: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  cardValue: { fontSize: 20, fontWeight: '700', color: '#111827', marginTop: 4 },

  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chartTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12 },
  chart: { borderRadius: 12 },

  section: { marginTop: 12, backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: '#111827' },
  sectionText: { fontSize: 14, color: '#374151', lineHeight: 20 },
});

