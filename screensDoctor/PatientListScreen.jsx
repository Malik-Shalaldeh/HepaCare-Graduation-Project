// sami

// PatientListScreen.js
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ENDPOINTS from "../samiendpoint";

// ✅ استدعاء الثيم الموحّد
import theme, {
  colors,
  spacing,
  radii,
  typography,
  shadows,
} from "../style/theme";

const ESTIMATED_CARD_HEIGHT = 200;

const PatientListScreen = () => {
  const navigation = useNavigation();

  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const doctorId = await AsyncStorage.getItem("doctor_id");

        if (!doctorId) {
          Alert.alert("خطأ", "يرجى تسجيل الدخول مرة أخرى");
          return;
        }

        const url = `${ENDPOINTS.patientsList}?doctor_id=${doctorId}&minimal=true`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }

        const patientsData = await response.json();

        // ✅ توحيد شكل البيانات القادمة من الـ API
        const sanitizedPatients = (patientsData || []).map((patient) => ({
          id: patient.id,
          name:
            patient.name ||
            patient.full_name ||
            `مريض رقم ${patient.id ?? ""}`,
          nationalId: patient.nationalId || patient.national_id || "غير متوفر",
          phone: patient.phone || patient.phone_number || null,
          address: patient.address || null,
          age:
            typeof patient.age === "number" || typeof patient.age === "string"
              ? patient.age
              : "--",
          lastVisit: patient.lastVisit || patient.last_visit || null,
        }));

        setPatients(sanitizedPatients);
      } catch (error) {
        console.error("خطأ في جلب المرضى:", error);
        Alert.alert("خطأ", "تعذر جلب قائمة المرضى");
      }
    };

    loadPatients();
  }, []);

  const handleSearch = useCallback((text) => {
    setSearchQuery(text);
  }, []);

  const filteredPatients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return patients;

    return patients.filter((patient) => {
      const nameMatch = (patient.name || "")
        .toLowerCase()
        .includes(query);
      const idMatch = (patient.nationalId || "").includes(
        searchQuery.trim()
      );
      return nameMatch || idMatch;
    });
  }, [patients, searchQuery]);

  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "غير محدد";
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderPatientItem = useCallback(
    ({ item }) => (
      <View style={styles.patientCard}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.name}</Text>
          <View style={styles.patientDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>{item.nationalId}</Text>
              <Text style={styles.detailLabel}>رقم الهوية:</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>{item.age} سنة</Text>
              <Text style={styles.detailLabel}>العمر:</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>
                {formatDate(item.lastVisit)}
              </Text>
              <Text style={styles.detailLabel}>آخر زيارة:</Text>
            </View>
            {item.phone && (
              <View style={styles.detailItem}>
                <Text style={styles.detailValue}>{item.phone}</Text>
                <Text style={styles.detailLabel}>رقم الهاتف:</Text>
              </View>
            )}
            {item.address && (
              <View style={styles.detailItem}>
                <Text style={styles.detailValue}>{item.address}</Text>
                <Text style={styles.detailLabel}>العنوان:</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.cardActions}>
          {/* زر حالة المريض */}
          <TouchableOpacity
            style={styles.medicalFileButton}
            onPress={() =>
              navigation.navigate("PatientChartScreen", {
                patientId: item.id,
                patientName: item.name,
              })
            }
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.medicalFileButtonText}>حالة المريض</Text>
          </TouchableOpacity>

          {/* زر سجل الزيارات */}
          <TouchableOpacity
            style={styles.visitHistoryButton}
            onPress={() =>
              navigation.navigate("سجل الزيارات", {
                patientId: item.id,
                patientName: item.name,
              })
            }
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.visitHistoryButtonText}>سجل الزيارات</Text>
          </TouchableOpacity>

          {/* زر بيانات المريض التفصيلية */}
          <TouchableOpacity
            style={styles.patientDataButton}
            onPress={() =>
              navigation.navigate("SearchDataPatientSecreen", {
                fromList: true,
                patientId: item.id,
                patientName: item.name,
              })
            }
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.patientDataButtonText}>بيانات المريض</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [navigation]
  );

  const keyExtractor = useCallback((item) => String(item.id), []);

  const getItemLayout = useCallback(
    (_, index) => ({
      length: ESTIMATED_CARD_HEIGHT,
      offset: ESTIMATED_CARD_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color={colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="البحث بالاسم أو رقم الهوية"
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={colors.textMuted}
          />
        </View>
      </View>

      <FlatList
        data={filteredPatients}
        renderItem={renderPatientItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.patientList}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews
        getItemLayout={getItemLayout}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>لا يوجد مرضى</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
    marginLeft: spacing.lg,
  },
  header: {
    height: 60,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.light,
  },
  headerTitle: {
    fontSize: typography.headingMd,
    fontFamily: typography.fontFamily,
    color: colors.background,
  },

  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
    textAlign: "right",
  },

  patientList: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  patientCard: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.light,
  },
  patientInfo: {
    marginBottom: spacing.sm,
  },
  patientName: {
    fontSize: typography.headingSm,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: "right",
  },
  patientDetails: {
    marginBottom: spacing.xs,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: spacing.xs,
  },
  detailLabel: {
    fontSize: typography.bodySm,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  detailValue: {
    fontSize: typography.bodySm,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
    fontWeight: "500",
    marginLeft: spacing.xs,
  },

  cardActions: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: spacing.sm,
    flexWrap: "wrap",
  },

  medicalFileButton: {
    backgroundColor: colors.buttonSuccess,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    // ❌ بدون shadow هنا
  },
  medicalFileButtonText: {
    color: colors.buttonSuccessText,
    fontWeight: "700",
    fontSize: typography.bodySm,
    fontFamily: typography.fontFamily,
  },

  visitHistoryButton: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
    // ❌ بدون shadow
  },
  visitHistoryButtonText: {
    color: colors.buttonPrimaryText,
    fontWeight: "700",
    fontSize: typography.bodySm,
    fontFamily: typography.fontFamily,
  },

  patientDataButton: {
    backgroundColor: colors.buttonSecondary,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    // ❌ بدون shadow
  },
  patientDataButtonText: {
    color: colors.buttonSecondaryText,
    fontWeight: "700",
    fontSize: typography.bodySm,
    fontFamily: typography.fontFamily,
  },

  fab: {
    position: "absolute",
    right: spacing.xl,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.buttonPrimary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.medium,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: colors.overlay,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    paddingBottom: spacing.lg,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.headingSm,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  formContainer: {
    padding: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: "right",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.sm,
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
    textAlign: "right",
    backgroundColor: colors.backgroundLight,
  },
  addButton: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
    ...shadows.light,
  },
  addButtonText: {
    color: colors.buttonPrimaryText,
    fontWeight: "700",
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: typography.bodyLg,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
  },
});

export default PatientListScreen;
