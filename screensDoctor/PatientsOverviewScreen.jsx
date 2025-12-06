// screensDoctor/PatientsOverviewScreen.jsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ScreenWithDrawer from "./ScreenWithDrawer";
import ENDPOINTS from "../malikEndPoint";
import theme from "../style/theme";

const { colors, spacing, radii, shadows, typography } = theme;

const PatientsOverviewScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get(ENDPOINTS.STATS.PATIENTS_BY_CITY);
        setData(res.data || []);
      } catch (error) {
        Alert.alert("خطأ", "تأكد من الاتصال بالإنترنت");
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, []);

  const chartData = {
    labels: data.map((item) => item.city_name),
    datasets: [
      {
        data: data.map((item) => item.patients_count),
      },
    ],
  };

  return (
    <ScreenWithDrawer title="نظرة عامة على المرضى">
      <View style={styles.container}>
        {/* زر رجوع */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color={colors.primary} />
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : data.length === 0 ? (
          <Text style={styles.message}>لا توجد بيانات مرضى حالياً.</Text>
        ) : (
          <>
            <Text style={styles.title}>توزيع المرضى حسب المحافظات</Text>

            <ScrollView
              horizontal
              style={styles.scrollWrapper}
              contentContainerStyle={{ paddingHorizontal: spacing.md }}
            >
                <BarChart
                  data={chartData}
                  width={Dimensions.get("window").width - 10}
                  height={350}
                  fromZero
                  showValuesOnTopOfBars
                  chartConfig={{
                    backgroundGradientFrom: colors.background,
                    backgroundGradientTo: colors.background,
                    decmalPlaces: 0,
                    color: (opacity = 1) =>
                      `rgba(11, 79, 108, ${opacity})`, 
                  }}

                  style={styles.chart}
                />
            </ScrollView>
          </>
        )}
      </View>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },

  backButton: {
    position: "absolute",
    top: spacing.lg,
    left: spacing.lg,
    zIndex: 50,
  },

  title: {
    fontSize: typography.headingSm,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.md,
  },

  scrollWrapper: {
    width: "100%",
    marginTop: spacing.md,
  },

  chartCard: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    ...shadows.medium,
  },

  chart: {
    borderRadius: radii.md,
  },

  message: {
    fontSize: typography.bodyLg,
    color: colors.textSecondary,
    textAlign: "center",
  },
});

export default PatientsOverviewScreen;
