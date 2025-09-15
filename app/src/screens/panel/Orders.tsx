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

type OrderStatus = 'Bekliyor' | 'Hazırlanıyor' | 'Servis Edildi';

type Order = {
  id: number;
  tableName: string;
  items: string;
  status: OrderStatus;
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([
    { id: 1, tableName: 'Masa 1', items: '2x Latte', status: 'Bekliyor' },
    { id: 2, tableName: 'Masa 2', items: '1x Kahvaltı Tabağı', status: 'Hazırlanıyor' },
  ]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Tümü' | OrderStatus>('Tümü');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
  const [tableName, setTableName] = useState('');
  const [items, setItems] = useState('');
  const [status, setStatus] = useState<OrderStatus>('Bekliyor');

  /** Filtreleme */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter(o => {
      const okStatus = statusFilter === 'Tümü' ? true : o.status === statusFilter;
      const okQuery =
        q.length === 0 ||
        o.tableName.toLowerCase().includes(q) ||
        o.items.toLowerCase().includes(q);
      return okStatus && okQuery;
    });
  }, [orders, search, statusFilter]);

  const openAdd = () => {
    setEditing(null);
    setTableName('');
    setItems('');
    setStatus('Bekliyor');
    setModalOpen(true);
  };

  const openEdit = (o: Order) => {
    setEditing(o);
    setTableName(o.tableName);
    setItems(o.items);
    setStatus(o.status);
    setModalOpen(true);
  };

  const saveOrder = () => {
    if (!tableName.trim() || !items.trim()) return;

    if (editing) {
      setOrders(prev =>
        prev.map(o =>
          o.id === editing.id
            ? { ...o, tableName, items, status }
            : o
        )
      );
    } else {
      setOrders(prev => [
        ...prev,
        { id: Date.now(), tableName, items, status },
      ]);
    }
    setModalOpen(false);
  };

  const deleteOrder = (id: number) =>
    setOrders(prev => prev.filter(o => o.id !== id));

  /** Durum geçişi (kısayol) */
  const cycleStatus = (o: Order) => {
    const order = orders.find(x => x.id === o.id);
    if (!order) return;
    const next: OrderStatus =
      order.status === 'Bekliyor'
        ? 'Hazırlanıyor'
        : order.status === 'Hazırlanıyor'
        ? 'Servis Edildi'
        : 'Bekliyor';
    setOrders(prev => prev.map(x => (x.id === o.id ? { ...x, status: next } : x)));
  };

  return (
    <View style={s.screen}>
      {/* Başlık + ekleme */}
      <View style={s.headerRow}>
        <Text style={s.title}>Siparişler</Text>
        <TouchableOpacity style={s.primaryBtn} onPress={openAdd}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={s.primaryBtnText}>Yeni Sipariş</Text>
        </TouchableOpacity>
      </View>

      {/* Arama ve filtre */}
      <View style={s.controls}>
        <View style={s.searchBox}>
          <Ionicons name="search" size={18} color="#9aa1aa" />
          <TextInput
            style={s.input}
            value={search}
            onChangeText={setSearch}
            placeholder="Ara (masa veya ürün)"
            placeholderTextColor="#9aa1aa"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#9aa1aa" />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={s.chips}>
          <Chip label="Tümü" active={statusFilter === 'Tümü'} onPress={() => setStatusFilter('Tümü')} />
          <Chip label="Bekliyor" active={statusFilter === 'Bekliyor'} onPress={() => setStatusFilter('Bekliyor')} />
          <Chip label="Hazırlanıyor" active={statusFilter === 'Hazırlanıyor'} onPress={() => setStatusFilter('Hazırlanıyor')} />
          <Chip label="Servis Edildi" active={statusFilter === 'Servis Edildi'} onPress={() => setStatusFilter('Servis Edildi')} />
        </View>
      </View>

      {/* Liste */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={filtered.length === 0 ? s.emptyPad : undefined}
        ListEmptyComponent={
          <View style={s.emptyCard}>
            <Ionicons name="fast-food-outline" size={30} color="#9aa1aa" />
            <Text style={s.emptyText}>Kayıtlı sipariş yok</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardLeft}>
              <Ionicons name="restaurant-outline" size={22} color="#374151" />
              <View>
                <Text style={s.cardTitle}>{item.tableName}</Text>
                <Text style={s.cardSub}>{item.items}</Text>
                <StatusBadge status={item.status} />
              </View>
            </View>
            <View style={s.cardActions}>
              <IconBtn name="swap-horizontal" onPress={() => cycleStatus(item)} />
              <IconBtn name="create-outline" onPress={() => openEdit(item)} />
              <IconBtn name="trash-outline" color="#ef4444" onPress={() => deleteOrder(item.id)} />
            </View>
          </View>
        )}
      />

      {/* Modal: Ekle / Düzenle */}
      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalBox}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{editing ? 'Sipariş Düzenle' : 'Yeni Sipariş'}</Text>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <Ionicons name="close" size={22} color="#111" />
              </TouchableOpacity>
            </View>

            <View style={s.modalBody}>
              <Text style={s.label}>Masa Adı</Text>
              <TextInput
                style={s.textField}
                value={tableName}
                onChangeText={setTableName}
                placeholder="Örn. Masa 5"
                placeholderTextColor="#9aa1aa"
              />

              <Text style={s.label}>Sipariş Kalemleri</Text>
              <TextInput
                style={s.textField}
                value={items}
                onChangeText={setItems}
                placeholder="Örn. 1x Latte, 1x Su"
                placeholderTextColor="#9aa1aa"
              />

              <Text style={s.label}>Durum</Text>
              <View style={s.chips}>
                <Chip label="Bekliyor" active={status === 'Bekliyor'} onPress={() => setStatus('Bekliyor')} />
                <Chip label="Hazırlanıyor" active={status === 'Hazırlanıyor'} onPress={() => setStatus('Hazırlanıyor')} />
                <Chip label="Servis Edildi" active={status === 'Servis Edildi'} onPress={() => setStatus('Servis Edildi')} />
              </View>
            </View>

            <View style={s.modalFooter}>
              <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={() => setModalOpen(false)}>
                <Text style={s.btnGhostText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={saveOrder}>
                <Text style={s.btnPrimaryText}>{editing ? 'Güncelle' : 'Ekle'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---- Küçük bileşenler ---- */
function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[c.chip, active && c.chipActive]}>
      <Text style={[c.chipText, active && c.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const style =
    status === 'Bekliyor'
      ? { bg: '#fef3c7', text: '#92400e' }
      : status === 'Hazırlanıyor'
      ? { bg: '#dbeafe', text: '#1e3a8a' }
      : { bg: '#dcfce7', text: '#065f46' };
  return (
    <View style={[b.badge, { backgroundColor: style.bg }]}>
      <Text style={[b.badgeText, { color: style.text }]}>{status}</Text>
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

/* ---- Stil ---- */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8f9fa', padding: 16, paddingTop: Platform.select({ ios: 20, android: 16 }) },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: '#111' },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#111', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  primaryBtnText: { color: '#fff', fontWeight: '700' },

  controls: { gap: 10, marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  input: { flex: 1, color: '#111' },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },

  emptyPad: { paddingTop: 40 },
  emptyCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', padding: 20, borderRadius: 12, alignItems: 'center', gap: 6 },
  emptyText: { fontSize: 14, color: '#6b7280' },

  card: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#e5e7eb' },
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
});

const c = StyleSheet.create({
  chip: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  chipActive: { backgroundColor: '#111', borderColor: '#111' },
  chipText: { color: '#111', fontWeight: '700', fontSize: 12 },
  chipTextActive: { color: '#fff' },
  iconBtn: { padding: 8, borderRadius: 8, backgroundColor: '#f3f4f6' },
});

const b = StyleSheet.create({
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  badgeText: { fontSize: 11, fontWeight: '700' },
});
