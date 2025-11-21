// sami - Visits screen (باستخدام fetch بدل axios)

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import ScreenWithDrawer from "../screensDoctor/ScreenWithDrawer";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ENDPOINTS from "../samiendpoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

const primary = colors.buttonPrimary;

const Visits = () => {
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doctorId, setDoctorId] = useState(null);

  // جلب doctor_id مرة واحدة عند فتح الشاشة
  useEffect(() => {
    const fetchDoctorId = async () => {
      try {
        const storedId = await AsyncStorage.getItem("doctor_id");
        if (!storedId) {
          Alert.alert("خطأ", "يرجى تسجيل الدخول مرة أخرى");
          return;
        }
        setDoctorId(storedId);
        await searchPatients(storedId, ""); // جلب قائمة أولية (اختياري)
      } catch (error) {
        console.error("خطأ في جلب معرف الطبيب:", error);
        Alert.alert("خطأ", "تعذر جلب بيانات الطبيب");
      }
    };

    fetchDoctorId();
  }, []);

  const searchPatients = async (docId, query = "") => {
    if (!docId) return;

    setLoading(true);
    try {
      const url = `${ENDPOINTS.searchPatients}?doctor_id=${encodeURIComponent(
        docId
      )}&query=${encodeURIComponent(query)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("فشل في جلب قائمة المرضى");
      }

      const data = await response.json();
      setPatients(data || []);
    } catch (error) {
      console.error("خطأ في البحث عن المرضى:", error);
      Alert.alert("خطأ", "تعذر جلب قائمة المرضى");
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      (p.name || "")
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      String(p.id).includes(searchText)
  );

  return (
    <ScreenWithDrawer title="الزيارات">
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.backgroundLight }}
      >
        {!selectedPatient ? (
          <>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="ابحث عن المريض..."
                value={searchText}
                onChangeText={(text) => {
                  setSearchText(text);
                  searchPatients(doctorId, text);
                }}
                placeholderTextColor={colors.textMuted}
              />
              <Ionicons
                name="search"
                size={20}
                color={colors.textMuted}
                style={styles.searchIcon}
              />
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>جار التحميل...</Text>
              </View>
            ) : (
              searchText.trim().length > 0 && (
                <FlatList
                  data={filteredPatients}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.resultItem}
                      onPress={() => setSelectedPatient(item)}
                    >
                      <Text style={styles.resultText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    filteredPatients.length === 0 ? (
                      <Text style={styles.noResults}>
                        لا يوجد نتائج مطابقة.
                      </Text>
                    ) : null
                  }
                  contentContainerStyle={{ paddingBottom: spacing.sm }}
                />
              )
            )}
          </>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedPatient(null)}
            >
              <Ionicons name="arrow-back" size={26} color={primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("تقييم الزيارة", {
                  patientId: selectedPatient.id,
                  patientName: selectedPatient.name,
                })
              }
            >
              <View style={styles.buttonContent}>
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color={colors.buttonPrimaryText}
                />
                <Text style={styles.buttonText}>تقييم زيارة المريض</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("سجل الزيارات", {
                  patientId: selectedPatient.id,
                  patientName: selectedPatient.name,
                })
              }
            >
              <View style={styles.buttonContent}>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={colors.buttonPrimaryText}
                />
                <Text style={styles.buttonText}>عرض سجل الزيارات</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("ملخص الزيارات", {
                  patientId: selectedPatient.id,
                  patientName: selectedPatient.name,
                })
              }
            >
              <View style={styles.buttonContent}>
                <Ionicons
                  name="logo-reddit"
                  size={24}
                  color={colors.buttonPrimaryText}
                />
                <Text style={styles.buttonText}> ملخص الزيارات</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        )}
      </SafeAreaView>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  searchInput: {
    flex: 1,
    textAlign: "right",
    fontSize: typography.bodySm,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
  },
  searchIcon: {
    marginLeft: spacing.xs,
  },
  resultItem: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  resultText: {
    textAlign: "right",
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
  },
  noResults: {
    textAlign: "center",
    marginTop: spacing.lg,
    color: colors.textSecondary,
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
  },
  scrollContainer: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: primary,
    padding: spacing.md,
    borderRadius: radii.lg,
    marginBottom: spacing.lg,
    ...shadows.light,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: colors.buttonPrimaryText,
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
  },
});

export default Visits;
