// SymptomTrackingScreen.jsx

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Switch,
} from "react-native";
import ScreenWithDrawer from "./ScreenWithDrawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function SymptomTrackingScreen() {
  const navigation = useNavigation();

  const patientsList = [
    "محمد أحمد",
    "سارة علي",
    "خالد يوسف",
    "منى عبد الله",
    "علي حسن",
    "نور محمد",
  ];

  const allSymptoms = [
    "Abdominal pain (RUQ)",
    "Nausea",
    "Vomiting",
    "Dark urine",
    "Clay-colored stools",
    "Fatigue",
    "Fever",
    "Jaundice",
    "Joint pain",
    "Loss of appetite",
    "Weight loss",
    "Pruritus",
    "Muscle cramps",
    "Confusion / sleep disturbances",
    "Bloody vomiting",
    "Abdominal distention",
    "Skin rash",
    "Decreased sex drive",
  ];

  const hepatitisSigns = [
    "Oesophageal varices",
    "Ascites",
    "Lower extremity oedema",
    "Amenorrhea",
    "Spider angiomas",
    "Jaundice",
    "Gynecomastia",
    "Hepatomegaly",
    "Splenomegaly",
    "Caput Medusae",
    "Muehrcke nails",
    "Terry nails",
    "Clubbing",
    "Hypertrophic osteoarthropathy",
    "Asterixis",
  ];

  // حالات البحث
  const [patientSearch, setPatientSearch] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showPatientList, setShowPatientList] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");

  // تتبع الأعراض
  const [records, setRecords] = useState([]); // سجل لكل مريض
  const [modalVisible, setModalVisible] = useState(false);
  const [tempRecord, setTempRecord] = useState({
    patientName: "",
    symptoms: [],
    signs: [],
    cirrhosis: false,
    familyHCC: false,
    notes: "",
  });

  // ترشيح المرضى
  const handleMainPatientSearch = (text) => {
    setPatientSearch(text);
    if (!text.trim()) {
      setFilteredPatients([]);
      setShowPatientList(false);
      setSelectedPatient("");
      return;
    }
    const filt = patientsList.filter((p) =>
      p.includes(text.trim())
    );
    setFilteredPatients(filt);
    setShowPatientList(filt.length > 0);
  };

  const selectMainPatient = (name) => {
    setPatientSearch(name);
    setSelectedPatient(name);
    setFilteredPatients([]);
    setShowPatientList(false);
  };

  // فتح مودال التسجيل
  const openRecordModal = () => {
    if (!selectedPatient) {
      alert("يرجى اختيار مريض أولاً");
      return;
    }
    setTempRecord({
      patientName: selectedPatient,
      symptoms: [],
      signs: [],
      cirrhosis: false,
      familyHCC: false,
      notes: "",
    });
    setModalVisible(true);
  };

  // حفظ السجل
  const saveRecord = () => {
    setRecords((prev) => [...prev, { ...tempRecord }]);
    setModalVisible(false);
  };

  // تبديل اختيار عرض Checkbox
  const toggleItem = (listName, item) => {
    setTempRecord((prev) => {
      const arr = prev[listName];
      const has = arr.includes(item);
      return {
        ...prev,
        [listName]: has
          ? arr.filter((i) => i !== item)
          : [...arr, item],
      };
    });
  };

  // عرض سجل لمريض محدد
  const displayedRecords = records.filter(
    (r) => r.patientName === selectedPatient
  );

  const renderRecord = ({ item, index }) => (
    <View style={styles.recordItem}>
      <Text style={styles.recordTitle}>تتبع #{index + 1}</Text>
      <Text style={styles.sub}>الأعراض:</Text>
      <Text>{item.symptoms.join(", ") || "لا توجد أعراض"}</Text>
      <Text style={styles.sub}>علامات الالتهاب:</Text>
      <Text>{item.signs.join(", ") || "لا توجد علامات"}</Text>
      <Text style={styles.sub}>تليف الكبد:</Text>
      <Text>{item.cirrhosis ? "نعم" : "لا"}</Text>
      <Text style={styles.sub}>تاريخ عائلي للسرطان:</Text>
      <Text>{item.familyHCC ? "نعم" : "لا"}</Text>
      {item.notes ? (
        <>
          <Text style={styles.sub}>ملاحظات:</Text>
          <Text>{item.notes}</Text>
        </>
      ) : null}
    </View>
  );

  return (
    <ScreenWithDrawer title="تتبع أعراض المرضى">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={styles.safeArea} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        {/* بحث مريض */}
        <View style={styles.searchSection}>
          <Ionicons
            name="search"
            size={24}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="ابحث عن المريض"
            value={patientSearch}
            onChangeText={handleMainPatientSearch}
            onFocus={() => {
              if (filteredPatients.length) setShowPatientList(true);
            }}
          />
        </View>
        {showPatientList && (
          <FlatList
            data={filteredPatients}
            keyExtractor={(i) => i}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.patientItem}
                onPress={() => selectMainPatient(item)}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {selectedPatient ? (
          <>
            <View style={styles.header}>
              <Text style={styles.subtitle}>
                سجل {selectedPatient}
              </Text>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={openRecordModal}
              >
                <Ionicons name="add-circle" size={24} color="#fff" />
                <Text style={styles.addTxt}>تسجيل</Text>
              </TouchableOpacity>
            </View>
            {displayedRecords.length ? (
              <FlatList
                data={displayedRecords}
                keyExtractor={(_, i) => i.toString()}
                renderItem={renderRecord}
              />
            ) : (
              <Text style={styles.noData}>
                لا يوجد سجل لهذا المريض
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.noData}>
            يرجى اختيار مريض
          </Text>
        )}

        {/* مودال إدخال بيانات الأعراض */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalTitle}>
                تسجيل أعراض {selectedPatient}
              </Text>

              {/* Symptoms */}
              <Text style={styles.sectionTitle}>الأعراض</Text>
              {allSymptoms.map((sym) => (
                <View key={sym} style={styles.checkboxRow}>
                  <Text>{sym}</Text>
                  <Switch
                    value={tempRecord.symptoms.includes(sym)}
                    onValueChange={() => toggleItem("symptoms", sym)}
                  />
                </View>
              ))}

              {/* Signs */}
              <Text style={styles.sectionTitle}>علامات التهاب</Text>
              {hepatitisSigns.map((sg) => (
                <View key={sg} style={styles.checkboxRow}>
                  <Text>{sg}</Text>
                  <Switch
                    value={tempRecord.signs.includes(sg)}
                    onValueChange={() => toggleItem("signs", sg)}
                  />
                </View>
              ))}

              {/* Cirrhosis & Family HCC */}
              <View style={styles.checkboxRow}>
                <Text>تليف الكبد (Cirrhosis)</Text>
                <Switch
                  value={tempRecord.cirrhosis}
                  onValueChange={(v) =>
                    setTempRecord((p) => ({ ...p, cirrhosis: v }))
                  }
                />
              </View>
              <View style={styles.checkboxRow}>
                <Text>
                  تاريخ عائلي لسرطان الكبد (HCC)
                </Text>
                <Switch
                  value={tempRecord.familyHCC}
                  onValueChange={(v) =>
                    setTempRecord((p) => ({ ...p, familyHCC: v }))
                  }
                />
              </View>

              {/* Notes */}
              <Text style={styles.sectionTitle}>ملاحظات</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                multiline
                placeholder="أي ملاحظات إضافية"
                value={tempRecord.notes}
                onChangeText={(t) =>
                  setTempRecord((p) => ({ ...p, notes: t }))
                }
              />

              <View style={styles.modalBtns}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.saveBtn]}
                  onPress={saveRecord}
                >
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.btnTxt}>حفظ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancelBtn]}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons
                    name="close"
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.btnTxt}>إلغاء</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </ScreenWithDrawer>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F5F5F5" },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  backArrow: { marginBottom: 8 },
  searchSection: { position: "relative", marginBottom: 10 },
  searchIcon: { position: "absolute", top: 12, left: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FFF",
    fontSize: 16,
    marginBottom: 10,
  },
  patientItem: {
    padding: 12,
    backgroundColor: "#E3F2FD",
    borderRadius: 6,
    marginVertical: 4,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  subtitle: { fontSize: 20, fontWeight: "bold", color: "#444" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
  },
  addTxt: { color: "#FFF", marginLeft: 6, fontWeight: "bold" },
  noData: {
    textAlign: "center",
    marginTop: 50,
    color: "#888",
    fontSize: 16,
  },
  recordItem: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  recordTitle: { fontWeight: "bold", marginBottom: 6 },
  sub: { fontWeight: "bold", marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  modalContent: {
    backgroundColor: "#FFF",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
  },
  checkboxRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  modalBtns: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
  },
  saveBtn: { backgroundColor: "#4CAF50", marginRight: 8 },
  cancelBtn: { backgroundColor: "#F44336", marginLeft: 8 },
  btnTxt: { color: "#FFF", marginLeft: 6, fontWeight: "bold" },
});
