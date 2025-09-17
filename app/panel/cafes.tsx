import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

type Cafe = {
  id: number;
  name: string;
  city: string;
  status: 'Active' | 'Inactive';
};

export default function Cafes() {
  const [cafes, setCafes] = useState<Cafe[]>([
    { id: 1, name: 'Bean & Bite', city: 'İzmir', status: 'Active' },
    { id: 2, name: 'Urban Roast', city: 'İstanbul', status: 'Inactive' },
  ]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Cafe | null>(null);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  // Liste filtreleme
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cafes.filter((c) => {
      const okStatus = statusFilter === 'All' ? true : c.status === statusFilter;
      const okQuery = q ? c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) : true;
      return okStatus && okQuery;
    });
  }, [cafes, search, statusFilter]);

  const openAdd = () => {
    setEditing(null);
    setName('');
    setCity('');
    setStatus('Active');
    setModalOpen(true);
  };

  const openEdit = (c: Cafe) => {
    setEditing(c);
    setName(c.name);
    setCity(c.city);
    setStatus(c.status);
    setModalOpen(true);
  };

  const saveCafe = () => {
    if (!name.trim() || !city.trim()) return;
    if (editing) {
      setCafes((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, name, city, status } : c))
      );
    } else {
      setCafes((prev) => [...prev, { id: Date.now(), name, city, status }]);
    }
    setModalOpen(false);
  };

  const deleteCafe = (id: number) => {
    setCafes((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <View style={s.screen}>
      {/* Başlık ve ekle butonu */}
      <View style={s.headerRow}>
        <Text style={s.title}>Kafeler</Text>
        <TouchableOpacity style={s.primaryBtn} onPress={openAdd}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={s.primaryBtnText}>Yeni Kafe</Text>
        </TouchableOpacity>
      </View>

      {/* Arama + filtre */}
      <View style={s.controls}>
        <View style={s.searchBox}>
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput
            style={s.input}
            placeholder="Ara (isim veya şehir)"
            placeholderTextColor="#9aa1aa"
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#9aa1aa" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={s.chips}>
          <Chip label="Tümü" active={statusFilter === 'All'} onPress={() => setStatusFilter('All')} />
          <Chip label="Aktif" active={statusFilter === 'Active'} onPress={() => setStatusFilter('Active')} />
          <Chip label="Pasif" active={statusFilter === 'Inactive'} onPress={() => setStatusFilter('Inactive')} />
        </View>
      </View>

      {/* Liste */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={filtered.length === 0 ? s.emptyListPad : undefined}
        ListEmptyComponent={
          <View style={s.emptyCard}>
            <Ionicons name="cafe-outline" size={28} color="#9aa1aa" />
            <Text style={s.emptyText}>Kayıt bulunamadı.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardLeft}>
              <Ionicons
                name="cafe-outline"
                size={22}
                color={item.status === 'Active' ? '#16a34a' : '#f97316'}
              />
              <View style={s.cardTextCol}>
                <Text style={s.cardTitle}>{item.name}</Text>
                <Text style={s.cardSub}>{item.city}</Text>
                <Badge label={item.status} tone={item.status === 'Active' ? 'green' : 'amber'} />
              </View>
            </View>
            <View style={s.cardActions}>
              <IconBtn name="create-outline" onPress={() => openEdit(item)} />
              <IconBtn name="trash-outline" color="#ef4444" onPress={() => deleteCafe(item.id)} />
            </View>
          </View>
        )}
      />

      {/* Ekle/Düzenle Modal */}
      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{editing ? 'Kafe Düzenle' : 'Yeni Kafe'}</Text>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <Ionicons name="close" size={22} color="#111827" />
              </TouchableOpacity>
            </View>

            <View style={s.modalBody}>
              <Text style={s.label}>Kafe Adı</Text>
              <TextInput style={s.textField} value={name} onChangeText={setName} />

              <Text style={[s.label, { marginTop: 12 }]}>Şehir</Text>
              <TextInput style={s.textField} value={city} onChangeText={setCity} />

              <Text style={[s.label, { marginTop: 12 }]}>Durum</Text>
              <View style={s.chips}>
                <Chip label="Aktif" active={status === 'Active'} onPress={() => setStatus('Active')} />
                <Chip label="Pasif" active={status === 'Inactive'} onPress={() => setStatus('Inactive')} />
              </View>
            </View>

            <View style={s.modalFooter}>
              <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={() => setModalOpen(false)}>
                <Text style={s.btnGhostText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={saveCafe}>
                <Text style={s.btnPrimaryText}>{editing ? 'Güncelle' : 'Ekle'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* Küçük bileşenler */
function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[c.chip, active && c.chipActive]}>
      <Text style={[c.chipText, active && c.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Badge({ label, tone }: { label: string; tone: 'green' | 'amber' }) {
  const isGreen = tone === 'green';
  return (
    <View style={[b.badge, isGreen ? b.green : b.amber]}>
      <Text style={[b.badgeText, isGreen ? b.greenText : b.amberText]}>{label}</Text>
    </View>
  );
}

function IconBtn({ name, color = '#374151', onPress }: { name: keyof typeof Ionicons.glyphMap; color?: string; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={c.iconBtn}>
      <Ionicons name={name} size={20} color={color} />
    </TouchableOpacity>
  );
}

/* Stil */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8f9fa', padding: 16, paddingTop: Platform.select({ ios: 20, android: 16 }) },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827' },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#111827', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  primaryBtnText: { color: '#fff', fontWeight: '700' },

  controls: { gap: 10, marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  input: { flex: 1, color: '#111827', paddingVertical: 4 },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },

  emptyListPad: { paddingTop: 40 },
  emptyCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', padding: 20, borderRadius: 12, alignItems: 'center', gap: 6 },
  emptyText: { fontSize: 14, color: '#6b7280', marginTop: 4 },

  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', padding: 14, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardTextCol: { gap: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  cardSub: { fontSize: 14, color: '#6b7280' },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eef0f3' },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  modalBody: { padding: 14 },
  label: { fontSize: 12, color: '#6b7280', marginBottom: 6, fontWeight: '600' },
  textField: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#111827' },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: '#eef0f3' },
  btn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  btnGhost: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  btnGhostText: { color: '#111827', fontWeight: '700' },
  btnPrimary: { backgroundColor: '#111827' },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },
});

const c = StyleSheet.create({
  chip: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  chipActive: { backgroundColor: '#111827', borderColor: '#111827' },
  chipText: { color: '#111827', fontWeight: '700', fontSize: 12 },
  chipTextActive: { color: '#fff' },
  iconBtn: { padding: 8, borderRadius: 8, backgroundColor: '#f3f4f6' },
});

const b = StyleSheet.create({
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  green: { backgroundColor: '#dcfce7', borderColor: '#dcfce7' },
  greenText: { color: '#065f46' },
  amber: { backgroundColor: '#fef3c7', borderColor: '#fef3c7' },
  amberText: { color: '#92400e' },
});
