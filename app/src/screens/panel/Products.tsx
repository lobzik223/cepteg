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
type Product = { id: number; name: string; price: number; category: CategoryType };

export default function Products() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Latte', price: 65, category: 'Coffee' },
    { id: 2, name: 'Kahvaltı Tabağı', price: 140, category: 'Restaurant' },
  ]);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | CategoryType>('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<CategoryType>('Coffee');

  /** Filtreleme: hem arama hem kategori */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchName = !q || p.name.toLowerCase().includes(q);
      return matchCat && matchName;
    });
  }, [products, search, categoryFilter]);

  const openAdd = () => {
    setEditing(null);
    setName('');
    setPrice('');
    setCategory('Coffee');
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setName(p.name);
    setPrice(String(p.price));
    setCategory(p.category);
    setModalOpen(true);
  };

  const saveProduct = () => {
    if (!name.trim() || !price.trim()) return;
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) return;

    if (editing) {
      setProducts(prev =>
        prev.map(prod => prod.id === editing.id
          ? { ...prod, name, price: numericPrice, category }
          : prod)
      );
    } else {
      setProducts(prev => [...prev, { id: Date.now(), name, price: numericPrice, category }]);
    }
    setModalOpen(false);
  };

  const deleteProduct = (id: number) =>
    setProducts(prev => prev.filter(p => p.id !== id));

  return (
    <View style={s.screen}>
      {/* Üst başlık ve ekleme */}
      <View style={s.headerRow}>
        <Text style={s.title}>Ürünler</Text>
        <TouchableOpacity style={s.addBtn} onPress={openAdd}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={s.addBtnText}>Yeni Ürün</Text>
        </TouchableOpacity>
      </View>

      {/* Arama ve kategori filtresi */}
      <View style={s.controls}>
        <View style={s.searchBox}>
          <Ionicons name="search" size={18} color="#9aa1aa" />
          <TextInput
            style={s.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Ara (örn. Latte)"
            placeholderTextColor="#9aa1aa"
          />
          {search !== '' && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#9aa1aa" />
            </TouchableOpacity>
          )}
        </View>
        <View style={s.chipRow}>
          <Chip label="Tümü" active={categoryFilter === 'All'} onPress={() => setCategoryFilter('All')} />
          <Chip label="Coffee" active={categoryFilter === 'Coffee'} onPress={() => setCategoryFilter('Coffee')} />
          <Chip label="Restaurant" active={categoryFilter === 'Restaurant'} onPress={() => setCategoryFilter('Restaurant')} />
        </View>
      </View>

      {/* Liste */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={filtered.length ? undefined : s.emptyPad}
        ListEmptyComponent={
          <View style={s.emptyCard}>
            <Ionicons name="cafe-outline" size={30} color="#9aa1aa" />
            <Text style={s.emptyText}>Kayıt bulunamadı</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardLeft}>
              <Ionicons
                name={item.category === 'Coffee' ? 'cafe-outline' : 'restaurant-outline'}
                size={22}
                color="#374151"
              />
              <View>
                <Text style={s.cardTitle}>{item.name}</Text>
                <Text style={s.cardPrice}>{item.price.toFixed(2)} ₺</Text>
                <Badge tone={item.category === 'Coffee' ? 'amber' : 'green'}>{item.category}</Badge>
              </View>
            </View>
            <View style={s.cardActions}>
              <IconBtn name="create-outline" onPress={() => openEdit(item)} />
              <IconBtn name="trash-outline" color="#ef4444" onPress={() => deleteProduct(item.id)} />
            </View>
          </View>
        )}
      />

      {/* Modal: Ekle / Düzenle */}
      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalBox}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{editing ? 'Ürün Düzenle' : 'Yeni Ürün'}</Text>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <Ionicons name="close" size={22} color="#111" />
              </TouchableOpacity>
            </View>
            <View style={s.modalBody}>
              <Text style={s.label}>Ürün Adı</Text>
              <TextInput
                style={s.input}
                value={name}
                onChangeText={setName}
                placeholder="Örn. Cappuccino"
                placeholderTextColor="#9aa1aa"
              />
              <Text style={s.label}>Fiyat (₺)</Text>
              <TextInput
                style={s.input}
                value={price}
                onChangeText={setPrice}
                placeholder="Örn. 60"
                keyboardType="numeric"
                placeholderTextColor="#9aa1aa"
              />
              <Text style={s.label}>Kategori</Text>
              <View style={s.chipRow}>
                <Chip label="Coffee" active={category === 'Coffee'} onPress={() => setCategory('Coffee')} />
                <Chip label="Restaurant" active={category === 'Restaurant'} onPress={() => setCategory('Restaurant')} />
              </View>
            </View>
            <View style={s.modalFooter}>
              <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={() => setModalOpen(false)}>
                <Text style={s.btnGhostText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={saveProduct}>
                <Text style={s.btnPrimaryText}>{editing ? 'Güncelle' : 'Ekle'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ----- Küçük bileşenler ----- */
function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[chip.chip, active && chip.active]}>
      <Text style={[chip.text, active && chip.textActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Badge({ tone, children }: { tone: 'amber' | 'green'; children: React.ReactNode }) {
  return (
    <View style={[badge.base, tone === 'amber' ? badge.amber : badge.green]}>
      <Text style={[badge.text, tone === 'amber' ? badge.amberText : badge.greenText]}>
        {children}
      </Text>
    </View>
  );
}

function IconBtn({ name, color = '#374151', onPress }: { name: keyof typeof Ionicons.glyphMap; color?: string; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={chip.iconBtn}>
      <Ionicons name={name} size={20} color={color} />
    </TouchableOpacity>
  );
}

/* ----- Stil ----- */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8f9fa', padding: 16, paddingTop: Platform.select({ ios: 20, android: 16 }) },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: '#111' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#111', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  addBtnText: { color: '#fff', fontWeight: '700' },

  controls: { gap: 10, marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  searchInput: { flex: 1, color: '#111' },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },

  emptyPad: { paddingTop: 40 },
  emptyCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center', gap: 6, borderColor: '#e5e7eb', borderWidth: 1 },
  emptyText: { fontSize: 14, color: '#6b7280' },

  card: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderColor: '#e5e7eb', borderWidth: 1 },
  cardLeft: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  cardPrice: { fontSize: 14, color: '#6b7280', marginBottom: 2 },
  cardActions: { flexDirection: 'row', gap: 6 },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#111' },
  modalBody: { padding: 14 },
  label: { fontSize: 12, color: '#6b7280', marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#111', marginBottom: 12 },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  btn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  btnGhost: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  btnGhostText: { color: '#111', fontWeight: '700' },
  btnPrimary: { backgroundColor: '#111' },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },
});

const chip = StyleSheet.create({
  chip: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  active: { backgroundColor: '#111', borderColor: '#111' },
  text: { color: '#111', fontWeight: '700', fontSize: 12 },
  textActive: { color: '#fff' },
  iconBtn: { padding: 8, borderRadius: 8, backgroundColor: '#f3f4f6' },
});

const badge = StyleSheet.create({
  base: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  text: { fontSize: 11, fontWeight: '700' },
  amber: { backgroundColor: '#fef3c7', borderColor: '#fef3c7' },
  amberText: { color: '#92400e' },
  green: { backgroundColor: '#dcfce7', borderColor: '#dcfce7' },
  greenText: { color: '#065f46' },
});
