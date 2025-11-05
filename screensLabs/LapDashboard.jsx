import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ScreenWithDrawer from "../screensDoctor/ScreenWithDrawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const primary = "#2C3E50";
const accent = "#2980B9";
const textColor = "#34495E";

const API = "http://192.168.1.120:8000";

const LapDashboard = () => {
  const navigation = useNavigation();
  const [labName, setLabName] = useState("");

  const today = new Date();
  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];
  const formattedDate = `${today.getDate()} ${
    months[today.getMonth()]
  } ${today.getFullYear()}`;

  useEffect(() => {
    let active = true;

    const fetchLab = async () => {
      try {
        // هذا اللي اللوجن خزّنه، بس غالباً هو user_id مش lab_id
        const storedLabId = await AsyncStorage.getItem("lab_id");

        // أول محاولة: استخدم اللي متخزن
        let url = storedLabId
          ? `${API}/lab/dashboard/${storedLabId}`
          : `${API}/lab/dashboard/1`;

        let res = await fetch(url);

        // لو المختبر بهذا الرقم مش موجود (404) جرّب أول مختبر فعلي في الداتا (1)
        if (res.status === 404) {
          res = await fetch(`${API}/lab/dashboard/1`);
        }

        if (!res.ok) {
          throw new Error("failed");
        }

        const data = await res.json();
        if (!active) return;

        setLabName(data.lab_name || "");
      } catch (err) {
        console.log(err);
        if (active) {
          Alert.alert("خطأ", "تعذر جلب بيانات المختبر.");
          navigation.navigate("LoginScreen");
        }
      }
    };

    fetchLab();
    const unsub = navigation.addListener("focus", fetchLab);

    return () => {
      active = false;
      if (unsub) unsub();
    };
  }, [navigation]);

  return (
    <ScreenWithDrawer title="لوحة التحكم">
      {/* ✅ Header with Hepacare name */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Hepacare</Text>
      </View>

      <View style={styles.container}>
        {/* ✅ بطاقة الترحيب بالمختبر */}
        <View style={styles.card}>
          <Ionicons
            name="happy-outline"
            size={40}
            color={accent}
            style={styles.icon}
          />
          <View>
            <Text style={styles.title}>
              مرحباً {labName ? labName : "..."} 👋
            </Text>
            <Text style={styles.subtitle}>{formattedDate}</Text>
          </View>
        </View>

        {/* ✅ بوكس أنيق فيه عبارة تحفيزية للمختبر */}
        <View style={styles.motivationBox}>
          <Ionicons
            name="heart-circle-outline"
            size={50}
            color="#E74C3C"
            style={{ marginBottom: 10 }}
          />
          <Text style={styles.motivationText}>
            دقتك أمانة... أنجز الفحوصات بدقة وفي الوقت المحدد لضمان جودة النتائج
            وخدمة صحة المرضى على أكمل وجه
          </Text>
        </View>
      </View>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    backgroundColor: "#F8FAFB",
    alignItems: "center",
  },

  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  icon: {
    marginRight: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: primary,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: textColor,
  },

  header: {
    width: "100%",
    backgroundColor: accent,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    alignItems: "center",
  },

  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 3,
  },

  motivationBox: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    marginTop: 10,
  },

  motivationText: {
    fontSize: 16,
    fontWeight: "500",
    color: primary,
    textAlign: "center",
    lineHeight: 24,
  },
});

export default LapDashboard;
