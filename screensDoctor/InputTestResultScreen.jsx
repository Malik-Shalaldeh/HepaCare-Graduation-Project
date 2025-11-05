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
import AbedEndPoint from "../AbedEndPoint"; // <-- استخدام الايندبوينت

function toYMD(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function InputTestResultScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // ================== منطق فقط (بدون أي تغيير بصري) ==================
  const [doctorId, setDoctorId] = useState(null);

  // جلب doctor_id من AsyncStorage
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

  const [testsList, setTestsList] = useState([]);          // [{id,name}]
  const [searchInput, setSearchInput] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]); // [{id,name}]
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [selectedTestId, setSelectedTestId] = useState(null); // بدلاً من selectedTest (اسم)
  const [file, setFile] = useState(null);
  const [resultValue, setResultValue] = useState("");     // واجهة فقط (الباك إند الحالي لا يعتمدها)
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isNormal, setIsNormal] = useState(true);
  const [note, setNote] = useState("");
  // ====================================================================

  // جلب قائمة الفحوصات من الباك إند كـ [{id,name}]
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(AbedEndPoint.testsList);
        if (!res.ok) throw new Error();
        const data = await res.json(); // نتوقع [{id,name}]
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
        return Alert.alert("تنبيه", "لم يتم التعرّف على هوية الطبيب. أعد تسجيل الدخول.");
      }
      const url = `${AbedEndPoint.patientsSearch}?query=${encodeURIComponent(
        searchInput.trim()
      )}&doctor_id=${doctorId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json(); // نتوقع [{id, fullName, ...}]
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
      return Alert.alert("تنبيه", "لم يتم التعرّف على هوية الطبيب. أعد تسجيل الدخول.");
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
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handlePatientSearch}
        >
          <Ionicons name="search" size={20} color="#fff" />
          <Text style={[styles.searchButtonText, styles.rtlText]}>بحث</Text>
        </TouchableOpacity>
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => item.id}
          style={{ marginTop: 10 }}
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
              keyboardType="numeric"
              value={resultValue}
              onChangeText={setResultValue}
              textAlign="right"
            />

            <Text style={[styles.label, styles.rtlText]}>رفع ملف الفحص:</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickDocument}
            >
              <Ionicons name="cloud-upload-outline" size={20} color="#2980B9" />
              <Text style={[styles.uploadText, styles.rtlText]}>
                {file?.name ? file.name : "اضغط لرفع الملف"}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.label, styles.rtlText]}>تقييم الفحص:</Text>
            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, styles.rtlText]}>
                {isNormal ? "طبيعي" : "غير طبيعي"}
              </Text>
              <Switch value={isNormal} onValueChange={setIsNormal} />
            </View>

            <Text style={[styles.label, styles.rtlText]}>ملاحظات الطبيب:</Text>
            <TextInput
              style={[styles.input, { height: 80 }, styles.rtlText]}
              placeholder="اكتب ملاحظاتك هنا"
              multiline
              value={note}
              onChangeText={setNote}
              textAlign="right"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.searchButton, { backgroundColor: "#27ae60" }]}
                onPress={handleSave}
              >
                <Text style={[styles.searchButtonText, styles.rtlText]}>
                  حفظ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.searchButton, { backgroundColor: "#c0392b" }]}
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
  );
}

const styles = StyleSheet.create({
  /* كل الستايل كما هو بدون أي تعديل */
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 30,
    paddingBottom: Platform.OS === "android" ? 40 : 20,
  },
  contentContainer: { paddingBottom: Platform.OS === "android" ? 40 : 20 },
  backButton: { marginBottom: 15 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2C3E50",
    textAlign: "right",
  },
  rtlText: { writingDirection: "rtl", textAlign: "right" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2980B9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
  },
  emptyText: { fontSize: 16, color: "#aaa" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  name: { fontWeight: "bold", fontSize: 18, marginBottom: 8, color: "#34495E" },
  subInfo: { fontSize: 15, color: "#7f8c8d", marginBottom: 12 },
  label: { fontSize: 16, color: "#2C3E50", marginTop: 12, marginBottom: 6 },
  pickerWrapper: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    overflow: "hidden",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#eef6fb",
    borderRadius: 12,
    marginBottom: 10,
  },
  uploadText: { marginLeft: 8, fontSize: 16, color: "#2980B9" },
  switchRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  switchLabel: { fontSize: 16, marginRight: 10 },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: { fontSize: 16, color: "#2C3E50" },
  dateButton: {
    backgroundColor: "#2980B9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dateButtonText: { color: "#fff", fontSize: 14 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
