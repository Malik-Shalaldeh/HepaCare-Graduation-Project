// sami
// جميع التعليقات داخل الكود باللغة العربية فقط.

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function EmptyState({
  icon = "document-text-outline",
  title = "لا توجد بيانات",
  subtitle,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={44} color="#9AA4B2" />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#F0F3F7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    color: "#334155",
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },
});
