import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Keyboard,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AbedEndPoint from "../AbedEndPoint"; // ✔ استدعاء ملف الاندبوينت

export default function DataPatientsListScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const fromList = route.params?.fromList || false;
  const preselectedId = route.params?.patientId || null;
  const preselectedName = route.params?.patientName || "";

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // جلب بيانات مريض محدد (بدون زيارات)
  const loadPatientDetails = async (pid, fallbackName) => {
    try {
      const [detail, labs] = await Promise.all([
        fetch(AbedEndPoint.patientById(pid)).then((r) => r.json()),
        fetch(AbedEndPoint.labResultsByPatient(pid))
          .then((r) => r.json())
          .catch(() => ({ results: [] })),
      ]);

      const meds = (detail.medications || []).map((m) => ({
        name: m.brand_name,
        dosage: m.dose_text,
        frequency: m.frequency_text,
      }));

      const symptoms = (detail.symptoms || []).map((s) => s.name).join("، ");
      const tests = (labs.results || [])
        .slice(0, 5)
        .map((r) => r.test_name)
        .join("، ");

      setSelectedPatient({
        id: String(pid),
        name:
          (detail.patient && detail.patient.full_name) ||
          fallbackName ||
          "المريض",
        symptoms,
        tests,
        medications: meds,
      });
    } catch {
      setSelectedPatient({
        id: String(pid),
        name: fallbackName || "المريض",
        symptoms: "",
        tests: "",
        medications: [],
      });
    }
  };

  // لو جاي من PatientListScreen نحمل بيانات المريض مباشرة
  useEffect(() => {
    if (fromList && preselectedId) {
      loadPatientDetails(Number(preselectedId), preselectedName);
    }
  }, [fromList, preselectedId]);

  // البحث اليدوي (لو مش fromList)
  const handleSearchChange = async (text) => {
    setSearchTerm(text);
    setSelectedPatient(null);

    if (fromList) return;

    const q = text.trim();
    if (!q) {
      setPatients([]);
      return;
    }

    try {
      const res = await fetch(
        `${AbedEndPoint.patientSearch}?q=${encodeURIComponent(q)}`
      );
      const data = await res.json();
      setPatients(
        (data.patients || []).map((p) => ({
          id: String(p.patient_id),
          name: p.full_name,
        }))
      );
    } catch {
      setPatients([]);
    }
  };

  // عنصر مريض في قائمة البحث
  const renderPatientItem = ({ item }) => (
    <TouchableOpacity
      style={styles.patientItem}
      activeOpacity={0.8}
      onPress={async () => {
        Keyboard.dismiss();
        await loadPatientDetails(Number(item.id), item.name);
      }}
    >
      <View style={styles.patientRow}>
        <View style={styles.patientLeft}>
          <Ionicons name="person-circle-outline" size={28} color={primary} />
          <View style={{ marginRight: 8 }}>
            <Text style={styles.patientName}>{item.name}</Text>
            <Text style={styles.patientHint}>اضغط لعرض بيانات المريض</Text>
          </View>
        </View>
        {/* لون السهم واضح على الخلفية البيضاء */}
        <Ionicons name="chevron-back" size={20} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      {/* شريط الحالة */}
      <StatusBar
        backgroundColor={primary}
        barStyle="light-content"
        translucent={false}
      />

      {/* Safe Area أعلى للشق (iOS/Android) */}
      <SafeAreaView style={styles.safeTop} />

      {/* الهيدر */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {/* جعل السهم أبيض ليبان على الخلفية الخضراء */}
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>بيانات المريض</Text>
          <Text style={styles.headerSubtitle}>
            استعراض معلومات المريض بشكل مبسّط
          </Text>
        </View>

        <View style={styles.headerIconCircle}>
          <Ionicons name="medkit-outline" size={20} color="#fff" />
        </View>
      </View>

      {/* المحتوى */}
      <View style={styles.container}>
        {/* البحث - يظهر فقط إذا مش جاي من قائمة المرضى */}
        {!fromList && (
          <View style={styles.searchSection}>
            <Ionicons
              name="search"
              size={20}
              color="#9ca3af"
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.input, styles.rtlText]}
              placeholder="ابحث عن مريض بالاسم"
              placeholderTextColor="#9ca3af"
              value={searchTerm}
              onChangeText={handleSearchChange}
              autoCorrect={false}
              returnKeyType="search"
            />
          </View>
        )}

        {/* قائمة نتائج البحث */}
        {!fromList && searchTerm.trim() !== "" && (
          <FlatList
            data={patients}
            keyExtractor={(item) => item.id}
            renderItem={renderPatientItem}
            style={styles.patientsList}
            ListEmptyComponent={
              <Text style={styles.emptyText}>لم يتم العثور على مرضى</Text>
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* تفاصيل المريض */}
        {selectedPatient && (
          <ScrollView
            style={styles.detailsContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* كارد اسم المريض */}
            <View style={styles.mainCard}>
              <View style={styles.mainCardRow}>
                <Ionicons
                  name="person-circle-outline"
                  size={40}
                  color={primary}
                />
                <View style={{ marginRight: 10 }}>
                  <Text style={styles.mainName}>{selectedPatient.name}</Text>
                  <Text style={styles.mainLabel}>معلومات المريض</Text>
                </View>
              </View>
            </View>

            {/* الأعراض */}
            <View style={styles.block}>
              <View style={styles.blockHeader}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color={primary}
                />
                <Text style={styles.blockTitle}>الأعراض الحالية</Text>
              </View>
              <Text style={styles.blockText}>
                {selectedPatient.symptoms || "لا توجد أعراض مسجلة"}
              </Text>
            </View>

            {/* الفحوصات */}
            <View style={styles.block}>
              <View style={styles.blockHeader}>
                <Ionicons name="flask-outline" size={18} color={primary} />
                <Text style={styles.blockTitle}>أهم الفحوصات</Text>
              </View>
              <Text style={styles.blockText}>
                {selectedPatient.tests || "لا توجد فحوصات مسجلة"}
              </Text>
            </View>

            {/* الأدوية */}
            <View style={styles.block}>
              <View style={styles.blockHeader}>
                <Ionicons name="medkit-outline" size={18} color={primary} />
                <Text style={styles.blockTitle}>الأدوية الموصوفة</Text>
              </View>
              {selectedPatient.medications.length === 0 ? (
                <Text style={styles.blockText}>لا يوجد أدوية مسجلة</Text>
              ) : (
                selectedPatient.medications.map((med, index) => (
                  <View key={index} style={styles.medItem}>
                    <Ionicons
                      name="ellipse-outline"
                      size={8}
                      color={primary}
                      style={{ marginLeft: 6 }}
                    />
                    <Text style={styles.medText}>
                      {med.name} - {med.dosage} - {med.frequency}
                    </Text>
                  </View>
                ))
              )}
            </View>

            {/* زر إغلاق في وضع البحث فقط */}
            {!fromList && (
              <TouchableOpacity
                style={styles.closeBtn}
                activeOpacity={0.85}
                onPress={() => setSelectedPatient(null)}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={18}
                  color="#fff"
                  style={{ marginLeft: 6 }}
                />
                <Text style={styles.closeText}>إخفاء تفاصيل المريض</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}

        {/* رسائل مساعدة */}
        {!fromList && !selectedPatient && searchTerm.trim() === "" && (
          <Text style={styles.helperText}>
            ابدأ بالبحث عن مريض لعرض بياناته.
          </Text>
        )}

        {fromList && !selectedPatient && (
          <Text style={styles.helperText}>جاري تحميل بيانات المريض...</Text>
        )}
      </View>

      {/* Safe Area أسفل لعدم التصادم مع شريط الهوم في الآيفون */}
      <SafeAreaView style={styles.safeBottom} />
    </View>
  );
}

const primary = "#00b29c";
const bg = "#f5fafb";
const cardBg = "#ffffff";
const textMain = "#023047";
const textSoft = "#6b7280";
const borderSoft = "#e5e7eb";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: bg },
  safeTop: {
    backgroundColor: primary,
    ...Platform.select({
      ios: {},
      android: { height: StatusBar.currentHeight || 0 },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  headerCenter: { flex: 1, marginHorizontal: 10 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "right",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    textAlign: "right",
  },
  headerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  rtlText: { textAlign: "right", writingDirection: "rtl" },

  // البحث
  searchSection: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: cardBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: borderSoft,
    marginBottom: 10,
  },
  searchIcon: { marginLeft: 6 },
  input: { flex: 1, fontSize: 14, color: textMain },

  // قائمة المرضى
  patientsList: { maxHeight: 180, marginBottom: 8 },
  patientItem: {
    backgroundColor: cardBg,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: borderSoft,
  },
  patientRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  patientLeft: { flexDirection: "row-reverse", alignItems: "center" },
  patientName: { fontSize: 15, fontWeight: "600", color: textMain },
  patientHint: { fontSize: 11, color: textSoft },
  emptyText: {
    textAlign: "center",
    color: textSoft,
    marginTop: 6,
    fontSize: 13,
  },
  helperText: {
    textAlign: "center",
    color: textSoft,
    marginTop: 16,
    fontSize: 14,
  },

  // تفاصيل المريض
  detailsContainer: { flex: 1, marginTop: 8 },
  mainCard: {
    backgroundColor: cardBg,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: borderSoft,
    marginBottom: 10,
  },
  mainCardRow: { flexDirection: "row-reverse", alignItems: "center" },
  mainName: {
    fontSize: 18,
    fontWeight: "700",
    color: textMain,
    textAlign: "right",
  },
  mainLabel: { fontSize: 12, color: primary, textAlign: "right" },

  block: {
    backgroundColor: cardBg,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: borderSoft,
    marginBottom: 8,
  },
  blockHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 4,
  },
  blockTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: textMain,
    marginRight: 6,
  },
  blockText: {
    fontSize: 13,
    color: textSoft,
    lineHeight: 20,
    textAlign: "right",
  },

  medItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 4,
  },
  medText: { fontSize: 13, color: textMain, textAlign: "right" },

  // (شيلنا كل ستايلات الزيارات السابقة)
  closeBtn: {
    marginTop: 10,
    marginBottom: 8,
    alignSelf: "center",
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  closeText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  safeBottom: { backgroundColor: bg },
});
