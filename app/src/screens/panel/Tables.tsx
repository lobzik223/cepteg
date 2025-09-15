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
import QRCode from 'react-native-qrcode-svg';

type Table = {
  id: number;
  name: string;      // masa adı: Örn. "Masa 1"
  capacity: number;  // kişi sayısı
};

export default function Tables() {
  const [tables, setTables] = useState<Table[]>([
    { id: 1, name: 'Masa 1', capacity: 4 },
    { id: 2, name: 'Masa 2', capacity: 2 },
  ]);

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [qrModal, setQrModal] = useState<Table | null>(null);

  const [editing, setEditing] = useState<Table | null>(null);
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');

  /** Arama filtresi */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tables.filter(t => t.name.toLowerCase().includes(q));
  }, [search, tables]);

  const openAdd = () => {
    setEditing(null);
    setName('');
    setCapacity('');
    setModalOpen(true);
  };

  const openEdit = (t: Table) => {
    setEditing(t);
    setName(t.name);
    setCapacity(String(t.capacity));
    setModalOpen(true);
  };

  const saveTable = () => {
    if (!name.trim() || !capacity.trim()) return;
    const cap = Number(capacity);
    if (isNaN(cap) || cap < 1) return;

    if (editing) {
      setTables(prev =>
        prev.map(t =>
          t.id === editing.id ? { ...t, name, capacity: cap } : t
        )
      );
    } else {
      setTables(prev => [...prev, { id: Date.now(), name, capacity: cap }]);
    }
    setModalOpen(false);
  };

  const deleteTable = (id: number) =>
    setTables(prev => prev.filter(t => t.id !== id));

  return (
    <View style={s.screen}>
      {/* Başlık + ekleme butonu */}
      <View style={s.headerRow}>
        <Text style={s.title}>Masalar</Text>
        <TouchableOpacity style={s.primaryBtn} onPress={openAdd}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={s.primaryBtnText}>Yeni Masa</Text>
        </TouchableOpacity>
      </View>

      {/* Arama */}
      <View style={s.searchBox}>
        <Ionicons name="search" size={18} color="#9aa1aa" />
        <TextInput
          style={s.input}
          value={search}
          onChangeText={setSearch}
          placeholder="Ara (örn. Masa 1)"
          placeholderTextColor="#9aa1aa"
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#9aa1aa" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Liste */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={filtered.length ? undefined : s.emptyPad}
        ListEmptyComponent={
          <View style={s.emptyCard}>
            <Ionicons name="qr-code-outline" size={30} color="#9aa1aa" />
            <Text style={s.emptyText}>Kayıtlı masa yok</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardLeft}>
              <Ionicons name="restaurant-outline" size={22} color="#374151" />
              <View>
                <Text style={s.cardTitle}>{item.name}</Text>
                <Text style={s.cardSub}>{item.capacity} kişilik</Text>
              </View>
            </View>
            <View style={s.cardActions}>
              <IconBtn name="qr-code-outline" onPress={() => setQrModal(item)} />
              <IconBtn name="create-outline" onPress={() => openEdit(item)} />
              <IconBtn name="trash-outline" color="#ef4444" onPress={() => deleteTable(item.id)} />
            </View>
          </View>
        )}
      />

      {/* Modal: Ekle / Düzenle */}
      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalBox}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{editing ? 'Masa Düzenle' : 'Yeni Masa'}</Text>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <Ionicons name="close" size={22} color="#111" />
              </TouchableOpacity>
            </View>
            <View style={s.modalBody}>
              <Text style={s.label}>Masa Adı</Text>
              <TextInput
                style={s.textField}
                value={name}
                onChangeText={setName}
                placeholder="Örn. Masa 3"
                placeholderTextColor="#9aa1aa"
              />
              <Text style={s.label}>Kapasite (kişi)</Text>
              <TextInput
                style={s.textField}
                value={capacity}
                onChangeText={setCapacity}
                keyboardType="numeric"
                placeholder="Örn. 4"
                placeholderTextColor="#9aa1aa"
              />
            </View>
            <View style={s.modalFooter}>
              <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={() => setModalOpen(false)}>
                <Text style={s.btnGhostText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={saveTable}>
                <Text style={s.btnPrimaryText}>{editing ? 'Güncelle' : 'Ekle'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: QR kod önizleme */}
      <Modal visible={!!qrModal} transparent animationType="fade" onRequestClose={() => setQrModal(null)}>
        <View style={s.modalBackdrop}>
          <View style={s.qrBox}>
            <Text style={s.modalTitle}>QR Kod - {qrModal?.name}</Text>
            {qrModal && (
              <View style={{ marginVertical: 20 }}>
                <QRCode value={`table:${qrModal.id}`} size={180} />
              </View>
            )}
            <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={() => setQrModal(null)}>
              <Text style={s.btnPrimaryText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/** Küçük yardımcı buton */
function IconBtn({ name, color = '#374151', onPress }: { name: keyof typeof Ionicons.glyphMap; color?: string; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={c.iconBtn}>
      <Ionicons name={name} size={20} color={color} />
    </TouchableOpacity>
  );
}

/* ----- Stil ----- */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8f9fa', padding: 16, paddingTop: Platform.select({ ios: 20, android: 16 }) },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: '#111' },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#111', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  primaryBtnText: { color: '#fff', fontWeight: '700' },

  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 12 },
  input: { flex: 1, color: '#111' },

  emptyPad: { paddingTop: 40 },
  emptyCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', padding: 20, borderRadius: 12, alignItems: 'center', gap: 6 },
  emptyText: { fontSize: 14, color: '#6b7280' },

  card: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  cardSub: { fontSize: 13, color: '#6b7280' },
  cardActions: { flexDirection: 'row', gap: 6 },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#111' },
  modalBody: { padding: 14 },
  label: { fontSize: 12, color: '#6b7280', marginBottom: 6, fontWeight: '600' },
  textField: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#111', marginBottom: 12 },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb' },

  btn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  btnGhost: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  btnGhostText: { color: '#111', fontWeight: '700' },
  btnPrimary: { backgroundColor: '#111' },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },

  qrBox: { backgroundColor: '#fff', borderRadius: 14, padding: 20, alignItems: 'center' },
});

const c = StyleSheet.create({
  iconBtn: { padding: 8, borderRadius: 8, backgroundColor: '#f3f4f6' },
});
