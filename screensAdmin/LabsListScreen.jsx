import React, { useMemo, useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Switch,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AbedEndPoint from "../AbedEndPoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

const PRIMARY = colors.primary;

const CITIES = [
  { id: 1, name: "القدس" },
  { id: 2, name: "رام الله" },
  { id: 3, name: "الخليل" },
  { id: 4, name: "نابلس" },
];

const cityName = (id) => CITIES.find((c) => c.id === id)?.name || "—";

export default function LabsListScreen() {
  const [q, setQ] = useState("");
  const [onlyAccredited, setOnlyAccredited] = useState(false);
  const [onlyActive, setOnlyActive] = useState(false);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const res = await fetch(`${AbedEndPoint.labsList}?_=${Date.now()}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("failed");
        const json = await res.json();
        const normalized = (json || []).map((l) => ({
          id: l.id,
          name: l.name || "",
          city_id: l.city_id || 0,
          address: l.address || "",
          phone: l.phone || "",
          email: l.email || "",
          location_url: l.location_url || "",
          is_accredited:
            typeof l.is_accredited === "boolean"
              ? l.is_accredited
              : !!l.is_approved,
          is_active: typeof l.is_active === "boolean" ? l.is_active : true,
        }));
        setLabs(normalized);
      } catch (e) {
        setLoadError("تعذر جلب بيانات المختبرات.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const data = useMemo(() => {
    const s = q.trim().toLowerCase();
    return labs.filter((l) => {
      if (onlyAccredited && !l.is_accredited) return false;
      if (onlyActive && !l.is_active) return false;
      if (!s) return true;
      return (
        l.name.toLowerCase().includes(s) ||
        String(l.id).includes(s) ||
        (l.phone || "").toLowerCase().includes(s) ||
        (l.email || "").toLowerCase().includes(s) ||
        (l.address || "").toLowerCase().includes(s) ||
        cityName(l.city_id).toLowerCase().includes(s)
      );
    });
  }, [q, onlyAccredited, onlyActive, labs]);

  const openLocation = (url) => url && Linking.openURL(url).catch(() => {});

  const Header = (
    <View style={{ alignItems: "center" }}>
      <Text style={styles.label}>ابحث في المختبرات</Text>
      <View style={styles.row}>
        <Ionicons name="search-outline" size={18} color={PRIMARY} />
        <TextInput
          style={styles.input}
          placeholder="اسم، رقم، مدينة، هاتف، بريد.."
          placeholderTextColor={colors.textMuted}
          value={q}
          onChangeText={setQ}
          textAlign="right"
          returnKeyType="search"
        />
      </View>

      <View style={styles.filters}>
        <View style={styles.filterItem}>
          <Switch value={onlyAccredited} onValueChange={setOnlyAccredited} />
          <Text style={styles.filterText}>فقط المعتمد</Text>
        </View>
        <View style={styles.filterItem}>
          <Switch value={onlyActive} onValueChange={setOnlyActive} />
          <Text style={styles.filterText}>فقط الفعّال</Text>
        </View>
      </View>
      {!!loadError && (
        <Text style={styles.errorText}>{loadError}</Text>
      )}
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Ionicons
        name="flask-outline"
        size={24}
        color={PRIMARY}
        style={{ marginLeft: spacing.sm }}
      />
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardMeta}>
          ID: {item.id} — المدينة: {cityName(item.city_id)}
        </Text>
        {!!item.address && (
          <Text style={styles.cardMeta}>العنوان: {item.address}</Text>
        )}
        <Text style={styles.cardMeta}>
          الهاتف: {item.phone || "—"} — البريد: {item.email || "—"}
        </Text>
        <View style={styles.badges}>
          <View
            style={[
              styles.badge,
              item.is_accredited ? styles.badgeYes : styles.badgeNo,
            ]}
          >
            <Ionicons
              name={item.is_accredited ? "checkmark-circle" : "close-circle"}
              size={14}
              color="#fff"
            />
            <Text style={styles.badgeText}>معتمد</Text>
          </View>
          <View
            style={[
              styles.badge,
              item.is_active ? styles.badgeYes : styles.badgeNo,
            ]}
          >
            <Ionicons
              name={item.is_active ? "checkmark-circle" : "close-circle"}
              size={14}
              color="#fff"
            />
            <Text style={styles.badgeText}>فعال</Text>
          </View>
          {!!item.location_url && (
            <TouchableOpacity
              style={[styles.badge, styles.badgeLink]}
              onPress={() => openLocation(item.location_url)}
              activeOpacity={0.9}
            >
              <Ionicons name="navigate-outline" size={14} color="#fff" />
              <Text style={styles.badgeText}>الموقع</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={styles.loadingText}>جاري تحميل المختبرات...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={Header}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>لا توجد نتائج مطابقة</Text>
          }
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  label: {
    color: colors.textPrimary,
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    textAlign: "right",
    alignSelf: "flex-end",
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
    width: "88%",
  },
  row: {
    backgroundColor: colors.backgroundLight,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
    width: "88%",
    ...shadows.light,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.bodyLg,
    fontFamily: typography.fontFamily,
    textAlign: "right",
  },

  filters: {
    width: "88%",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  filterItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  filterText: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    fontSize: typography.bodyMd,
    fontWeight: "700",
  },

  errorText: {
    color: colors.danger,
    marginTop: spacing.xs,
    width: "88%",
    textAlign: "right",
    fontFamily: typography.fontFamily,
    fontSize: typography.bodySm,
  },

  card: {
    backgroundColor: colors.backgroundLight,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
    width: "88%",
    marginTop: spacing.md,
    ...shadows.light,
  },
  cardTitle: {
    fontSize: typography.bodyLg,
    fontFamily: typography.fontFamily,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: "right",
    width: "100%",
  },
  cardMeta: {
    fontSize: typography.bodySm,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    textAlign: "right",
    width: "100%",
    lineHeight: typography.lineHeightNormal,
  },

  badges: {
    marginTop: spacing.sm,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  badge: {
    borderRadius: radii.pill,
    paddingVertical: spacing.sm - 2,
    paddingHorizontal: spacing.md,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs + 2,
  },
  badgeYes: { backgroundColor: colors.success },
  badgeNo: { backgroundColor: colors.danger },
  badgeLink: { backgroundColor: PRIMARY },
  badgeText: {
    color: "#fff",
    fontSize: typography.bodySm,
    fontFamily: typography.fontFamily,
    fontWeight: "800",
  },

  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    fontSize: typography.bodyMd,
  },

  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    marginTop: spacing.lg,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    fontSize: typography.bodyMd,
  },
});
