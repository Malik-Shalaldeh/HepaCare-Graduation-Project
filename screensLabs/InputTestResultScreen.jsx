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
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

// ✅ عدّل مسار الاستيراد حسب مشروعك
import AbedEndPoint from "../AbedEndPoint";

export default function InputTestResultScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // ✅ بدل الداتا الوهمية: جلب من الباك اند
  const [testsList, setTestsList] = useState([]); // [{id, name, ...}]
  const [loadingTests, setLoadingTests] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // ✅ نخزن id الفحص بدل الاسم
  const [selectedTest, setSelectedTest] = useState(""); // test_id (string)
  const [file, setFile] = useState(null); // { uri, name, mimeType }
  const [resultValue, setResultValue] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isNormal, setIsNormal] = useState(true);
  const [note, setNote] = useState("");

  // ✅ تحميل الفحوصات مرة واحدة
  useEffect(() => {
    const loadTests = async () => {
      try {
        setLoadingTests(true);
        const res = await fetch(AbedEndPoint.labTestsList);
        if (!res.ok) throw new Error("Failed to load tests");
        const data = await res.json();
        setTestsList(Array.isArray(data) ? data : []);
      } catch (e) {
        Alert.alert("خطأ", "تعذر تحميل قائمة الفحوصات");
        setTestsList([]);
      } finally {
        setLoadingTests(false);
      }
    };

    loadTests();
  }, []);

  const handlePatientSearch = async () => {
    try {
      const q = searchInput.trim();
      if (!q) {
        setFilteredPatients([]);
        return;
      }

      const url = `${AbedEndPoint.labPatientsSearch}?query=${encodeURIComponent(
        q
      )}&take=20`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();

      // الباك اند يرجع: [{patient_id, full_name, ...}]
      const normalized = (Array.isArray(data) ? data : []).map((x) => ({
        id: String(x.patient_id),
        name: x.full_name,
        national_id: x.national_id ?? null,
        phone: x.phone ?? null,
      }));

      setFilteredPatients(normalized);
    } catch (e) {
      Alert.alert("خطأ", "تعذر البحث عن المرضى");
      setFilteredPatients([]);
    }
  };

  // ✅ FIX: DocumentPicker الجديد (canceled/assets) + القديم
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (result?.canceled) return;

    const asset = result?.assets?.[0] || result;

    if (asset?.uri) {
      setFile({
        uri: asset.uri,
        name: asset.name || "result.dat",
        mimeType: asset.mimeType || "application/octet-stream",
      });
    }
  };

  const resetState = () => {
    setSelectedPatient(null);
    setSearchInput("");
    setFilteredPatients([]);
    setSelectedTest("");
    setFile(null);
    setResultValue("");
    setDate(new Date());
    setShowDatePicker(false);
    setIsNormal(true);
    setNote("");
  };

  const toISODate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // YYYY-MM-DD
  };

  const handleSave = async () => {
    try {
      if (!selectedPatient) return;

      if (!selectedTest) {
        Alert.alert("تنبيه", "اختر اسم الفحص أولاً");
        return;
      }

      // تجهيز FormData للإرسال للباك اند
      const form = new FormData();
      form.append("patient_id", String(selectedPatient.id));
      form.append("test_id", String(selectedTest));
      form.append("test_date", toISODate(date));
      form.append(
        "result_value",
        resultValue?.trim() ? resultValue.trim() : ""
      );
      form.append("is_normal", isNormal ? "1" : "0");
      form.append("comments", note || "");

      // ملف اختياري (✅ FIX: يعتمد على file.uri)
      if (file?.uri) {
        form.append("file", {
          uri: file.uri,
          name: file.name || "result.dat",
          type: file.mimeType || "application/octet-stream",
        });
      }

      const res = await fetch(AbedEndPoint.labTestResults, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || "Save failed");
      }

      // ✅ اقرأ الرد عشان تتأكد من filePath (Debug)
      const data = await res.json().catch(() => ({}));
      console.log("Saved response:", data); // فيه filePath إذا انحفظ

      // ✅ زر واحد فقط: "تم"
      Alert.alert(
        "تم",
        "تم إضافة الفحص بنجاح",
        [
          {
            text: "تم",
            onPress: resetState,
          },
        ],
        { cancelable: false }
      );
    } catch (e) {
      Alert.alert("خطأ", "تعذر حفظ نتيجة الفحص. تأكد من الاتصال بالسيرفر");
    }
  };

  const formatDate = (d) => {
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundLight }}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
        backgroundColor={Platform.OS === "android" ? colors.primary : undefined}
      />
      {!selectedPatient ? (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.header}>🩺 إدخال نتائج الفحص</Text>
          <TextInput
            style={[styles.input, styles.rtlText]}
            placeholder="...ابحث برقم أو اسم المريض"
            value={searchInput}
            onChangeText={setSearchInput}
            textAlign="right"
            placeholderTextColor={colors.textMuted}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handlePatientSearch}
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
              >
                <Text style={[styles.name, styles.rtlText]}>
                  👤 {item.name}
                </Text>
                <Text style={[styles.subInfo, styles.rtlText]}>
                  رقم: {item.id}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedPatient(null)}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.header}>🩺 إدخال نتائج الفحص</Text>
          <View style={styles.card}>
            <Text style={[styles.name, styles.rtlText]}>
              👤 {selectedPatient.name} (#{selectedPatient.id})
            </Text>

            <Text style={[styles.label, styles.rtlText]}>اختر اسم الفحص:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedTest}
                onValueChange={(v) => setSelectedTest(v)}
                enabled={!loadingTests}
              >
                <Picker.Item
                  label={
                    loadingTests ? "جاري تحميل الفحوصات..." : "-- اختر الفحص --"
                  }
                  value=""
                />
                {testsList.map((t) => (
                  <Picker.Item
                    key={String(t.id)}
                    label={t.name}
                    value={String(t.id)}
                  />
                ))}
              </Picker>
            </View>

            {selectedTest !== "" && (
              <>
                <Text style={[styles.label, styles.rtlText]}>تاريخ الفحص:</Text>
                <View style={styles.dateRow}>
                  <Text style={[styles.dateText, styles.rtlText]}>
                    {formatDate(date)}
                  </Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
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

                <Text style={[styles.label, styles.rtlText]}>
                  النتيجة الرقمية:
                </Text>
                <TextInput
                  style={[styles.input, styles.rtlText]}
                  placeholder="ادخل قيمة الفحص"
                  keyboardType="numeric"
                  value={resultValue}
                  onChangeText={setResultValue}
                  textAlign="right"
                  placeholderTextColor={colors.textMuted}
                />

                <Text style={[styles.label, styles.rtlText]}>
                  رفع ملف الفحص:
                </Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={pickDocument}
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={colors.buttonInfo}
                  />
                  <Text style={[styles.uploadText, styles.rtlText]}>
                    {file ? file.name : "اضغط لرفع الملف"}
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

                <Text style={[styles.label, styles.rtlText]}>
                  ملاحظات الطبيب:
                </Text>
                <TextInput
                  style={[styles.input, { height: 80 }, styles.rtlText]}
                  placeholder="اكتب ملاحظاتك هنا"
                  multiline
                  value={note}
                  onChangeText={setNote}
                  textAlign="right"
                  placeholderTextColor={colors.textMuted}
                />

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.searchButton, styles.saveButton]}
                    onPress={handleSave}
                  >
                    <Text style={[styles.searchButtonText, styles.rtlText]}>
                      حفظ
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.searchButton, styles.cancelButton]}
                    onPress={() => setSelectedPatient(null)}
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.lg,
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight + spacing.sm
        : spacing.sm,
  },
  contentContainer: {
    paddingBottom: Platform.OS === "android" ? spacing.xxl : spacing.xl,
  },
  backButton: {
    marginBottom: spacing.md,
  },
  header: {
    fontSize: typography.headingMd,
    fontWeight: "bold",
    marginBottom: spacing.xl,
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
    marginBottom: spacing.sm,
    borderColor: colors.border,
    borderWidth: 1,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.buttonInfo,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
    alignSelf: "flex-start",
    marginBottom: spacing.sm,
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
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  name: {
    fontWeight: "bold",
    fontSize: typography.headingSm,
    marginBottom: spacing.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
  },
  subInfo: {
    fontSize: typography.bodyLg,
    color: colors.textMuted,
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily,
  },
  label: {
    fontSize: typography.bodyLg,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily,
  },
  pickerWrapper: {
    backgroundColor: colors.backgroundLight,
    borderRadius: radii.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.buttonMuted,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
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
    justifyContent: "space-between",
  },
  switchLabel: {
    fontSize: typography.bodyLg,
    marginRight: spacing.sm,
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
    backgroundColor: colors.buttonSecondary,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
  },
  dateButtonText: {
    color: colors.buttonSecondaryText,
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xl,
  },
  saveButton: {
    backgroundColor: colors.buttonSuccess,
  },
  cancelButton: {
    backgroundColor: colors.buttonDanger,
  },
});
