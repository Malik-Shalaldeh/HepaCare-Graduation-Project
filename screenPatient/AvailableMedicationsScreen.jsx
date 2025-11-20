// screenPatient/AvailableMedicationsScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AbedEndPoint from "../AbedEndPoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

export default function AvailableMedicationsScreen() {
  const route = useRoute();

  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fromParams =
      route.params &&
      route.params.displayedMeds &&
      route.params.displayedMeds.length > 0
        ? route.params.displayedMeds
        : null;

    if (fromParams) {
      setMeds(fromParams);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(`${AbedEndPoint.medicationsList}/`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("bad status");
        const data = await res.json();
        const names =
          Array.isArray(data) && data.length > 0
            ? data
                .map((m) => {
                  return (
                    m.brand_name ||
                    m.brandName ||
                    m.generic_name ||
                    m.genericName ||
                    ""
                  );
                })
                .filter((x) => x && x.trim().length > 0)
            : [];
        setMeds(names);
      } catch (e) {
        setMeds([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [route.params]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.container}>
        {loading ? (
          <Text style={styles.noMedsText}>جاري التحميل...</Text>
        ) : meds.length === 0 ? (
          <Text style={styles.noMedsText}>لا توجد أدوية متاحة</Text>
        ) : (
          <FlatList
            data={meds}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <View style={styles.medCard}>
                <View style={styles.iconWrapper}>
                  <Ionicons
                    name="bandage-outline"
                    size={20}
                    color={colors.accent}
                  />
                </View>
                <Text style={styles.medName}>{item}</Text>
              </View>
            )}
            contentContainerStyle={styles.medList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.xl,
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight + spacing.sm
        : spacing.sm,
  },
  noMedsText: {
    textAlign: "center",
    marginTop: 120,
    color: colors.textMuted,
    fontSize: typography.bodyLg,
    writingDirection: "rtl",
    fontFamily: typography.fontFamily,
  },
  medList: {
    paddingBottom: 100,
    paddingTop: spacing.sm,
  },
  medCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    borderLeftWidth: 6,
    borderLeftColor: colors.accent,
    ...shadows.light,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.buttonMuted,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.md,
  },
  medName: {
    flex: 1,
    fontSize: typography.headingSm,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "right",
    letterSpacing: 0.5,
    fontFamily: typography.fontFamily,
  },
});
