import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import ScreenWithDrawer from "../screensDoctor/ScreenWithDrawer";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function AvailableMedicationsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const dummyMeds = [
    "باراسيتامول",
    "أموكسيللين",
    "ميتفورمين",
    "لورازيبام",
    "أوميبرازول",
  ];
  const displayedMeds =
    route.params?.displayedMeds?.length > 0
      ? route.params.displayedMeds
      : dummyMeds;

  return (
    <ScreenWithDrawer>
      <SafeAreaView style={styles.safeArea}>
        {/* Dark Status Bar */}
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Ionicons name="medkit-outline" size={36} color="#ffffff" style={{ marginBottom: 8 }} />
            <Text style={styles.headerTitle}>الأدوية المتوفرة بالصحة</Text>
          </View>

          {/* Medication List */}
          {displayedMeds.length === 0 ? (
            <Text style={styles.noMedsText}>لا توجد أدوية متاحة</Text>
          ) : (
            <FlatList
              data={displayedMeds}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={({ item }) => (
                <View style={styles.medCard}>
                  <View style={styles.iconWrapper}>
                    <Ionicons
                      name="bandage-outline"
                      size={20}
                      color="#16A085"
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
    </ScreenWithDrawer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 0,
  },
  headerContainer: {
    width: "100%",
    backgroundColor: "#16A085",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 20,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    writingDirection: "rtl",
  },
  noMedsText: {
    textAlign: "center",
    marginTop: 120,
    color: "#6b7280",
    fontSize: 16,
    writingDirection: "rtl",
  },
  medList: {
    paddingBottom: 100,
  },
  medCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderLeftWidth: 6,
    borderLeftColor: "#1ABC9C",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0F7F2",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  medName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
    textAlign: "right",
    letterSpacing: 0.5,
  },
});
