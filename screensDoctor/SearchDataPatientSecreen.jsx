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
import AbedEndPoint from "../AbedEndPoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

export default function DataPatientsListScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const fromList = route.params?.fromList || false;
  const preselectedId = route.params?.patientId || null;
  const preselectedName = route.params?.patientName || "";

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

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

  useEffect(() => {
    if (fromList && preselectedId) {
      loadPatientDetails(Number(preselectedId), preselectedName);
    }
  }, [fromList, preselectedId]);

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
          <Ionicons
            name="person-circle-outline"
            size={28}
            color={colors.primary}
          />
          <View style={{ marginRight: spacing.sm }}>
            <Text style={styles.patientName}>{item.name}</Text>
            <Text style={styles.patientHint}>اضغط لعرض بيانات المريض</Text>
          </View>
        </View>
        <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <StatusBar
        backgroundColor={colors.primary}
        barStyle="light-content"
        translucent={false}
      />

      <SafeAreaView style={styles.safeTop} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
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

      <View style={styles.container}>
        {!fromList && (
          <View style={styles.searchSection}>
            <Ionicons
              name="search"
              size={20}
              color={colors.textMuted}
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.input, styles.rtlText]}
              placeholder="ابحث عن مريض بالاسم"
              placeholderTextColor={colors.textMuted}
              value={searchTerm}
              onChangeText={handleSearchChange}
              autoCorrect={false}
              returnKeyType="search"
            />
          </View>
        )}

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

        {selectedPatient && (
          <ScrollView
            style={styles.detailsContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.mainCard}>
              <View style={styles.mainCardRow}>
                <Ionicons
                  name="person-circle-outline"
                  size={40}
                  color={colors.primary}
                />
                <View style={{ marginRight: spacing.sm + 2 }}>
                  <Text style={styles.mainName}>{selectedPatient.name}</Text>
                  <Text style={styles.mainLabel}>معلومات المريض</Text>
                </View>
              </View>
            </View>

            <View style={styles.block}>
              <View style={styles.blockHeader}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color={colors.primary}
                />
                <Text style={styles.blockTitle}>الأعراض الحالية</Text>
              </View>
              <Text style={styles.blockText}>
                {selectedPatient.symptoms || "لا توجد أعراض مسجلة"}
              </Text>
            </View>

            <View style={styles.block}>
              <View style={styles.blockHeader}>
                <Ionicons
                  name="flask-outline"
                  size={18}
                  color={colors.primary}
                />
                <Text style={styles.blockTitle}>أهم الفحوصات</Text>
              </View>
              <Text style={styles.blockText}>
                {selectedPatient.tests || "لا توجد فحوصات مسجلة"}
              </Text>
            </View>

            <View style={styles.block}>
              <View style={styles.blockHeader}>
                <Ionicons
                  name="medkit-outline"
                  size={18}
                  color={colors.primary}
                />
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
                      color={colors.accent}
                      style={{ marginLeft: spacing.xs + 2 }}
                    />
                    <Text style={styles.medText}>
                      {med.name} - {med.dosage} - {med.frequency}
                    </Text>
                  </View>
                ))
              )}
            </View>

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
                  style={{ marginLeft: spacing.xs + 2 }}
                />
                <Text style={styles.closeText}>إخفاء تفاصيل المريض</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}

        {!fromList && !selectedPatient && searchTerm.trim() === "" && (
          <Text style={styles.helperText}>
            ابدأ بالبحث عن مريض لعرض بياناته.
          </Text>
        )}

        {fromList && !selectedPatient && (
          <Text style={styles.helperText}>جاري تحميل بيانات المريض...</Text>
        )}
      </View>

      <SafeAreaView style={styles.safeBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.backgroundLight },

  safeTop: {
    backgroundColor: colors.primary,
    ...Platform.select({
      ios: {},
      android: { height: StatusBar.currentHeight || 0 },
    }),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
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

  headerCenter: { flex: 1, marginHorizontal: spacing.sm + 2 },

  headerTitle: {
    fontSize: typography.headingSm,
    fontWeight: "700",
    color: "#fff",
    textAlign: "right",
    fontFamily: typography.fontFamily,
  },

  headerSubtitle: {
    fontSize: typography.bodySm,
    color: "rgba(255,255,255,0.85)",
    textAlign: "right",
    fontFamily: typography.fontFamily,
  },

  headerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm + 2,
    paddingBottom: spacing.xs + 2,
    backgroundColor: colors.backgroundLight,
  },

  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: typography.fontFamily,
  },

  searchSection: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm + 2,
    ...shadows.light,
  },

  searchIcon: { marginLeft: spacing.xs + 2 },

  input: {
    flex: 1,
    fontSize: typography.bodyMd,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
  },

  patientsList: { maxHeight: 180, marginBottom: spacing.sm },

  patientItem: {
    backgroundColor: colors.background,
    borderRadius: radii.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.light,
  },

  patientRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },

  patientLeft: { flexDirection: "row-reverse", alignItems: "center" },

  patientName: {
    fontSize: typography.bodyLg,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: typography.fontFamily,
  },

  patientHint: {
    fontSize: typography.bodySm,
    color: colors.textMuted,
    textAlign: "right",
    fontFamily: typography.fontFamily,
  },

  emptyText: {
    textAlign: "center",
    color: colors.textMuted,
    marginTop: spacing.xs + 2,
    fontSize: typography.bodySm,
    fontFamily: typography.fontFamily,
  },

  helperText: {
    textAlign: "center",
    color: colors.textMuted,
    marginTop: spacing.lg,
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
  },

  detailsContainer: { flex: 1, marginTop: spacing.sm },

  mainCard: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm + 2,
    ...shadows.light,
  },

  mainCardRow: { flexDirection: "row-reverse", alignItems: "center" },

  mainName: {
    fontSize: typography.headingSm,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: typography.fontFamily,
  },

  mainLabel: {
    fontSize: typography.bodySm,
    color: colors.accent,
    textAlign: "right",
    fontFamily: typography.fontFamily,
  },

  block: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    ...shadows.light,
  },

  blockHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: spacing.xs,
  },

  blockTitle: {
    fontSize: typography.bodyMd,
    fontWeight: "600",
    color: colors.textPrimary,
    marginRight: spacing.xs + 2,
    fontFamily: typography.fontFamily,
  },

  blockText: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: "right",
    fontFamily: typography.fontFamily,
  },

  medItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: spacing.xs,
  },

  medText: {
    fontSize: typography.bodySm,
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: typography.fontFamily,
  },

  closeBtn: {
    marginTop: spacing.sm + 2,
    marginBottom: spacing.sm,
    alignSelf: "center",
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xs + 4,
    borderRadius: 999,
    ...shadows.medium,
  },

  closeText: {
    color: "#fff",
    fontSize: typography.bodySm,
    fontWeight: "600",
    fontFamily: typography.fontFamily,
  },

  safeBottom: { backgroundColor: colors.backgroundLight },
});
