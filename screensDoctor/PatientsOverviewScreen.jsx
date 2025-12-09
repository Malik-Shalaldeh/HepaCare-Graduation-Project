// screensDoctor/PatientsOverviewScreen.jsx
import { useEffect, useState } from "react";
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
import theme from '../style/theme';


const PatientsOverviewScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigation = useNavigation();

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get(ENDPOINTS.STATS.PATIENTS_BY_CITY);
        setData(res.data || []);
      } 
      catch (error) {
        Alert.alert("خطأ", "تأكد من الاتصال بالإنترنت");
      } 
      finally {
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
          <Ionicons name="arrow-back" size={28} color={theme.colors.primary} />
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) 
        : data.length === 0 ? (
          <Text style={styles.message}>لا توجد بيانات مرضى حالياً.</Text>
        ) 
        : (
          <>
            <Text style={styles.title}>توزيع المرضى حسب المحافظات</Text>

            <ScrollView
              horizontal
              style={styles.scrollWrapper}
              contentContainerStyle={{ paddingHorizontal: theme.spacing.md }}
            >
                <BarChart
                  data={chartData}
                  width={Dimensions.get("window").width - 10}
                  height={350}
                  fromZero
                  showValuesOnTopOfBars
                  chartConfig={{
                    backgroundGradientFrom: theme.colors.background,
                    backgroundGradientTo: theme.colors.background,
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
    backgroundColor: theme.colors.backgroundLight,
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center",
  },

  backButton: {
    position: "absolute",
    top: theme.spacing.lg,
    left: theme.spacing.lg,
    zIndex: 50,
  },

  title: {
    fontSize: theme.typography.headingSm,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },

  scrollWrapper: {
    width: "100%",
    marginTop: theme.spacing.md,
  },

  chartCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    ...theme.shadows.medium,
  },

  chart: {
    borderRadius: theme.radii.md,
  },

  message: {
    fontSize: theme.typography.bodyLg,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});

export default PatientsOverviewScreen;
