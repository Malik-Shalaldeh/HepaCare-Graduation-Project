import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenWithDrawer from "./ScreenWithDrawer";
import axios from "axios";
import ENDPOINTS from "../samiendpoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

const primary = colors.primary;

const HistoryVisits = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { patientId = null, patientName = "" } = route.params || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [serverVisits, setServerVisits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadVisitsHistory = async () => {
      if (!patientId) return;

      setLoading(true);
      try {
        const response = await axios.get(ENDPOINTS.visitsHistory, {
          params: { patient_id: patientId },
        });

        const visitsData = response.data || [];
        setServerVisits(visitsData);
      } catch (error) {
        console.error("خطأ في جلب سجل الزيارات:", error);
        Alert.alert("خطأ", "تعذر جلب سجل الزيارات");
      } finally {
        setLoading(false);
      }
    };

    loadVisitsHistory();
  }, [patientId]);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("الرئيسية");
    }
  };

  const filteredVisitsData = useMemo(() => {
    if (!searchQuery.trim()) return serverVisits;

    const query = searchQuery.toLowerCase();
    return serverVisits.filter(
      (visit) =>
        (visit.patientName &&
          visit.patientName.toLowerCase().includes(query)) ||
        visit.date.includes(query) ||
        (visit.summary && visit.summary.toLowerCase().includes(query)) ||
        (visit.condition && visit.condition.toLowerCase().includes(query))
    );
  }, [serverVisits, searchQuery]);

  const openVisit = (item) => {
    setSelectedVisit(item);
    setModalVisible(true);
  };

  return (
    <ScreenWithDrawer title="سجل الزيارات">
      <SafeAreaView
        style={[
          styles.container,
          { paddingTop: insets.top + spacing.sm }, // ⬅ توحيد البعد عن الأعلى
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={22} color={primary} />
        </TouchableOpacity>

        {patientName ? (
          <Text style={styles.patientHeader}>{`المريض: ${patientName}`}</Text>
        ) : null}

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث في الزيارات..."
            value={searchQuery}
            onChangeText={setSearchQuery}
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
          <FlatList
            data={filteredVisitsData}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingBottom: spacing.lg }}
            ListEmptyComponent={
              searchQuery.trim() !== "" ? (
                <Text style={styles.noResults}>
                  لا توجد نتائج مطابقة للبحث
                </Text>
              ) : (
                <Text style={styles.noResults}>لا توجد زيارات سابقة</Text>
              )
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => openVisit(item)}
              >
                {!patientName && item.patientName && (
                  <Text
                    style={styles.patientNameInVisit}
                  >{`المريض: ${item.patientName}`}</Text>
                )}

                <View style={styles.cardRow}>
                  <Text
                    style={styles.date}
                  >{`${item.date} | ${item.time}`}</Text>
                  <Ionicons
                    name="chevron-back"
                    size={22}
                    color={colors.textPrimary}
                  />
                </View>

                <Text
                  style={styles.summary}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {item.summary}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}

        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Pressable
                style={styles.closeBtn}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={colors.textPrimary}
                />
              </Pressable>

              <ScrollView contentContainerStyle={styles.modalScrollContent}>
                {selectedVisit && (
                  <>
                    <Text
                      style={styles.modalTitle}
                    >{`زيارة ${selectedVisit.date} في ${selectedVisit.time}`}</Text>

                    <Text style={styles.sectionHeader}>الحالة العامة</Text>
                    <Text style={styles.multiLine}>
                      {selectedVisit.condition || "غير محدد"}
                    </Text>

                    <Text style={styles.sectionHeader}>الالتزام بالعلاج</Text>
                    <Text style={styles.multiLine}>
                      {selectedVisit.adherence || "غير محدد"}
                    </Text>

                    <Text style={styles.sectionHeader}>
                      الملاحظات التفصيلية
                    </Text>
                    <Text style={styles.multiLine}>
                      {selectedVisit.notes || "لا توجد ملاحظات"}
                    </Text>

                    <Text style={styles.sectionHeader}>
                      الجوانب النفسية والاجتماعية
                    </Text>
                    <Text style={styles.multiLine}>
                      {selectedVisit.psychosocial || "لا توجد معلومات"}
                    </Text>

                    <Text style={styles.sectionHeader}>الطبيب المعالج</Text>
                    <Text style={styles.multiLine}>
                      {selectedVisit.doctorName || "غير محدد"}
                    </Text>
                  </>
                )}

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>إغلاق</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  backButton: {
    alignSelf: "flex-start",
    marginLeft: spacing.lg,
    marginBottom: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.light,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.md,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    ...shadows.light,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    textAlign: "right",
    fontFamily: typography.fontFamily,
    fontSize: typography.bodyMd,
    color: colors.textPrimary,
  },
  searchIcon: {
    marginStart: spacing.xs,
  },
  patientHeader: {
    fontSize: typography.headingSm,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: spacing.md,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.background,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.light,
  },
  patientNameInVisit: {
    fontSize: typography.bodyMd,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily,
    color: primary,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
  },
  summary: {
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.lg,
    width: "90%",
    maxHeight: "80%",
    alignSelf: "center",
    writingDirection: "rtl",
    ...shadows.medium,
  },
  modalScrollContent: {
    paddingBottom: spacing.sm,
    paddingRight: 10,
  },
  modalTitle: {
    fontSize: typography.headingSm,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
  },
  closeButton: {
    alignSelf: "center",
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.buttonPrimary,
    borderRadius: radii.md,
    ...shadows.light,
  },
  closeButtonText: {
    color: colors.buttonPrimaryText,
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
  },
  actionBtn: {
    backgroundColor: colors.buttonSuccess,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    alignItems: "center",
  },
  actionBtnText: {
    color: colors.buttonSuccessText,
    fontWeight: "bold",
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: spacing.xl,
    bottom: spacing.xl,
    backgroundColor: colors.buttonPrimary,
    borderRadius: 28,
    ...shadows.medium,
  },
  closeBtn: { alignSelf: "flex-start" },
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
  noResults: {
    fontSize: typography.bodyMd,
    textAlign: "center",
    marginTop: spacing.lg,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
  },
  sectionHeader: {
    fontSize: typography.bodyMd,
    fontWeight: "bold",
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily,
    textAlign: "right",
    writingDirection: "rtl",
    color: colors.textPrimary,
  },
  multiLine: {
    fontSize: typography.bodyMd,
    marginBottom: spacing.sm,
    textAlign: "right",
    fontFamily: typography.fontFamily,
    lineHeight: 24,
    writingDirection: "rtl",
    color: colors.textPrimary,
  },
});

export default HistoryVisits;
