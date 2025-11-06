// Patients.jsx
import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const COLORS = {
  primary: "#00b29c",
  background: "#f2f2f2",
};

const Patients = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.primary}
        barStyle="light-content"
        translucent={false}
      />

      {/* Safe Area للأعلى */}
      <SafeAreaView style={styles.safeAreaTop} />

      {/* الهيدر */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>المرضى</Text>

        <View style={{ width: 28 }} />
      </View>

      {/* المحتوى */}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("PatientListScreen")}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="search-outline" size={22} color="#fff" />
            <Text style={styles.buttonText}>البحث عن سجل مريض</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("DataPatientsListScreen")}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="person-circle-outline" size={22} color="#fff" />
            <Text style={styles.buttonText}>عرض بيانات مريض</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("إضافة مريض")}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="person-add-outline" size={22} color="#fff" />
            <Text style={styles.buttonText}>إضافة مريض</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("تتبع الأعراض")}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="pulse-outline" size={22} color="#fff" />
            <Text style={styles.buttonText}>تتبع الأعراض</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaTop: {
    backgroundColor: COLORS.primary,
    ...Platform.select({
      ios: {},
      android: { height: StatusBar.currentHeight },
    }),
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 56,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 15,
    marginTop: 24,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
});

export default Patients;
