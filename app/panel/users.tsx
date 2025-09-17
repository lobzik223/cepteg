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
  View,
} from 'react-native';

type Role = 'Admin' | 'Staff';
type User = { id: number; name: string; email: string; role: Role };

export default function Users() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Emrah Oruç', email: 'emrah@example.com', role: 'Admin' },
    { id: 1, name: 'Maksim Barduk', email: 'maksim@example.com', role: 'Admin' },
    { id: 2, name: 'Merve Kaya', email: 'merve@example.com', role: 'Staff' },
  ]);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | Role>('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('Staff');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const okRole = roleFilter === 'All' ? true : u.role === roleFilter;
      const okQuery =
        q.length > 0
          ? u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
          : true;
      return okRole && okQuery;
    });
  }, [users, search, roleFilter]);

  const openAdd = () => {
    setEditing(null);
    setName('');
    setEmail('');
    setRole('Staff');
    setModalOpen(true);
  };

  const openEdit = (u: User) => {
    setEditing(u);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setModalOpen(true);
  };

  const saveUser = () => {
    if (!name.trim() || !email.trim()) return;
    if (editing) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editing.id ? { ...u, name, email, role } : u
        )
      );
    } else {
      setUsers((prev) => [
        ...prev,
        { id: Date.now(), name, email, role },
      ]);
    }
    setModalOpen(false);
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <View style={s.screen}>
      {/* Üst başlık ve ekle butonu */}
      <View style={s.headerRow}>
        <Text style={s.title}>Kullanıcılar</Text>
        <TouchableOpacity style={s.primaryBtn} onPress={openAdd}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={s.primaryBtnText}>Yeni Kullanıcı</Text>
        </TouchableOpacity>
      </View>

      {/* Arama ve rol filtreleme */}
      <View style={s.controls}>
        <View style={s.searchBox}>
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput
            style={s.input}
            value={search}
            onChangeText={setSearch}
            placeholder="İsim veya email ara"
            placeholderTextColor="#9aa1aa"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#9aa1aa" />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={s.chips}>
          <Chip label="Tümü" active={roleFilter === 'All'} onPress={() => setRoleFilter('All')} />
          <Chip label="Admin" active={roleFilter === 'Admin'} onPress={() => setRoleFilter('Admin')} />
          <Chip label="Staff" active={roleFilter === 'Staff'} onPress={() => setRoleFilter('Staff')} />
        </View>
      </View>

      {/* Liste */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={filtered.length === 0 ? s.emptyListPad : undefined}
        ListEmptyComponent={
          <View style={s.emptyCard}>
            <Ionicons name="person-outline" size={28} color="#9aa1aa" />
            <Text style={s.emptyText}>Kayıt bulunamadı.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardLeft}>
              <Ionicons name="person-circle-outline" size={28} color="#374151" />
              <View style={s.cardTextCol}>
                <Text style={s.cardName}>{item.name}</Text>
                <Text style={s.cardEmail}>{item.email}</Text>
                <Badge label={item.role} tone={item.role === 'Admin' ? 'blue' : 'green'} />
              </View>
            </View>
            <View style={s.cardActions}>
              <IconBtn name="create-outline" onPress={() => openEdit(item)} />
              <IconBtn name="trash-outline" color="#ef4444" onPress={() => deleteUser(item.id)} />
            </View>
          </View>
        )}
      />

      {/* Ekle / Düzenle modal */}
      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{editing ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}</Text>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <Ionicons name="close" size={22} color="#111827" />
              </TouchableOpacity>
            </View>

            <View style={s.modalBody}>
              <Text style={s.label}>İsim</Text>
              <TextInput
                style={s.textField}
                value={name}
                onChangeText={setName}
                placeholder="Örn. Ahmet Yılmaz"
                placeholderTextColor="#9aa1aa"
              />
              <Text style={[s.label, { marginTop: 12 }]}>E-posta</Text>
              <TextInput
                style={s.textField}
                value={email}
                onChangeText={setEmail}
                placeholder="email@ornek.com"
                placeholderTextColor="#9aa1aa"
                keyboardType="email-address"
              />
              <Text style={[s.label, { marginTop: 12 }]}>Rol</Text>
              <View style={s.chips}>
                <Chip label="Admin" active={role === 'Admin'} onPress={() => setRole('Admin')} />
                <Chip label="Staff" active={role === 'Staff'} onPress={() => setRole('Staff')} />
              </View>
            </View>

            <View style={s.modalFooter}>
              <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={() => setModalOpen(false)}>
                <Text style={s.btnGhostText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={saveUser}>
                <Text style={s.btnPrimaryText}>{editing ? 'Güncelle' : 'Ekle'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* Yardımcı mini bileşenler */
function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[c.chip, active && c.chipActive]}>
      <Text style={[c.chipText, active && c.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Badge({ label, tone }: { label: string; tone: 'blue' | 'green' }) {
  const isBlue = tone === 'blue';
  return (
    <View style={[b.badge, isBlue ? b.blue : b.green]}>
      <Text style={[b.badgeText, isBlue ? b.blueText : b.greenText]}>{label}</Text>
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
  input: { flex: 1, color: '#111827' },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },

  emptyListPad: { paddingTop: 40 },
  emptyCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', padding: 20, borderRadius: 12, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#6b7280', marginTop: 4 },

  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', padding: 14, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardTextCol: { gap: 4 },
  cardName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  cardEmail: { fontSize: 13, color: '#6b7280' },
  cardActions: { flexDirection: 'row', gap: 6 },

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
  blue: { backgroundColor: '#dbeafe', borderColor: '#dbeafe' },
  blueText: { color: '#1e3a8a' },
  green: { backgroundColor: '#dcfce7', borderColor: '#dcfce7' },
  greenText: { color: '#065f46' },
});
