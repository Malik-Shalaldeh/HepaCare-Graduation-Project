import React, { useState } from "react";
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

const PRIMARY = "#00b29c";

const CITIES = [
  { id: 1, name: "القدس" },
  { id: 2, name: "رام الله" },
  { id: 3, name: "الخليل" },
  { id: 4, name: "نابلس" },
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

  const validateEmail = (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validateUrl = (v) => !v || /^https?:\/\/.+/i.test(v);

  const onSave = () => {
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

    // TODO: POST /labs
    Alert.alert(
      "تم الحفظ",
      `سيتم إنشاء مختبر:\n${JSON.stringify(payload, null, 2)}`
    );
    setName("");
    setCityId(undefined);
    setAddress("");
    setPhone("");
    setEmail("");
    setLocationUrl("");
    setIsAccredited(false);
    setIsActive(true);
  };

  const disabled = !name || !cityId;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            padding: 16,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
        >
          <Text style={styles.label}>اسم المختبر</Text>
          <View style={styles.row}>
            <Ionicons name="flask-outline" size={18} color={PRIMARY} />
            <TextInput
              style={styles.input}
              placeholder="اكتب اسم المختبر"
              placeholderTextColor="#94A3B8"
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
                selectedValue={cityId}
                onValueChange={(v) => setCityId(v)}
                style={{ color: "#0F172A" }}
              >
                <Picker.Item label="اختر المدينة" value={undefined} />
                {CITIES.map((c) => (
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
              placeholderTextColor="#94A3B8"
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
              placeholderTextColor="#94A3B8"
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
              placeholderTextColor="#94A3B8"
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
              placeholderTextColor="#94A3B8"
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
            <Text style={styles.actionText}>حفظ المختبر</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
    alignSelf: "flex-end",
    marginBottom: 6,
    marginTop: 8,
    width: "88%",
  },
  row: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
    width: "88%",
  },
  input: { flex: 1, color: "#0F172A", fontSize: 15, textAlign: "right" },
  switchRow: {
    width: "88%",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  switchItem: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  switchText: { color: "#0F172A", fontWeight: "700" },
  actionBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
    minWidth: 170,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    marginStart: 6,
  },
});
