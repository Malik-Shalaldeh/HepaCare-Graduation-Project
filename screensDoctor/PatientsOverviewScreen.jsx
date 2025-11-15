// screensDoctor/PatientsOverviewScreen.jsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenWithDrawer from './ScreenWithDrawer';
import ENDPOINTS from '../malikEndPoint';

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
        console.log('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, []);

  const chartData = {
    labels: data.map(item => item.city_name),
    datasets: [
      {
        data: data.map(item => item.patients_count),
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
          <Ionicons name="arrow-back" size={20} color="#2C3E50" />
          <Text style={styles.backText}>رجوع</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : data.length === 0 ? (
          <Text style={styles.message}>لا توجد بيانات مرضى لعرضها حالياً.</Text>
        ) : (
          <View style={styles.chartWrapper}>
            <Text style={styles.title}>
              توزيع المرضى حسب المحافظات الفلسطينية
            </Text>

            <BarChart
              data={chartData}
              width={Dimensions.get('window').width - 40}
              height={230}
              fromZero
              showValuesOnTopOfBars
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(41, 128, 185, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(52, 73, 94, ${opacity})`,
                barPercentage: 0.6,
              }}
              style={styles.chart}
            />
          </View>
        )}
      </View>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
  },
  chartWrapper: {
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});

export default PatientsOverviewScreen;
