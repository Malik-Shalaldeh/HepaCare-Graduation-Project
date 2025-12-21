// sami - Visits screen (sami-style: simple, axios, focus refresh)

import React, { useState, useEffect, useRef } from "react";
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
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import ScreenWithDrawer from "../screensDoctor/ScreenWithDrawer";
import ENDPOINTS from "../samiendpoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

const primary = colors.buttonPrimary;

const Visits = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const debounceRef = useRef(null);

  const [searchText, setSearchText] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    if (isFocused) {
      loadDoctorIdAndPatients();
    }
  }, [isFocused]);

  const loadDoctorIdAndPatients = async () => {
    try {
      const storedId = await AsyncStorage.getItem("doctor_id");
      if (!storedId) {
        Alert.alert("خطأ", "يرجى تسجيل الدخول مرة أخرى");
        return;
      }
      setDoctorId(storedId);
      await searchPatients(storedId, "");
    } catch (err) {
      console.error("خطأ في جلب معرف الطبيب:", err);
      setError("تعذر جلب بيانات الطبيب");
    }
  };

  const searchPatients = async (docId, query = "") => {
    if (!docId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(ENDPOINTS.searchPatients, {
        params: {
          doctor_id: docId,
          query: query,
        },
      });

      setPatients(response.data || []);
    } catch (err) {
      console.error("خطأ في البحث عن المرضى:", err);
      setError("تعذر جلب قائمة المرضى");
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

  const onSearchChange = (text) => {
    setSearchText(text);

    clearTimeout(debounceRef.current);

    const q = text.trim();
    if (!doctorId) return;

    if (q.length === 0) {
      setPatients([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchPatients(doctorId, q);
    }, 600);
  };

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
                onChangeText={onSearchChange}
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
            ) : error ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>{error}</Text>
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
  errorText: {
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
    color: colors.error || "#d32f2f",
    textAlign: "center",
  },
});

export default Visits;
