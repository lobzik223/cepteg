import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator, Alert, StyleSheet, Text, TextInput,
  TouchableOpacity, View
} from "react-native";
import { useAuth } from "../../context/AuthContext";

type DummyUser = {
  email: string;
  password: string;
  role: "CEPEG_ADMIN" | "RESTAURANT_OWNER" | "RESTAURANT_MANAGER";
  tenantId?: number | null;
  branchId?: number | null;
};

const DUMMY_USERS: DummyUser[] = [
  { email: "admin@cepteg", password: "123456", role: "CEPEG_ADMIN", tenantId: null, branchId: null },
  { email: "owner@demo",  password: "123456", role: "RESTAURANT_OWNER", tenantId: 1, branchId: 1 },
];

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    if (!email || !password) {
      Alert.alert("Eksik bilgi", "E-posta ve parola zorunludur."); return;
    }
    setBusy(true);
    await new Promise(r => setTimeout(r, 400));

    const found = DUMMY_USERS.find(u => u.email === email && u.password === password);
    const demo  = !found && password === "123456"
      ? ({ email, password, role: "RESTAURANT_MANAGER", tenantId: 1, branchId: 1 } as DummyUser)
      : null;

    const user = found || demo;
    if (!user) { setBusy(false); Alert.alert("Giriş başarısız","E-posta ya da parola hatalı."); return; }

    login({ token: "dummy-token", role: user.role, tenantId: user.tenantId ?? null, branchId: user.branchId ?? null });
    setBusy(false);

    // ✅ Expo Router hedefi: app/(tabs)/panel/index.tsx
    router.replace('/panel'); 
  }

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>CeptEg</Text>
      <Text style={styles.title}>Giriş yap</Text>
      <View style={styles.form}>
        <Text style={styles.label}>E-posta</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail}
          autoCapitalize="none" keyboardType="email-address"
          placeholder="mail@ornek.com" placeholderTextColor="#9aa1aa" />
        <Text style={styles.label}>Parola</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword}
          secureTextEntry placeholder="••••••" placeholderTextColor="#9aa1aa" />
        <TouchableOpacity style={[styles.btn, busy && styles.btnDisabled]} onPress={onSubmit} disabled={busy}>
          {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Giriş Yap</Text>}
        </TouchableOpacity>
        <Text style={styles.hint}>Demo: admin@cepteg / 123456 • owner@demo / 123456</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"#f6f7f9", padding:20, justifyContent:"center" },
  brand:{ fontSize:18, fontWeight:"700", color:"#6b7280", textAlign:"center", marginBottom:8 },
  title:{ fontSize:24, fontWeight:"800", color:"#111827", textAlign:"center", marginBottom:16 },
  form:{ gap:10, backgroundColor:"#fff", borderColor:"#e5e7eb", borderWidth:1, borderRadius:12, padding:16 },
  label:{ color:"#6b7280", fontSize:13 },
  input:{ backgroundColor:"#fff", borderWidth:1, borderColor:"#e5e7eb", borderRadius:10,
    paddingVertical:10, paddingHorizontal:12, color:"#111827" },
  btn:{ marginTop:6, backgroundColor:"#111827", paddingVertical:12, borderRadius:10, alignItems:"center" },
  btnDisabled:{ opacity:0.7 },
  btnText:{ color:"#fff", fontWeight:"700" },
  hint:{ color:"#6b7280", textAlign:"center", marginTop:10, fontSize:12, lineHeight:18 },
});
