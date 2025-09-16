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


type CategoryType = 'Coffee' | 'Restaurant';
type Category = { id: number; name: string; type: CategoryType };

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Espresso Bazlı', type: 'Coffee' },
    { id: 2, name: 'Kahvaltı Menüsü', type: 'Restaurant' },
  ]);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | CategoryType>('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<CategoryType>('Coffee');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return categories.filter((c) => {
      const okType = typeFilter === 'All' ? true : c.type === typeFilter;
      const okQuery = q ? c.name.toLowerCase().includes(q) : true;
      return okType && okQuery;
    });
  }, [categories, search, typeFilter]);

  const openAdd = () => {
    setEditing(null);
    setName('');
    setType('Coffee');
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setType(cat.type);
    setModalOpen(true);
  };

  const saveCategory = () => {
    if (!name.trim()) return; // dilersen Toast ekleyebilirsin
    if (editing) {
      setCategories(prev => prev.map(c => c.id === editing.id ? { ...c, name, type } : c));
    } else {
      setCategories(prev => [...prev, { id: Date.now(), name, type }]);
    }
    setModalOpen(false);
  };

  const deleteCategory = (id: number) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const clearSearch = () => setSearch('');

  return (
    <View style={s.screen}>
      {/* Başlık + Ekle */}
      <View style={s.headerRow}>
  <Text style={s.title}>Kategoriler</Text>
  <TouchableOpacity style={s.primaryBtn} onPress={openAdd}>
    <Ionicons name="add" size={18} color="#fff" />
    <Text style={s.primaryBtnText}>Yeni Kategori</Text>
  </TouchableOpacity>
</View>


      {/* Arama + Filtre */}
      <View style={s.controls}>
        <View style={s.searchBox}>
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput
            style={s.input}
            value={search}
            onChangeText={setSearch}
            placeholder="Ara (ör. Espresso)"
            placeholderTextColor="#9aa1aa"
            returnKeyType="search"
          />
          {search ? (
            <TouchableOpacity onPress={clearSearch} style={s.clearIcon}>
              <Ionicons name="close-circle" size={18} color="#9aa1aa" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={s.chips}>
          <Chip label="Tümü" active={typeFilter === 'All'} onPress={() => setTypeFilter('All')} />
          <Chip label="Coffee" active={typeFilter === 'Coffee'} onPress={() => setTypeFilter('Coffee')} />
          <Chip label="Restaurant" active={typeFilter === 'Restaurant'} onPress={() => setTypeFilter('Restaurant')} />
        </View>
      </View>

      {/* Liste / Boş durum */}
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
                name={item.type === 'Coffee' ? 'cafe-outline' : 'restaurant-outline'}
                size={22}
                color="#374151"
              />
              <View style={s.cardTextCol}>
                <Text style={s.cardTitle}>{item.name}</Text>
                <Badge label={item.type} tone={item.type === 'Coffee' ? 'amber' : 'green'} />
              </View>
            </View>
            <View style={s.cardActions}>
              <IconBtn name="create-outline" onPress={() => openEdit(item)} />
              <IconBtn name="trash-outline" color="#ef4444" onPress={() => deleteCategory(item.id)} />
            </View>
          </View>
        )}
      />

      {/* Ekle / Düzenle Modal */}
      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{editing ? 'Kategori Düzenle' : 'Yeni Kategori'}</Text>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <Ionicons name="close" size={22} color="#111827" />
              </TouchableOpacity>
            </View>

            <View style={s.modalBody}>
              <Text style={s.label}>Kategori adı</Text>
              <TextInput
                style={s.textField}
                value={name}
                onChangeText={setName}
                placeholder="Örn. Soğuk İçecekler"
                placeholderTextColor="#9aa1aa"
                autoFocus
              />

              <Text style={[s.label, { marginTop: 12 }]}>Tür</Text>
<View style={s.row}>
  <TouchableOpacity
    style={s.radioItem}
    onPress={() => setType('Coffee')}
  >
    <Ionicons
      name={type === 'Coffee' ? 'radio-button-on' : 'radio-button-off'}
      size={20}
      color="#111827"
    />
    <Text style={s.radioText}>Coffee</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={s.radioItem}
    onPress={() => setType('Restaurant')}
  >
    <Ionicons
      name={type === 'Restaurant' ? 'radio-button-on' : 'radio-button-off'}
      size={20}
      color="#111827"
    />
    <Text style={s.radioText}>Restaurant</Text>
  </TouchableOpacity>
</View>
            </View>

            <View style={s.modalFooter}>
              <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={() => setModalOpen(false)}>
                <Text style={s.btnGhostText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={saveCategory}>
                <Text style={s.btnPrimaryText}>{editing ? 'Güncelle' : 'Ekle'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ------- Küçük yardımcı görsel bileşenler ------- */
function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[c.chip, active ? c.chipActive : null]}>
      <Text style={[c.chipText, active ? c.chipTextActive : null]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Badge({ label, tone }: { label: string; tone: 'amber' | 'green' }) {
  const bgStyle = tone === 'amber' ? b.amberBg : b.greenBg;
  const textStyle = tone === 'amber' ? b.amberText : b.greenText;
  return (
    <View style={[b.badge, bgStyle]}>
      <Text style={[b.badgeText, textStyle]}>{label}</Text>
    </View>
  );
}

function IconBtn({ name, color = '#374151', onPress }: { name: keyof typeof Ionicons.glyphMap; color?: string; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={c.iconBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
      <Ionicons name={name} size={20} color={color} />
    </TouchableOpacity>
  );
}

/* ------- Stil ------- */
const s = StyleSheet.create({
  radioItem: {
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: 16,
},
radioText: {
  marginLeft: 6,
  fontSize: 14,
  color: '#111827',
},
  screen: { flex: 1, backgroundColor: '#f8f9fa', padding: 16, paddingTop: Platform.select({ ios: 20, android: 16 }) },
  headerRow: { flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between',  marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827' },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#111827', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  primaryBtnText: { color: '#fff', fontWeight: '700' },

  controls: { gap: 10, marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  input: { flex: 1, color: '#111827', paddingVertical: 4 },
  clearIcon: { marginLeft: 4 },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  
  emptyListPad: { paddingTop: 40 },
  emptyCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', padding: 20, borderRadius: 12, alignItems: 'center', gap: 6 },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', padding: 14, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardTextCol: { gap: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eef0f3' },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  modalBody: { padding: 14 },
  label: { fontSize: 12, color: '#6b7280', marginBottom: 6, fontWeight: '600' },
  textField: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#111827' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
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
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  amberBg: { backgroundColor: '#fef3c7' },
  amberText: { color: '#92400e' },
  greenBg: { backgroundColor: '#dcfce7' },
  greenText: { color: '#065f46' },
});
