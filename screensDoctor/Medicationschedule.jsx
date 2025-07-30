// MedicationScreen.jsx

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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ScreenWithDrawer from "./ScreenWithDrawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function MedicationScreen() {
  const navigation = useNavigation();

  // قائمة الأسماء الثابتة للبحث
  const patientsList = [
    "محمد أحمد",
    "سارة علي",
    "خالد يوسف",
    "منى عبد الله",
    "علي حسن",
    "نور محمد",
  ];

  // حالات البحث والفلترة
  const [patientSearch, setPatientSearch] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showPatientList, setShowPatientList] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");

  // حالات الأدوية والمودال
  const [medications, setMedications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState(null);

  // هيكل بيانات الدواء الجديد/المُعدّل
  const [newMedication, setNewMedication] = useState({
    patientName: "",
    name: "",
    dosage: "",
    frequency: "",
    doseTime: "",
    timeToTake: "",
    additionalInstructions: "",
  });

  // مرجع لحقل "اسم الدواء" داخل المودال (لإعطاء focus برمجيًا)
  const medicationNameRef = useRef(null);

  useEffect(() => {
    // عندما يفتح المودال، نركز فورًا على حقل اسم الدواء
    if (modalVisible) {
      setTimeout(() => {
        medicationNameRef.current?.focus();
      }, 100);
    }
  }, [modalVisible]);

  // ترشيح قائمة المرضى أثناء الكتابة
  const handleMainPatientSearch = (text) => {
    setPatientSearch(text);
    if (text.trim() === "") {
      setFilteredPatients([]);
      setShowPatientList(false);
      setSelectedPatient("");
      return;
    }
    const filtered = patientsList.filter((p) =>
      p.toLowerCase().includes(text.trim().toLowerCase())
    );
    setFilteredPatients(filtered);
    setShowPatientList(filtered.length > 0);
  };

  const selectMainPatient = (name) => {
    setPatientSearch(name);
    setSelectedPatient(name);
    setFilteredPatients([]);
    setShowPatientList(false);
  };

  // فتح مودال إضافة دواء جديد
  const openAddModal = () => {
    if (!selectedPatient) {
      alert("يرجى اختيار مريض أولاً");
      return;
    }
    setSelectedMedication(null);
    setNewMedication({
      patientName: selectedPatient,
      name: "",
      dosage: "",
      frequency: "",
      doseTime: "",
      timeToTake: "",
      additionalInstructions: "",
    });
    setShowTimePicker(false);
    setTempTime(null);
    setModalVisible(true);
  };

  // فتح مودال تعديل دواء
  const openEditModal = (med) => {
    setSelectedMedication(med);
    setNewMedication(med);
    setShowTimePicker(false);
    setTempTime(null);
    setModalVisible(true);
  };

  // إضافة أو تعديل دواء في الـ state
  const handleAddOrEditMedication = () => {
    if (
      !newMedication.patientName.trim() ||
      !newMedication.name.trim() ||
      !newMedication.dosage.trim() ||
      !newMedication.frequency.trim() ||
      !newMedication.doseTime.trim() ||
      !newMedication.timeToTake.trim()
    ) {
      alert("يرجى تعبئة الحقول الأساسية");
      return;
    }

    if (selectedMedication) {
      setMedications((prev) =>
        prev.map((med) =>
          med === selectedMedication ? { ...newMedication } : med
        )
      );
    } else {
      setMedications((prev) => [...prev, { ...newMedication }]);
    }
    setModalVisible(false);
  };

  // حذف دواء
  const handleDeleteMedication = (med) => {
    setMedications((prev) => prev.filter((m) => m !== med));
  };

  // معالجة اختيار الوقت من DateTimePicker
  const onTimeChange = (event, selectedTime) => {
    if (event.type === "dismissed") {
      setShowTimePicker(false);
      setTempTime(null);
      return;
    }
    if (selectedTime) {
      setTempTime(selectedTime);
    }
  };

  // حفظ الوقت وإغلاق الـ Picker
  const saveTempTimeAndClosePicker = () => {
    if (tempTime) {
      const hours = tempTime.getHours().toString().padStart(2, "0");
      const minutes = tempTime.getMinutes().toString().padStart(2, "0");
      const formattedTime = `${hours}:${minutes}`;
      setNewMedication({ ...newMedication, timeToTake: formattedTime });
    }
    setShowTimePicker(false);
    setTempTime(null);
  };

  // عند الضغط خارج أي حقل، نغلق الكيبورد وإن وُجد DateTimePicker مفتوح
  const onFocusInput = () => {
    if (showTimePicker) {
      saveTempTimeAndClosePicker();
    }
  };

  // عرض عنصر الدواء في القائمة
  const renderMedicationItem = ({ item }) => (
    <View style={styles.medItem}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.medName, styles.rtlText]}>{item.name}</Text>

        <View style={[styles.patientNameContainer, styles.rtlRow]}>
          <Text style={[styles.patientLabel, styles.rtlText]}>المريض:</Text>
          <Text style={[styles.patientNameText, styles.rtlText]}>
            {item.patientName}
          </Text>
        </View>

        <Text style={[styles.infoText, styles.rtlText]}>
          <Ionicons name="flask-outline" size={16} /> الجرعة: {item.dosage}
        </Text>
        <Text style={[styles.infoText, styles.rtlText]}>
          <Ionicons name="repeat-outline" size={16} /> التكرار: {item.frequency}
        </Text>
        <Text style={[styles.infoText, styles.rtlText]}>
          <Ionicons name="time-outline" size={16} /> وقت الجرعة: {item.doseTime}
        </Text>
        <Text style={[styles.infoText, styles.rtlText]}>
          <Ionicons name="alarm-outline" size={16} /> الساعة المخصصة:{" "}
          {item.timeToTake}
        </Text>
        {item.additionalInstructions ? (
          <Text style={[styles.infoText, styles.rtlText]}>
            <Ionicons name="information-circle-outline" size={16} /> تعليمات:{" "}
            {item.additionalInstructions}
          </Text>
        ) : null}
      </View>
      <View style={styles.medActions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => openEditModal(item)}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDeleteMedication(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // قائمة الأدوية للمريض المختار فقط
  const displayedMedications = selectedPatient
    ? medications.filter((med) => med.patientName === selectedPatient)
    : [];

  return (
    <ScreenWithDrawer title={"أدوية المرضى"}>
      {/* شريط الحالة شفاف ليُظهر خلفية SafeArea */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* تغطية منطقة الـ Safe Area في الأعلى (iOS) */}
      <SafeAreaView style={styles.safeArea} />

      {/* KeyboardAvoidingView لضمان أن الحقول تظهر فوق الكيبورد */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={
          Platform.OS === "ios" ? 0 : StatusBar.currentHeight + 50
        }
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            if (showTimePicker) {
              saveTempTimeAndClosePicker();
            }
          }}
        >
          <View style={styles.container}>
            {/* ← سهم الرجوع */}
            <TouchableOpacity
              style={styles.backArrow}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            {/* ====== قسم البحث عن المريض ====== */}
            <View style={styles.searchSection}>
              <Ionicons
                name="search"
                size={24}
                color="#888"
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.input, styles.rtlText]}
                placeholder="ابدأ بكتابة اسم المريض"
                placeholderTextColor="#888"
                value={patientSearch}
                onChangeText={handleMainPatientSearch}
                onFocus={() => {
                  if (filteredPatients.length > 0) setShowPatientList(true);
                }}
              />
            </View>

            {showPatientList && (
              <FlatList
                data={filteredPatients}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.patientItem}
                    onPress={() => selectMainPatient(item)}
                  >
                    <View style={styles.patientRow}>
                      <Text style={[styles.patientName, styles.rtlText]}>
                        {item}
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#2196f3"
                      />
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.patientsList}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <Text style={styles.emptyText}>لم يُعثر على مرضى</Text>
                }
              />
            )}

            {/* ====== عرض الأدوية للمريض المختار ====== */}
            {selectedPatient ? (
              <>
                <View style={styles.headerSection}>
                  <Text style={[styles.subtitle, styles.rtlText]}>
                    متابعات {selectedPatient}
                  </Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={openAddModal}
                  >
                    <Ionicons name="add-circle" size={24} color="#fff" />
                    <Text style={styles.addButtonText}>جــدول دواء</Text>
                  </TouchableOpacity>
                </View>

                {displayedMedications.length === 0 ? (
                  <Text style={[styles.noMedsText, styles.rtlText]}>
                    لا توجد أدوية لهذا المريض
                  </Text>
                ) : (
                  <FlatList
                    data={displayedMedications}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderMedicationItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                  />
                )}
              </>
            ) : (
              <Text style={[styles.selectPatientText, styles.rtlText]}>
                يرجى اختيار مريض لعرض تفاصيل أدويته
              </Text>
            )}

            {/* ====== مودال إضافة/تعديل دواء ====== */}
            <Modal
              visible={modalVisible}
              animationType="slide"
              transparent={true}
            >
              <KeyboardAvoidingView
                style={styles.modalOverlay}
                behavior="padding"
                keyboardVerticalOffset={
                  Platform.OS === "ios"
                    ? 0
                    : StatusBar.currentHeight + 100
                }
              >
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  keyboardShouldPersistTaps="handled"
                >
                  <TouchableWithoutFeedback
                    onPress={() => {
                      Keyboard.dismiss();
                      if (showTimePicker) {
                        saveTempTimeAndClosePicker();
                      }
                    }}
                  >
                    <View style={styles.modalContent}>
                      <Text style={[styles.modalTitle, styles.rtlText]}>
                        {selectedMedication
                          ? "تعديل الدواء"
                          : `جدولة دواء لـ ${selectedPatient}`}
                      </Text>

                      {/* حقل اسم المريض (غير قابل للتعديل) */}
                      <Text style={[styles.label, styles.rtlText]}>
                        اسم المريض
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          styles.rtlText,
                          styles.disabledInput,
                        ]}
                        value={selectedPatient}
                        editable={false}
                      />

                      {/* حقل اسم الدواء */}
                      <Text style={[styles.label, styles.rtlText]}>
                        اسم الدواء
                      </Text>
                      <TextInput
                        ref={medicationNameRef}
                        style={[styles.input, styles.rtlText]}
                        placeholder="أدخل اسم الدواء"
                        placeholderTextColor="#888"
                        value={newMedication.name}
                        onChangeText={(text) =>
                          setNewMedication({ ...newMedication, name: text })
                        }
                        onFocus={onFocusInput}
                      />

                      {/* حقول الجرعة والتكرار */}
                      <Text style={[styles.label, styles.rtlText]}>الجرعة</Text>
                      <TextInput
                        style={[styles.input, styles.rtlText]}
                        placeholder="أدخل الجرعة"
                        placeholderTextColor="#888"
                        value={newMedication.dosage}
                        onChangeText={(text) =>
                          setNewMedication({ ...newMedication, dosage: text })
                        }
                        onFocus={onFocusInput}
                      />

                      <Text style={[styles.label, styles.rtlText]}>
                        التكرار
                      </Text>
                      <TextInput
                        style={[styles.input, styles.rtlText]}
                        placeholder="أدخل التكرار"
                        placeholderTextColor="#888"
                        value={newMedication.frequency}
                        onChangeText={(text) =>
                          setNewMedication({
                            ...newMedication,
                            frequency: text,
                          })
                        }
                        onFocus={onFocusInput}
                      />

                      <Text style={[styles.label, styles.rtlText]}>
                        وقت الجرعة
                      </Text>
                      <TextInput
                        style={[styles.input, styles.rtlText]}
                        placeholder="أدخل وقت الجرعة (مثلاً: صباحاً، مساءً)"
                        placeholderTextColor="#888"
                        value={newMedication.doseTime}
                        onChangeText={(text) =>
                          setNewMedication({
                            ...newMedication,
                            doseTime: text,
                          })
                        }
                        onFocus={onFocusInput}
                      />

                      {/* اختيار الساعة المخصصة - يسكر الكيبورد قبل فتح الـTimePicker */}
                      <Text style={[styles.label, styles.rtlText]}>
                        الساعة المخصصة
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          Keyboard.dismiss();
                          setShowTimePicker(true);
                        }}
                        style={[
                          styles.input,
                          styles.timePickerButton,
                          styles.rtlText,
                        ]}
                      >
                        <Text
                          style={[
                            styles.rtlText,
                            {
                              color: newMedication.timeToTake
                                ? "#000"
                                : "#888",
                            },
                          ]}
                        >
                          {newMedication.timeToTake || "اختر الساعة"}
                        </Text>
                        <Ionicons name="alarm" size={20} color="#555" />
                      </TouchableOpacity>

                      {showTimePicker && (
                        <DateTimePicker
                          value={tempTime || new Date()}
                          mode="time"
                          is24Hour={true}
                          display={
                            Platform.OS === "ios" ? "spinner" : "clock"
                          }
                          onChange={onTimeChange}
                          themeVariant="light"
                        />
                      )}

                      {/* حقل التعليمات الإضافية */}
                      <Text style={[styles.label, styles.rtlText]}>
                        تعليمات إضافية
                      </Text>
                      <TextInput
                        style={[styles.input, styles.rtlText]}
                        placeholder="أدخل أي تعليمات إضافية"
                        placeholderTextColor="#888"
                        value={newMedication.additionalInstructions}
                        onChangeText={(text) =>
                          setNewMedication({
                            ...newMedication,
                            additionalInstructions: text,
                          })
                        }
                        onFocus={onFocusInput}
                      />

                      {/* أزرار حفظ/إلغاء */}
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={[styles.modalButton, styles.saveButton]}
                          onPress={handleAddOrEditMedication}
                        >
                          <Ionicons
                            name={
                              selectedMedication
                                ? "checkmark-done"
                                : "add-circle-outline"
                            }
                            size={20}
                            color="#fff"
                            style={{ marginRight: 6 }}
                          />
                          <Text style={styles.btnText}>
                            {selectedMedication
                              ? "حفظ التعديلات"
                              : "إضافة"}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.modalButton, styles.cancelButton]}
                          onPress={() => setModalVisible(false)}
                        >
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color="#fff"
                            style={{ marginRight: 6 }}
                          />
                          <Text style={styles.btnText}>إلغاء</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </ScrollView>
              </KeyboardAvoidingView>
            </Modal>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScreenWithDrawer>
  );
}

const styles = StyleSheet.create({
  // منطقة شريط الحالة (Safe Area) في الأعلى
  safeArea: {
    backgroundColor: "#F5F5F5",
  },

  // الحاوية الرئيسية
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  // دعم النص من اليمين لليسار
  rtlText: {
    writingDirection: "rtl",
    textAlign: "right",
  },

  // سهم الرجوع
  backArrow: {
    marginBottom: 8,
  },

  // ====== قسم البحث ======
  searchSection: {
    position: "relative",
    marginBottom: 10,
  },
  searchIcon: {
    position: "absolute",
    top: Platform.select({ ios: 12, android: 14 }),
    left: 10,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: Platform.select({ ios: 12, android: 10 }),
    paddingLeft: 36,
    borderRadius: 8,
    backgroundColor: "#FFF",
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  patientsList: {
    maxHeight: 150,
    marginBottom: 20,
  },
  patientItem: {
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    paddingVertical: Platform.select({ ios: 14, android: 12 }),
    paddingHorizontal: 16,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  patientRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 8,
    color: "#888",
    fontSize: 14,
  },

  // ====== عناوين وأزرار الإضافة ======
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 8,
  },
  selectPatientText: {
    textAlign: "center",
    marginTop: 50,
    color: "#888",
    fontSize: 16,
  },
  noMedsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
    fontSize: 16,
  },
  headerSection: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: Platform.select({ ios: 12, android: 10 }),
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 6,
  },

  // ======= عرض الأدوية =======
  medItem: {
    flexDirection: "row-reverse",
    backgroundColor: "#FFF",
    padding: Platform.select({ ios: 16, android: 14 }),
    borderRadius: 10,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  patientNameContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 4,
  },
  patientLabel: {
    fontWeight: "bold",
    marginLeft: 4,
    fontSize: 14,
    color: "#555",
  },
  patientNameText: {
    fontSize: 15,
    color: "#444",
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  medActions: {
    justifyContent: "space-between",
    marginRight: 10,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 6,
    marginVertical: 2,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  editBtn: {
    backgroundColor: "#2196F3",
  },
  deleteBtn: {
    backgroundColor: "#F44336",
  },

  // ======= مودال الإضافة/التعديل =======
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    marginTop: Platform.select({ ios: 100, android: 60 }),
    marginHorizontal: 20,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  disabledInput: {
    backgroundColor: "#F0F0F0",
    color: "#777",
  },
  label: {
    marginBottom: 6,
    fontWeight: "bold",
    fontSize: 14,
    color: "#555",
  },
  timePickerButton: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: "#F44336",
    marginLeft: 8,
  },
  btnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
