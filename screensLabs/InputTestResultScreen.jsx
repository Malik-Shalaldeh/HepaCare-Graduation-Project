import React, { useState, useLayoutEffect } from "react";
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

export default function InputTestResultScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const patientsList = [
    { id: "1001", name: "أحمد خالد" },
    { id: "1002", name: "سارة محمود" },
    { id: "1003", name: "محمد علي" },
  ];
  const testsList = [
    "CBC",
    "PCR*",
    "ELISA*",
    "CHEMISTRY",
    "COAGULATION",
    "HBSAG**",
    "HBSAB**",
    "HBCAB**",
  ];

  const [searchInput, setSearchInput] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [selectedTest, setSelectedTest] = useState("");
  const [file, setFile] = useState(null);
  const [resultValue, setResultValue] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isNormal, setIsNormal] = useState(true);
  const [note, setNote] = useState("");

  const handlePatientSearch = () => {
    const results = patientsList.filter(
      (p) => p.id === searchInput.trim() || p.name.includes(searchInput.trim())
    );
    setFilteredPatients(results);
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (result.type === "success") {
      setFile(result);
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

  const handleSave = () => {
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
        {
          text: "حسناً",
          onPress: resetState,
        },
      ],
      { cancelable: false }
    );
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
              >
                <Picker.Item label="-- اختر الفحص --" value="" />
                {testsList.map((test) => (
                  <Picker.Item key={test} label={test} value={test} />
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
