// screensPatient/TestResultsScreen.js
import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ScreenWithDrawer from '../screensDoctor/ScreenWithDrawer';
import ENDPOINTS from '../malikEndPoint';
import theme from '../style/theme';

export default function TestResultsScreen() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const id = await AsyncStorage.getItem('user_id');
      if (!id) return;

      try {
        const response = await axios.get(
          ENDPOINTS.PATIENT_LAB_RESULTS.BY_ID(id)
        );
        setData(response.data || []);
      } catch (error) {
        Alert.alert('خطا' , "خطأ في جلب البيانات")
      }
    };

    fetchResults();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>🧪 {item.test_name}</Text>
      <Text style={styles.rowText}> 📊 النتيجة: {item.result_value} {item.unit || ''}</Text>
      <Text
        style={[
          styles.rowText,
          item.is_normal ? styles.normalText : styles.abnormalText,
        ]}
      >
        📈 التقييم: {item.is_normal ? 'طبيعي' : 'غير طبيعي'}
      </Text>

      <Text style={styles.rowText}> 💬 ملاحظة: {item.comments || '—'} </Text>
      <Text style={styles.rowText}> 📅 التاريخ: {item.test_date}</Text>
    </View>
  );

  return (
    <ScreenWithDrawer style={{with:'100%'}} title="نتائج الفحوصات">

        <Text style={styles.header}> 🧾 فحوصاتي</Text>

        <FlatList
          data={data}
          keyExtractor={(item, i) => i.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: theme.spacing.lg }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              لا توجد فحوصات
            </Text>
          }
        />
    </ScreenWithDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundLight,
  },
  header: {
    fontSize: theme.typography.headingMd,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    textAlign: 'right',
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
  },
  card: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 6,
    borderLeftColor: theme.colors.primary,
    alignItems: 'flex-end',
    ...theme.shadows.light,
  },
  title: {
    fontSize: theme.typography.bodyLg,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
    textAlign: 'right',
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
  },
  rowText: {
    fontSize: theme.typography.bodyMd,
    color: theme.colors.textSecondary,
    marginBottom: 2,
    textAlign: 'right',
    fontFamily: theme.typography.fontFamily,
  },
  normalText: {
    color: theme.colors.success,
  },
  abnormalText: {
    color: theme.colors.danger,
  },
  empty: {
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    color: theme.colors.textMuted,
    fontSize: theme.typography.bodyLg,
    fontFamily: theme.typography.fontFamily,
  },
});
