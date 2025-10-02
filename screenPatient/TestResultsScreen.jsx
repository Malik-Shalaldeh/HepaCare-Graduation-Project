import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ScreenWithDrawer from '../screensDoctor/ScreenWithDrawer';

const API = 'http://192.168.1.14:8000'; // عدّل العنوان حسب السيرفر

export default function TestResultsScreen() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('user_id');
      if (!id) return;
      try {
        const res = await axios.get(`${API}/patient/lab-results/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>🧪 {item.test_name}</Text>
      <Text>📊 النتيجة: {item.result_value} {item.unit || ''}</Text>
      <Text>📈 التقييم: {item.is_normal ? 'طبيعي' : 'غير طبيعي'}</Text>
      <Text>💬 ملاحظة: {item.comments || '—'}</Text>
      <Text>📅 التاريخ: {item.test_date}</Text>
    </View>
  );

  return (
    <ScreenWithDrawer>
      <View style={styles.container}>
        <Text style={styles.header}>🧾 فحوصاتي</Text>
        <FlatList
          data={data}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>لا توجد فحوصات</Text>}
        />
      </View>
    </ScreenWithDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F6F8',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'right',
    color: '#2C3E50',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 6,
    borderLeftColor: '#00b29c',
    alignItems:'flex-end'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'right',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});
