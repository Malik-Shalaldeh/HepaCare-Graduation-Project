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

export default function MyMedicationsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const patientName = route.params?.patientName || "محمد أحمد";
  const dummyMeds = [
    {
      name: "باراسيتامول",
      dosage: "500 مجم",
      frequency: "مرتين يوميًا",
      doseTime: "صباحًا ومساءً",
      timeToTake: "08:00",
      additionalInstructions: "تناول بعد الأكل بنصف ساعة",
    },
    {
      name: "أموكسيللين",
      dosage: "250 مجم",
      frequency: "ثلاث مرات يوميًا",
      doseTime: "صباحًا، ظهرًا، مساءً",
      timeToTake: "13:00",
      additionalInstructions: "اشرب كوب ماء كامل معه",
    },
    {
      name: "ميتفورمين",
      dosage: "850 مجم",
      frequency: "مرتين يوميًا",
      doseTime: "صباحًا ومساءً",
      timeToTake: "20:00",
      additionalInstructions: "",
    },
  ];
  const medications = route.params?.medications?.length
    ? route.params.medications
    : dummyMeds;

  const renderMedicationItem = ({ item }) => (
    <View style={styles.medCard}>
      <Text style={styles.medName}>{item.name}</Text>

      <View style={styles.infoRow}>
        <Ionicons name="flask-outline" size={20} color="#1ABC9C" />
        <Text style={styles.value}>الجرعة: {item.dosage}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="repeat-outline" size={20} color="#1ABC9C" />
        <Text style={styles.value}>التكرار: {item.frequency}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={20} color="#1ABC9C" />
        <Text style={styles.value}>وقت الجرعة: {item.doseTime}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="alarm-outline" size={20} color="#1ABC9C" />
        <Text style={styles.value}>الساعة المخصصة: {item.timeToTake}</Text>
      </View>

      {item.additionalInstructions ? (
        <View style={styles.infoRow}>
          <Ionicons name="information-circle-outline" size={20} color="#1ABC9C" />
          <Text style={styles.value}>
            تعليمات: {item.additionalInstructions}
          </Text>
        </View>
      ) : null}
    </View>
  );

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
          {/* ✨ Enhanced Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Ionicons
              name="medkit-outline"
              size={32}
              color="#ffffff"
              style={{ marginBottom: 4 }}
            />
            <Text style={styles.headerTitle}>{`أدويتي`}</Text>
          </View>

          {/* Content */}
          {medications.length === 0 ? (
            <Text style={styles.noMedsText}>لا توجد أدوية لعرضها</Text>
          ) : (
            <FlatList
              data={medications}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={renderMedicationItem}
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
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: Platform.OS === "android" ? StatusBar.currentHeight + 18 : 18,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
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
    writingDirection: "rtl",
  },
  medName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 12,
    textAlign: "right",
  },
  infoRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 8,
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
    textAlign: "right",
  },
});
