// screens/InputTestResultScreen.jsx
import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
  StatusBar,
  Switch,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AbedEndPoint from "../AbedEndPoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

function toYMD(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function InputTestResultScreen() {
  const navigation = useNavigation();

  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const did = await AsyncStorage.getItem("doctor_id");
        setDoctorId(did ? Number(did) : null);
      } catch {
        setDoctorId(null);
      }
    })();
  }, []);

  const [testsList, setTestsList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [selectedTestId, setSelectedTestId] = useState(null);
  const [file, setFile] = useState(null);
  const [resultValue, setResultValue] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isNormal, setIsNormal] = useState(true);
  const [note, setNote] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(AbedEndPoint.testsList);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (Array.isArray(data)) {
          setTestsList(
            data
              .filter((t) => t && typeof t.id !== "undefined" && t.name)
              .map((t) => ({ id: t.id, name: t.name }))
          );
        } else {
          setTestsList([]);
        }
      } catch {
        setTestsList([]);
      }
    })();
  }, []);

  const handlePatientSearch = async () => {
    try {
      if (!doctorId) {
        return Alert.alert(
          "تنبيه",
          "لم يتم التعرّف على هوية الطبيب. أعد تسجيل الدخول."
        );
      }
      const url = `${AbedEndPoint.patientsSearch}?query=${encodeURIComponent(
        searchInput.trim()
      )}&doctor_id=${doctorId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setFilteredPatients(
        Array.isArray(data)
          ? data.map((x) => ({
              id: String(x.id),
              name: x.fullName || x.name || String(x.id),
            }))
          : []
      );
    } catch (e) {
      Alert.alert("خطأ", "تعذر جلب المرضى");
      setFilteredPatients([]);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (result?.assets?.length) {
        const f = result.assets[0];
        setFile({
          uri: f.uri,
          name: f.name || "result.dat",
          mimeType: f.mimeType || "application/octet-stream",
        });
      } else if (result?.type === "success") {
        setFile({
          uri: result.uri,
          name: result.name || "result.dat",
          mimeType: result.mimeType || "application/octet-stream",
        });
      }
    } catch {
      setFile(null);
    }
  };

  const resetState = () => {
    setSelectedPatient(null);
    setSearchInput("");
    setFilteredPatients([]);
    setSelectedTestId(null);
    setFile(null);
    setResultValue("");
    setDate(new Date());
    setShowDatePicker(false);
    setIsNormal(true);
    setNote("");
  };

  const handleSave = async () => {
    if (!doctorId) {
      return Alert.alert(
        "تنبيه",
        "لم يتم التعرّف على هوية الطبيب. أعد تسجيل الدخول."
      );
    }
    if (!selectedPatient) return Alert.alert("تنبيه", "اختر المريض أولاً");
    if (!selectedTestId) return Alert.alert("تنبيه", "اختر اسم الفحص");

    try {
      const form = new FormData();
      form.append("patient_id", String(selectedPatient.id));
      form.append("test_id", String(selectedTestId));
      form.append("test_date", toYMD(date));
      form.append("is_normal", isNormal ? "1" : "0");
      form.append("doctor_id", String(doctorId));
      if (note) form.append("comments", note);
      if (resultValue !== "") form.append("result_value", String(resultValue));

      if (file && file.uri) {
        form.append("file", {
          uri: file.uri,
          name: file.name || "result.dat",
          type: file.mimeType || "application/octet-stream",
        });
      }

      const res = await fetch(AbedEndPoint.inputResultSave, {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: form,
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }

      Alert.alert(
        "تم الحفظ",
        "تم حفظ نتائج الفحص بنجاح",
        [
          {
            text: "عرض النتائج",
            onPress: () => {
              resetState();
              navigation.navigate("TestResultsScreen");
            },
          },
          { text: "حسناً", onPress: resetState },
        ],
        { cancelable: false }
      );
    } catch (e) {
      Alert.alert("خطأ", "تعذر حفظ النتيجة:\n" + (e?.message || ""));
    }
  };

  const formatDate = (d) => {
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (!selectedPatient) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>🩺 إدخال نتائج الفحص</Text>
        <TextInput
          style={[styles.input, styles.rtlText]}
          placeholder="...ابحث برقم أو اسم المريض"
          placeholderTextColor={colors.textMuted}
          value={searchInput}
          onChangeText={setSearchInput}
          textAlign="right"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handlePatientSearch}
          activeOpacity={0.9}
        >
          <Ionicons name="search" size={20} color={colors.buttonInfoText} />
          <Text style={[styles.searchButtonText, styles.rtlText]}>بحث</Text>
        </TouchableOpacity>
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => item.id}
          style={{ marginTop: spacing.sm }}
          ListEmptyComponent={() =>
            searchInput !== "" ? (
              <Text style={[styles.emptyText, styles.rtlText]}>
                لا يوجد مرضى
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setSelectedPatient(item)}
              activeOpacity={0.9}
            >
              <Text style={[styles.name, styles.rtlText]}>👤 {item.name}</Text>
              <Text style={[styles.subInfo, styles.rtlText]}>
                رقم: {item.id}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setSelectedPatient(null)}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <Text style={styles.header}>🩺 إدخال نتائج الفحص</Text>

      <View style={styles.card}>
        <Text style={[styles.name, styles.rtlText]}>
          👤 {selectedPatient.name} (#{selectedPatient.id})
        </Text>

        <Text style={[styles.label, styles.rtlText]}>اختر اسم الفحص:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedTestId}
            onValueChange={(v) => setSelectedTestId(v)}
          >
            <Picker.Item label="-- اختر الفحص --" value={null} />
            {testsList.map((t) => (
              <Picker.Item key={t.id} label={t.name} value={t.id} />
            ))}
          </Picker>
        </View>

        {selectedTestId !== null && (
          <>
            <Text style={[styles.label, styles.rtlText]}>تاريخ الفحص:</Text>
            <View style={styles.dateRow}>
              <Text style={[styles.dateText, styles.rtlText]}>
                {formatDate(date)}
              </Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.9}
              >
                <Text style={[styles.dateButtonText, styles.rtlText]}>
                  اختر التاريخ
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(e, selectedDate) => {
                  if (Platform.OS !== "ios") setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}

            <Text style={[styles.label, styles.rtlText]}>النتيجة الرقمية:</Text>
            <TextInput
              style={[styles.input, styles.rtlText]}
              placeholder="ادخل قيمة الفحص"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={resultValue}
              onChangeText={setResultValue}
              textAlign="right"
            />

            <Text style={[styles.label, styles.rtlText]}>رفع ملف الفحص:</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickDocument}
              activeOpacity={0.9}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={20}
                color={colors.buttonInfo}
              />
              <Text style={[styles.uploadText, styles.rtlText]}>
                {file?.name ? file.name : "اضغط لرفع الملف"}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.label, styles.rtlText]}>تقييم الفحص:</Text>
            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, styles.rtlText]}>
                {isNormal ? "طبيعي" : "غير طبيعي"}
              </Text>
              <Switch
                value={isNormal}
                onValueChange={setIsNormal}
                trackColor={{
                  false: colors.border,
                  true: colors.accent,
                }}
                thumbColor={
                  Platform.OS === "android" ? colors.primary : undefined
                }
              />
            </View>

            <Text style={[styles.label, styles.rtlText]}>ملاحظات الطبيب:</Text>
            <TextInput
              style={[styles.input, { height: 80 }, styles.rtlText]}
              placeholder="اكتب ملاحظاتك هنا"
              placeholderTextColor={colors.textMuted}
              multiline
              value={note}
              onChangeText={setNote}
              textAlign="right"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.searchButton, { backgroundColor: colors.buttonSuccess }]}
                onPress={handleSave}
                activeOpacity={0.9}
              >
                <Text style={[styles.searchButtonText, styles.rtlText]}>
                  حفظ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.searchButton, { backgroundColor: colors.buttonDanger }]}
                onPress={() => setSelectedPatient(null)}
                activeOpacity={0.9}
              >
                <Text style={[styles.searchButtonText, styles.rtlText]}>
                  إلغاء
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.xl, // قريب من 20
    paddingTop:
      Platform.OS === "android"
        ? (StatusBar.currentHeight || 0) + spacing.sm
        : 30,
    paddingBottom: Platform.OS === "android" ? 40 : spacing.lg,
  },
  contentContainer: {
    paddingBottom: Platform.OS === "android" ? 40 : spacing.lg,
  },
  backButton: {
    marginBottom: spacing.md + 3, // قريب من 15
  },
  header: {
    fontSize: typography.headingMd,
    fontWeight: "bold",
    marginBottom: spacing.lg,
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: typography.fontFamily,
  },
  rtlText: {
    writingDirection: "rtl",
    textAlign: "right",
    fontFamily: typography.fontFamily,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: typography.bodyLg,
    marginBottom: spacing.sm + 2,
    borderColor: colors.border,
    borderWidth: 1,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    ...shadows.light,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.buttonInfo,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    alignSelf: "flex-start",
    marginBottom: spacing.sm + 2,
    ...shadows.light,
  },
  searchButtonText: {
    color: colors.buttonInfoText,
    fontSize: typography.bodyLg,
    marginLeft: spacing.sm,
    fontWeight: "bold",
    fontFamily: typography.fontFamily,
  },
  emptyText: {
    fontSize: typography.bodyLg,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.light,
  },
  name: {
    fontWeight: "bold",
    fontSize: typography.headingSm,
    marginBottom: spacing.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
  },
  subInfo: {
    fontSize: typography.bodyMd,
    color: colors.textMuted,
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily,
  },
  label: {
    fontSize: typography.bodyLg,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.xs + 2,
    fontFamily: typography.fontFamily,
  },
  pickerWrapper: {
    backgroundColor: colors.buttonMuted,
    borderRadius: radii.md,
    overflow: "hidden",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.buttonMuted,
    borderRadius: radii.md,
    marginBottom: spacing.sm + 2,
  },
  uploadText: {
    marginLeft: spacing.sm,
    fontSize: typography.bodyLg,
    color: colors.buttonInfo,
    fontFamily: typography.fontFamily,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  switchLabel: {
    fontSize: typography.bodyLg,
    marginRight: spacing.sm + 2,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: typography.bodyLg,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
  },
  dateButton: {
    backgroundColor: colors.buttonInfo,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
  },
  dateButtonText: {
    color: colors.buttonInfoText,
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
  },
});
