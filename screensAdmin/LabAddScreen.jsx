import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import AbedEndPoint from "../AbedEndPoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

const PRIMARY = colors.primary;

const FALLBACK_CITIES = [
  { id: 1, name: "Hebron" }, // مطابق لقاعدة البيانات الحالية
];

export default function LabAddScreen() {
  const [name, setName] = useState("");
  const [cityId, setCityId] = useState();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [locationUrl, setLocationUrl] = useState("");
  const [isAccredited, setIsAccredited] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const [cities, setCities] = useState(FALLBACK_CITIES);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(AbedEndPoint.labsCities);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length) setCities(data);
        }
      } catch {
        // تجاهل: نستخدم FALLBACK_CITIES
      }
    })();
  }, []);

  const validateEmail = (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validateUrl = (v) => !v || /^https?:\/\/.+/i.test(v);

  const resetForm = () => {
    setName("");
    setCityId(undefined);
    setAddress("");
    setPhone("");
    setEmail("");
    setLocationUrl("");
    setIsAccredited(false);
    setIsActive(true);
  };

  const onSave = async () => {
    if (!name.trim()) return Alert.alert("تنبيه", "اسم المختبر إلزامي");
    if (!cityId) return Alert.alert("تنبيه", "اختر المدينة");
    if (!validateEmail(email))
      return Alert.alert("تنبيه", "بريد إلكتروني غير صالح");
    if (!validateUrl(locationUrl))
      return Alert.alert("تنبيه", "الرابط يجب أن يبدأ بـ http/https");

    const payload = {
      name: name.trim(),
      city_id: Number(cityId),
      address: address.trim() || null,
      phone: phone.trim() || null,
      email: email.trim() || null,
      location_url: locationUrl.trim() || null,
      is_accredited: !!isAccredited,
      is_active: !!isActive,
    };

    try {
      setSaving(true);
      const res = await fetch(AbedEndPoint.labsAdd, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        return Alert.alert("خطأ", data?.detail || "تعذر حفظ المختبر");
      }
      if (!data?.lab_id) {
        return Alert.alert("خطأ", "تعذر تحديد المعرّف بعد الحفظ");
      }

      Alert.alert("تم", data?.message || "تم حفظ المختبر بنجاح");
      resetForm();
    } catch (err) {
      Alert.alert("خطأ", "تعذر الاتصال بالسيرفر");
    } finally {
      setSaving(false);
    }
  };

  const disabled = !name || !cityId || saving;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.kb}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
        >
          <Text style={styles.label}>اسم المختبر</Text>
          <View style={styles.row}>
            <Ionicons name="flask-outline" size={18} color={PRIMARY} />
            <TextInput
              style={styles.input}
              placeholder="اكتب اسم المختبر"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              textAlign="right"
            />
          </View>

          <Text style={styles.label}>المدينة</Text>
          <View style={[styles.row, { overflow: "hidden" }]}>
            <Ionicons name="business-outline" size={18} color={PRIMARY} />
            <View style={{ flex: 1 }}>
              <Picker
                selectedValue={cityId ?? null}
                onValueChange={(v) => setCityId(v || undefined)}
                style={{ color: colors.textPrimary }}
              >
                <Picker.Item label="اختر المدينة" value={null} />
                {cities.map((c) => (
                  <Picker.Item key={c.id} label={c.name} value={c.id} />
                ))}
              </Picker>
            </View>
          </View>

          <Text style={styles.label}>العنوان</Text>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={18} color={PRIMARY} />
            <TextInput
              style={styles.input}
              placeholder="العنوان (اختياري)"
              placeholderTextColor={colors.textMuted}
              value={address}
              onChangeText={setAddress}
              textAlign="right"
            />
          </View>

          <Text style={styles.label}>الهاتف</Text>
          <View style={styles.row}>
            <Ionicons name="call-outline" size={18} color={PRIMARY} />
            <TextInput
              style={styles.input}
              placeholder="رقم الهاتف (اختياري)"
              placeholderTextColor={colors.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              textAlign="right"
            />
          </View>

          <Text style={styles.label}>البريد الإلكتروني</Text>
          <View style={styles.row}>
            <Ionicons name="mail-outline" size={18} color={PRIMARY} />
            <TextInput
              style={styles.input}
              placeholder="example@mail.com (اختياري)"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              textAlign="right"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>رابط الموقع/الخريطة</Text>
          <View style={styles.row}>
            <Ionicons name="navigate-outline" size={18} color={PRIMARY} />
            <TextInput
              style={styles.input}
              placeholder="https://maps.google.com/..."
              placeholderTextColor={colors.textMuted}
              value={locationUrl}
              onChangeText={setLocationUrl}
              textAlign="right"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchItem}>
              <Switch value={isAccredited} onValueChange={setIsAccredited} />
              <Text style={styles.switchText}>مختبر مُعتمد</Text>
            </View>
            <View style={styles.switchItem}>
              <Switch value={isActive} onValueChange={setIsActive} />
              <Text style={styles.switchText}>الحالة: فعال</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={onSave}
            activeOpacity={0.9}
            disabled={disabled}
            style={[styles.actionBtn, disabled && { opacity: 0.5 }]}
          >
            <Ionicons name="save-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionText}>
              {saving ? "جاري الحفظ..." : "حفظ المختبر"}
            </Text>
          </TouchableOpacity>
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
  switchRow: {
    width: "88%",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  switchItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  switchText: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    fontSize: typography.bodyMd,
  },
  actionBtn: {
    backgroundColor: PRIMARY,
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
  actionText: {
    color: "#FFFFFF",
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
    fontWeight: "800",
    marginStart: spacing.sm,
  },
});
