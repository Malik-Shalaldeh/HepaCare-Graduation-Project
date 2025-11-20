import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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

export default function LabDeleteScreen() {
  const [q, setQ] = useState("");
  const [allLabs, setAllLabs] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const normalizeLabs = (data) => {
    let items = [];
    if (Array.isArray(data)) items = data;
    else if (data && data.lab) items = [data.lab];
    else if (data && data.result)
      items = Array.isArray(data.result) ? data.result : [data.result];
    else if (data && typeof data === "object") items = [data];

    return items
      .filter((it) => it && (it.id !== undefined && it.id !== null))
      .map((item) => ({
        id: item.id,
        name: item.name,
        city_id: item.city_id,
        city_name: item.city_name,
        address: item.address || "",
        phone: item.phone || "",
        email: item.email || "",
        location_url: item.location_url || "",
        is_accredited:
          item.is_accredited === true ||
          item.is_approved === true ||
          item.isAccredited === true,
        is_active: item.is_active !== false && item.isActive !== false,
      }));
  };

  const filterLabs = (source, query) => {
    const t = (query || "").trim().toLowerCase();
    if (!t) return source;
    return source.filter((x) => {
      const name = (x.name || "").toLowerCase();
      const idStr = String(x.id || "");
      return name.includes(t) || idStr.includes(t);
    });
  };

  const fetchAllLabs = async () => {
    setLoading(true);
    try {
      const url = `${AbedEndPoint.labsList}?_=${Date.now()}`;
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        Alert.alert("خطأ", "تعذر جلب قائمة المختبرات");
        setAllLabs([]);
        setLabs([]);
        return;
      }

      const data = await res.json();
      const list = normalizeLabs(data);
      setAllLabs(list);
      setLabs(filterLabs(list, q));
    } catch (err) {
      console.log("fetchAllLabs err:", err);
      Alert.alert("خطأ", "تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLabs();
  }, []);

  const handleChangeQuery = (text) => {
    setQ(text);
    setLabs(filterLabs(allLabs, text));
  };

  const onSearch = async () => {
    setLoading(true);
    try {
      const term = q.trim();
      const url = term
        ? `${AbedEndPoint.labsSearch}?q=${encodeURIComponent(
            term
          )}&_=${Date.now()}`
        : `${AbedEndPoint.labsList}?_=${Date.now()}`;

      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        if (res.status === 404) {
          setLabs([]);
          Alert.alert("غير موجود", "لا يوجد مختبرات مطابقة");
        } else {
          Alert.alert("خطأ", "تعذر جلب بيانات المختبرات");
        }
        return;
      }

      const data = await res.json();
      const list = normalizeLabs(data);
      setAllLabs(list);
      setLabs(filterLabs(list, q));
    } catch (err) {
      console.log("search labs err:", err);
      Alert.alert("خطأ", "تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = (lab) => {
    if (!lab) return;
    Alert.alert("حذف مختبر", `هل تريد حذف "${lab.name}" (ID: ${lab.id})؟`, [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        style: "destructive",
        onPress: async () => {
          if (!lab.id) {
            Alert.alert("خطأ", "رقم المختبر غير معروف");
            return;
          }
          setDeleting(true);
          try {
            const res = await fetch(AbedEndPoint.labById(lab.id), {
              method: "DELETE",
            });

            if (!res.ok) {
              let msg = "تعذر حذف المختبر";
              try {
                const body = await res.json();
                if (body?.detail) msg = body.detail;
              } catch {}
              Alert.alert("خطأ", msg);
              return;
            }

            setAllLabs((prev) => prev.filter((x) => x.id !== lab.id));
            setLabs((prev) => prev.filter((x) => x.id !== lab.id));
          } catch (err) {
            console.log("delete lab err:", err);
            Alert.alert("خطأ", "تعذر الاتصال بالخادم");
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.kb}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>ابحث عن المختبر (بالرقم أو الاسم)</Text>
          <View style={styles.row}>
            <Ionicons name="search-outline" size={18} color={PRIMARY} />
            <TextInput
              style={styles.input}
              placeholder="مثال: 2 أو مختبر الشفاء"
              placeholderTextColor={colors.textMuted}
              value={q}
              onChangeText={handleChangeQuery}
              textAlign="right"
              returnKeyType="search"
              onSubmitEditing={onSearch}
              editable={!loading && !deleting}
            />
            <TouchableOpacity
              onPress={onSearch}
              activeOpacity={0.85}
              style={styles.iconBtn}
              disabled={loading || deleting}
            >
              <Ionicons
                name={loading ? "hourglass-outline" : "search"}
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {labs.map((lab) => (
            <View key={lab.id} style={{ width: "100%", alignItems: "center" }}>
              <View style={styles.card}>
                <TouchableOpacity
                  onPress={() => onDelete(lab)}
                  disabled={deleting}
                  style={{ padding: 4, marginLeft: spacing.sm }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={22}
                    color={colors.danger}
                  />
                </TouchableOpacity>

                <Ionicons
                  name="flask-outline"
                  size={24}
                  color={PRIMARY}
                  style={{ marginLeft: spacing.sm }}
                />
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={styles.cardTitle}>{lab.name}</Text>
                  <Text style={styles.cardMeta}>
                    ID: {lab.id} — المدينة:{" "}
                    {lab.city_name || cityName(lab.city_id)}
                  </Text>
                  <Text style={styles.cardMeta}>
                    الهاتف: {lab.phone || "—"} — البريد: {lab.email || "—"}
                  </Text>
                  <Text style={styles.cardMeta}>
                    المعتمد: {lab.is_accredited ? "نعم" : "لا"} — فعال:{" "}
                    {lab.is_active ? "نعم" : "لا"}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  kb: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    padding: spacing.lg,
    paddingBottom: spacing.xl,
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
    marginBottom: spacing.md,
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
  iconBtn: {
    backgroundColor: PRIMARY,
    width: 42,
    height: 42,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.light,
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
    marginBottom: spacing.sm,
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
  deleteBtn: {
    backgroundColor: colors.buttonDanger,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.lg,
    minWidth: 170,
    ...shadows.medium,
  },
  deleteText: {
    color: colors.buttonDangerText,
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
    fontWeight: "800",
    marginStart: spacing.sm,
  },
});
