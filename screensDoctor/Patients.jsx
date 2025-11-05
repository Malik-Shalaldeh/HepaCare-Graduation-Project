// Patients.jsx

import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const primary = "#00b29c";
const STATUS_BAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

const Patients = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.wrapper}>
      {/* نخلي لون الشريط نفس الهيدر */}
      <StatusBar backgroundColor={primary} barStyle="light-content" />

      {/* الهيدر يبدأ من فوق مباشرة ويحتوي ارتفاع الستاتس بار */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={styles.menuBtn}
        >
          <Ionicons name="menu" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>المرضى</Text>

        <View style={styles.menuBtn} />
      </View>

      {/* محتوى الشاشة */}
      <View style={styles.container}>
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
  wrapper: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    // نخلي الهيدر يبدأ من فوق ويضيف ارتفاع الستاتس بار
    paddingTop: STATUS_BAR_HEIGHT,
    height: 56 + STATUS_BAR_HEIGHT,
    backgroundColor: primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    elevation: 4,
  },
  menuBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 15,
  },
  button: {
    backgroundColor: primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
    elevation: 3,
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
