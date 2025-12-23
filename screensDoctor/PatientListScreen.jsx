// sami - Refactored to sami-style

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ENDPOINTS from "../samiendpoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

const PatientListScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // state
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // load patients data
  const loadPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const doctorId = await AsyncStorage.getItem("doctor_id");

      if (!doctorId) {
        setError("يرجى تسجيل الدخول مرة أخرى");
        return;
      }

      const url = `${ENDPOINTS.patientsList}?doctor_id=${doctorId}`;
      const response = await axios.get(url);

      setPatients(response.data || []);
    } catch (err) {
      console.error("خطأ في جلب المرضى:", err);
      setError("تعذر جلب قائمة المرضى");
    } finally {
      setIsLoading(false);
    }
  };

  // load data on focus
  useEffect(() => {
    if (isFocused && patients.length === 0) {
      loadPatients();
    }
  }, [isFocused]);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

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

  const filteredPatients = patients.filter((patient) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const name = (patient.name || "").toLowerCase();
    const nationalId = patient.nationalId || "";
    return name.includes(q) || nationalId.includes(searchQuery.trim());
  })
  .slice(0, 5);

  const renderPatientItem = ({ item }) => (
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
            <Text style={styles.detailValue}>{formatDate(item.lastVisit)}</Text>
            <Text style={styles.detailLabel}>آخر زيارة:</Text>
          </View>
          {item.phone && (
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>{item.phone}</Text>
              <Text style={styles.detailLabel}>رقم  الهاتف:</Text>
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
        <TouchableOpacity
          style={styles.medicalFileButton}
          onPress={() =>
            navigation.navigate("PatientChartScreen", {
              patientId: item.id,
              patientName: item.name,
            })
          }
        >
          <Text style={styles.medicalFileButtonText}>حالة المريض</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.visitHistoryButton}
          onPress={() =>
            navigation.navigate("سجل الزيارات", {
              patientId: item.id,
              patientName: item.name,
            })
          }
        >
          <Text style={styles.visitHistoryButtonText}>سجل الزيارات</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.patientDataButton}
          onPress={() =>
            navigation.navigate("SearchDataPatientSecreen", {
              fromList: true,
              patientId: item.id,
              patientName: item.name,
            })
          }
        >
          <Text style={styles.patientDataButtonText}>بيانات المريض</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // rendering logic
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.buttonPrimary} />
          <Text style={styles.loadingText}>جاري تحميل المرضى...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadPatients}>
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.patientList}
        showsVerticalScrollIndicator={false}
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
  },
  patientDataButtonText: {
    color: colors.buttonSecondaryText,
    fontWeight: "700",
    fontSize: typography.bodySm,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  errorText: {
    marginTop: spacing.md,
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    textAlign: "center",
  },
  retryButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.buttonPrimary,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  retryButtonText: {
    color: colors.buttonPrimaryText,
    fontWeight: "700",
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
  },
});

export default PatientListScreen;
