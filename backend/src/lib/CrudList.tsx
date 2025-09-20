// src/components/CrudList.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Field =
  | { key: string; label: string; type: 'text'; placeholder?: string; required?: boolean }
  | { key: string; label: string; type: 'select'; options: { label: string; value: string }[]; required?: boolean };

type Props<T extends { id: string | number }> = {
  title: string;
  rows: T[];
  loading?: boolean;
  q: string;
  setQ: (v: string) => void;
  filters?: { key: string; label: string; options: { label: string; value: string }[] };
  setFilter?: (key: string, v: string) => void;
  onAdd: (data: Omit<T, 'id'>) => Promise<any> | void;
  onUpdate: (id: T['id'], data: Partial<Omit<T, 'id'>>) => Promise<any> | void;
  onDelete: (id: T['id']) => Promise<any> | void;
  fields: Field[];
  renderLeft?: (row: T) => React.ReactNode; // satır sol taraf (ikon vs.)
  renderSubtitle?: (row: T) => React.ReactNode; // küçük rozet/alt bilgi
};

export function CrudList<T extends { id: string | number }>(props: Props<T>) {
  const { title, rows, loading, q, setQ, filters, setFilter, onAdd, onUpdate, onDelete, fields, renderLeft, renderSubtitle } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  const filtered = useMemo(() => rows, [rows]); // arama/filtreyi üst hook yaptıysa burada sadece göster

  const openAdd = () => { setEditing(null); setForm({}); setModalOpen(true); };
  const openEdit = (row: T) => { setEditing(row); setForm(row as any); setModalOpen(true); };

  const save = async () => {
    // basit required kontrolü
    for (const f of fields) {
      if (f.required && !String(form[f.key] ?? '').trim()) return;
    }
    if (editing) await onUpdate(editing.id, form);
    else await onAdd(form as any);
    setModalOpen(false);
  };

  return (
    <View style={s.screen}>
      <View style={s.headerRow}>
        <Text style={s.title}>{title}</Text>
        <TouchableOpacity style={s.primaryBtn} onPress={openAdd}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={s.primaryBtnText}>Yeni</Text>
        </TouchableOpacity>
      </View>

      <View style={s.controls}>
        <View style={s.searchBox}>
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput
            style={s.input}
            value={q}
            onChangeText={setQ}
            placeholder="Ara"
            placeholderTextColor="#9aa1aa"
            returnKeyType="search"
          />
          {q ? (
            <TouchableOpacity onPress={() => setQ('')} style={s.clearIcon}>
              <Ionicons name="close-circle" size={18} color="#9aa1aa" />
            </TouchableOpacity>
          ) : null}
        </View>

        {filters && setFilter ? (
          <View style={s.chips}>
            {filters.options.map(opt => (
              <TouchableOpacity key={opt.value}
                onPress={() => setFilter(filters.key, opt.value)}
                style={[c.chip, (opt.value === (rows as any).filterVal) ? c.chipActive : null]}>
                <Text style={[c.chipText, (opt.value === (rows as any).filterVal) ? c.chipTextActive : null]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(it) => String(it.id)}
        contentContainerStyle={filtered.length === 0 ? s.emptyListPad : undefined}
        ListEmptyComponent={
          <View style={s.emptyCard}>
            <Ionicons name="list-outline" size={28} color="#9aa1aa" />
            <Text style={s.emptyText}>{loading ? 'Yükleniyor...' : 'Kayıt yok.'}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardLeft}>
              {renderLeft?.(item)}
              <View style={s.cardTextCol}>
                <Text style={s.cardTitle}>{(item as any).name ?? (item as any).title ?? `#${item.id}`}</Text>
                {renderSubtitle?.(item)}
              </View>
            </View>
            <View style={s.cardActions}>
              <TouchableOpacity onPress={() => openEdit(item)} style={c.iconBtn}>
                <Ionicons name="create-outline" size={20} color="#374151" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete(item.id)} style={c.iconBtn}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Add/Edit Modal (alan tanımlarından form üretir) */}
      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{editing ? 'Düzenle' : 'Yeni Kayıt'}</Text>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <Ionicons name="close" size={22} color="#111827" />
              </TouchableOpacity>
            </View>

            <View style={s.modalBody}>
              {fields.map((f) => {
                if (f.type === 'text') {
                  return (
                    <View key={f.key} style={{ marginBottom: 10 }}>
                      <Text style={s.label}>{f.label}</Text>
                      <TextInput
                        style={s.textField}
                        placeholder={f.placeholder}
                        placeholderTextColor="#9aa1aa"
                        value={String(form[f.key] ?? '')}
                        onChangeText={(t) => setForm((p) => ({ ...p, [f.key]: t }))}
                      />
                    </View>
                  );
                }
                if (f.type === 'select') {
                  return (
                    <View key={f.key} style={{ marginBottom: 10 }}>
                      <Text style={s.label}>{f.label}</Text>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        {f.options.map(opt => (
                          <TouchableOpacity key={opt.value} onPress={() => setForm(p => ({ ...p, [f.key]: opt.value }))} style={[c.chip, (form[f.key] === opt.value) ? c.chipActive : null]}>
                            <Text style={[c.chipText, (form[f.key] === opt.value) ? c.chipTextActive : null]}>{opt.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  );
                }
                return null;
              })}
            </View>

            <View style={s.modalFooter}>
              <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={() => setModalOpen(false)}>
                <Text style={s.btnGhostText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={save}>
                <Text style={s.btnPrimaryText}>{editing ? 'Güncelle' : 'Ekle'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
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
  emptyText: { fontSize: 14, color: '#6b7280', marginTop: 4 },

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
