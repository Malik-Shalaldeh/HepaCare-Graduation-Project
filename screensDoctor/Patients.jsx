// Patients.jsx

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import ScreenWithDrawer from "../screensDoctor/ScreenWithDrawer";

const primary = "#079a8cff"; // لون هادئ وبارد مناسب لتطبيق طبي

const Patients = () => {
  const navigation = useNavigation();

  return (
    <ScreenWithDrawer>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* زر الرجوع */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* البحث عن سجل مريض */}
      <TouchableOpacity
        style={styles.Button}
        onPress={() => navigation.navigate("PatientListScreen")}
        activeOpacity={0.8}
      >
        <View style={styles.ButtonContent}>
          <Ionicons name="search-outline" size={24} color="#fff" />
          <Text style={styles.ButtonText}>البحث عن سجل مريض</Text>
        </View>
      </TouchableOpacity>

      {/* عرض بيانات مريض */}
      <TouchableOpacity
        style={styles.Button}
        onPress={() => navigation.navigate("DataPatientsListScreen")}
        activeOpacity={0.8}
      >
        <View style={styles.ButtonContent}>
          <Ionicons name="person-circle-outline" size={24} color="#fff" />
          <Text style={styles.ButtonText}>عرض بيانات مريض</Text>
        </View>
      </TouchableOpacity>

      {/* إضافة مريض */}
      <TouchableOpacity
        style={styles.Button}
        onPress={() => navigation.navigate("إضافة مريض")}
        activeOpacity={0.8}
      >
        <View style={styles.ButtonContent}>
          <Ionicons name="person-add-outline" size={24} color="#fff" />
          <Text style={styles.ButtonText}>إضافة مريض</Text>
        </View>
      </TouchableOpacity>

      {/* تتبع الأعراض */}
      <TouchableOpacity
        style={styles.Button}
        onPress={() => navigation.navigate("تتبع الأعراض")}
        activeOpacity={0.8}
      >
        <View style={styles.ButtonContent}>
          <Ionicons name="pulse-outline" size={24} color="#fff" />
          <Text style={styles.ButtonText}>تتبع الأعراض</Text>
        </View>
      </TouchableOpacity>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  Button: {
    backgroundColor: primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.30,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  ButtonContent: {
    flexDirection: "row-reverse", // لأن النص عربي
    alignItems: "center",
    justifyContent: "center",
  },
  ButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
});

export default Patients;
