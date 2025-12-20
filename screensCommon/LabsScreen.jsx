// سامي - واجهة المختبرات المعتمدة - Refactored to Malik-style

import React, { useState, useEffect } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import {
  colors,
  spacing,
  radii,
  typography,
  shadows,
} from "../style/theme";
import ENDPOINTS from "../samiendpoint";

const LabsScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // state
  const [search, setSearch] = useState("");
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // load data on focus
  useEffect(() => {
    if (isFocused) {
      fetchLabs();
    }
  }, [isFocused]);

  const fetchLabs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(ENDPOINTS.labsList);
      setLabs(response.data || []);
    } catch (err) {
      console.error("خطأ في جلب المختبرات:", err);
      setError("حدث خطأ في جلب المختبرات");
    } finally {
      setLoading(false);
    }
  };

  const filteredLabs = search.trim()
    ? labs.filter(
        (lab) =>
          lab.city &&
          lab.city.toLowerCase().includes(search.toLowerCase())
      )
    : labs;

  const renderLabCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.labName}>{item.name || "غير محدد"}</Text>
      <Text style={styles.labInfo}>
        الموقع: {item.location || "غير محدد"}
      </Text>
      <Text style={styles.labInfo}>
        رقم التواصل: {item.phone || "غير محدد"}
      </Text>
      <Text style={styles.labCity}>({item.city || "غير محدد"})</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="ابحث باسم المدينة"
          value={search}
          onChangeText={setSearch}
        />

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>جاري تحميل المختبرات...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchLabs} style={styles.retryButton}>
              <Text style={styles.retryText}>إعادة المحاولة</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredLabs}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={renderLabCard}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>لا يوجد مختبرات مطابقة</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    fontSize: typography.bodyMd,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    textAlign: "right",
    writingDirection: "rtl",
    fontWeight: "700"
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  labName: {
    writingDirection: "rtl",
    fontSize: typography.bodyLg,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
  },
  labInfo: {
    fontSize: typography.bodyMd,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  labCity: {
    fontSize: typography.bodySm,
    color: colors.primary,
    alignSelf: "flex-end",
  },
  emptyText: {
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: spacing.xl,
    fontSize: typography.bodyMd,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: typography.bodyMd,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: typography.bodyMd,
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
  },
  retryText: {
    color: "#fff",
    fontSize: typography.bodyMd,
    fontWeight: "700",
  },
});

export default LabsScreen;
