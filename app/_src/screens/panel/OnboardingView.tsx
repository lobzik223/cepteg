import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function OnboardingView({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CeptEg Onboarding</Text>
      <Text style={styles.text}>
        Restoran/kafe ve CeptEg yöneticileri için panelinizi birkaç adımda kurun.
      </Text>
      <Button title="Devam Et (Girişe Git)" onPress={() => navigation.replace("Login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0e14", alignItems: "center", justifyContent: "center", padding: 24, gap: 16 },
  title: { color: "#e8e8e8", fontSize: 26, fontWeight: "800" },
  text: { color: "#cbd5e1", textAlign: "center" },
});
