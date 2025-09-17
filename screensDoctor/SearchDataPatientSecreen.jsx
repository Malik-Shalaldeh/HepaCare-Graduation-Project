// PatientsListScreen.jsx
import { useNavigation } from "@react-navigation/native";
import  { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Keyboard,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const API = "http://192.168.1.2:8000"; // عدّل IP

export default function DataPatientsListScreen() {
  const navigation = useNavigation();

  // ====== بيانات ديناميكية من السيرفر بدل الثابتة ======
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // ====== فلترة: نجيب مباشرة من API حسب النص ======
  const handleSearchChange = async (text) => {
    setSearchTerm(text);
    setSelectedPatient(null);
    const q = text.trim();
    if (!q) { setPatients([]); return; }
    try {
      const res = await fetch(`${API}/patient/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setPatients(
        (data.patients || []).map(p => ({
          id: String(p.patient_id),
          name: p.full_name
        }))
      );
    } catch {
      setPatients([]);
    }
  };

  // ====== دالة عرض عنصر في قائمة المرضى ======
  const renderPatientItem = ({ item }) => (
    <TouchableOpacity
      style={styles.patientItem}
      activeOpacity={0.8}
      onPress={async () => {
        Keyboard.dismiss();
        try {
          const pid = Number(item.id);
          const [detail, labs] = await Promise.all([
            fetch(`${API}/patient/patients/${pid}`).then(r => r.json()),
            fetch(`${API}/lab/results/${pid}`).then(r => r.json()).catch(() => ({results: []})),
          ]);

          const meds = (detail.medications || []).map(m => ({
            name: m.brand_name,
            dosage: m.dose_text,
            frequency: m.frequency_text,
          }));
          const visits = (detail.visits || []).map(v => ({
            date: v.visit_date,
            doctorNotes: v.doctor_notes || "",
          }));
          const symptoms = (detail.symptoms || []).map(s => s.name).join("، ");
          const tests = (labs.results || []).slice(0,5).map(r => r.test_name).join("، ");

          setSelectedPatient({
            id: String(pid),
            name: (detail.patient && detail.patient.full_name) || item.name,
            symptoms,
            tests,
            medications: meds,
            visits,
          });
        } catch {
          setSelectedPatient({
            id: item.id,
            name: item.name,
            symptoms: "",
            tests: "",
            medications: [],
            visits: [],
          });
        }
      }}
    >
      <View style={styles.patientRow}>
        <View style={styles.patientLeft}>
          <Ionicons name="person-circle-outline" size={26} color={styles.patientName.color} />
          <Text style={styles.patientName}>{item.name}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={styles.arrow.color} />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.container}>
          <TouchableOpacity style={{marginBottom:5}} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

        {/* ====== حقل البحث عن المريض ====== */}
        <View style={styles.searchSection}>
          <Ionicons name="search" size={22} color={styles.searchIcon.color} style={styles.searchIcon} />
          <TextInput
            style={[styles.input, styles.rtlText]}
            placeholder="ابحث عن مريض"
            placeholderTextColor={styles.placeholder.color}
            value={searchTerm}
            onChangeText={handleSearchChange}
            autoCorrect={false}
          />
        </View>

        {/* ====== قائمة المرضى المفلترة ====== */}
        {searchTerm.trim() !== "" && (
          <FlatList
            data={patients}
            keyExtractor={(item) => item.id}
            renderItem={renderPatientItem}
            style={styles.patientsList}
            ListEmptyComponent={
              <Text style={styles.emptyText}>لم يتم العثور على مرضى</Text>
            }
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* ====== عرض تفاصيل المريض المُختار ====== */}
        {selectedPatient ? (
          <ScrollView style={styles.detailsContainer}>
            {/* اسم المريض */}
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={22} color={styles.sectionTitle.color} style={styles.sectionIcon} />
              <Text style={[styles.sectionTitle, styles.rtlText]}>اسم المريض</Text>
            </View>
            <Text style={[styles.sectionContent, styles.rtlText]}>
              {selectedPatient.name}
            </Text>

            {/* الأعراض */}
            <View style={styles.sectionHeader}>
              <Ionicons name="alert-circle-outline" size={22} color={styles.sectionTitle.color} style={styles.sectionIcon} />
              <Text style={[styles.sectionTitle, styles.rtlText]}>الأعراض</Text>
            </View>
            <Text style={[styles.sectionContent, styles.rtlText]}>
              {selectedPatient.symptoms || "لا يوجد"}
            </Text>

            {/* الفحوصات */}
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={22} color={styles.sectionTitle.color} style={styles.sectionIcon} />
              <Text style={[styles.sectionTitle, styles.rtlText]}>الفحوصات</Text>
            </View>
            <Text style={[styles.sectionContent, styles.rtlText]}>
              {selectedPatient.tests || "لا يوجد"}
            </Text>

            {/* الأدوية */}
            <View style={styles.sectionHeader}>
              <Ionicons name="medkit-outline" size={22} color={styles.sectionTitle.color} style={styles.sectionIcon} />
              <Text style={[styles.sectionTitle, styles.rtlText]}>الأدوية</Text>
            </View>
            {selectedPatient.medications.length === 0 ? (
              <Text style={[styles.sectionContent, styles.rtlText]}>
                لا يوجد أدوية
              </Text>
            ) : (
              selectedPatient.medications.map((med, index) => (
                <View key={index} style={styles.medItem}>
                  <Ionicons name="ellipse-outline" size={12} color={styles.medText.color} style={{ marginRight: 6 }} />
                  <Text style={[styles.medText, styles.rtlText]}>
                    {med.name} — {med.dosage} — {med.frequency}
                  </Text>
                </View>
              ))
            )}

            {/* الزيارات السابقة */}
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar-outline" size={22} color={styles.sectionTitle.color} style={styles.sectionIcon} />
              <Text style={[styles.sectionTitle, styles.rtlText]}>الزيارات السابقة</Text>
            </View>
            {selectedPatient.visits.length === 0 ? (
              <Text style={[styles.sectionContent, styles.rtlText]}>
                لا توجد زيارات سابقة
              </Text>
            ) : (
              selectedPatient.visits.map((visit, index) => (
                <View key={index} style={styles.visitItem}>
                  <View style={styles.visitHeader}>
                    <Ionicons name="time-outline" size={18} color={styles.visitDate.color} style={{ marginRight: 6 }} />
                    <Text style={[styles.visitDate, styles.rtlText]}>
                      {visit.date}
                    </Text>
                  </View>
                  <Text style={[styles.sectionContent, styles.rtlText]}>
                    {visit.doctorNotes}
                  </Text>
                </View>
              ))
            )}

            {/* زر إغلاق التفاصيل */}
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.8}
              onPress={() => setSelectedPatient(null)}
            >
              <Ionicons name="close-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.backButtonText}>إغلاق التفاصيل</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <Text style={styles.noSelectionText}>
            الرجاء اختيار مريض من القائمة أعلاه لعرض التفاصيل
          </Text>
        )}
      </View>
    </>
  );
}

const primary = "#00b29c";
const primaryLight = "#E0F7F1";
const secondaryText = "#004d40";
const danger = "#e53935";

const styles = StyleSheet.create({
  // ======= الحاوية العامة =======
  container: {
    flex: 1,
    padding: 10,
  },
  rtlText: {
    writingDirection: "rtl",
    textAlign: "right",
  },

  // ====== حقل البحث ======
  searchSection: {
    position: "relative",
    marginBottom: 12,
  },
  searchIcon: {
    position: "absolute",
    top: 12,
    left: 12,
    color: primary,
  },
  input: {
    borderWidth: 1,
    borderColor: primary,
    borderRadius: 8,
    padding: 10,
    paddingLeft: 36,
    backgroundColor: "#FFF",
    fontSize: 16,
    color: secondaryText,
  },
  placeholder: {
    color: primary,
  },

  // ====== قائمة المرضى ======
  patientsList: {
    maxHeight: 180,
  },
  patientItem: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 4,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: primaryLight,
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
    flex: 1,
  },
  patientLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: secondaryText,
    marginRight: 8,
  },
  arrow: {
    fontSize: 20,
    color: primary,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 8,
    color: primary,
    fontSize: 14,
  },

  // ====== نص توجيهي عند عدم اختيار مريض ======
  noSelectionText: {
    textAlign: "center",
    marginTop: 60,
    fontSize: 16,
    color: "#666",
  },

  // ====== حاوية تفاصيل المريض ======
  detailsContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    marginBottom:2
  },

  // ====== عناوين الأقسام ======
  sectionHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 6,
  },
  sectionIcon: {
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: secondaryText,
  },

  // ====== محتوى الأقسام ======
  sectionContent: {
    fontSize: 16,
    lineHeight: 22,
    color: secondaryText,
  },

  // ====== بند دواء ======
  medItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 4,
    paddingLeft: 8,
  },
  medText: {
    fontSize: 15,
    color: secondaryText,
  },

  // ====== بند زيارة سابقة ======
  visitItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: primaryLight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  visitHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 4,
  },
  visitDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: secondaryText,
  },

  // ====== زر إغلاق التفاصيل ======
  backButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: danger,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 6,
  },
});
