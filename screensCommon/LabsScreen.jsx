// sami - واجهة المختبرات المعتمدة
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ENDPOINTS from '../samiendpoint';

const LabsScreen = ({ route }) => {

  const Navigation = useNavigation();
  // لو جتنا المدينة من الباراميتر، بنفلتر المختبرات
  const cityParam = route?.params?.city;
  const [search, setSearch] = useState(cityParam || '');
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب المختبرات من API
  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // استدعاء API لجلب المختبرات
      const response = await fetch(ENDPOINTS.labsList);
      
      if (!response.ok) {
        throw new Error('فشل في جلب البيانات');
      }
      
      const data = await response.json();
      setLabs(data);
    } catch (err) {
      console.error('Error fetching labs:', err);
      setError('حدث خطأ في جلب المختبرات');
    } finally {
      setLoading(false);
    }
  };

  // فلترة المختبرات حسب المدينة
  const filteredLabs = search.trim()
    ? labs.filter(lab => lab.city && typeof lab.city === 'string' && lab.city.trim() === search.trim())
    : labs;

  // بطاقة المختبر
  const renderLabCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.labName}>{item.name || 'غير محدد'}</Text>
      <Text style={styles.labInfo}>الموقع: {item.location || 'غير محدد'}</Text>
      <Text style={styles.labInfo}>رقم التواصل: {item.phone || 'غير محدد'}</Text>
      <Text style={styles.labCity}>({item.city || 'غير محدد'})</Text>
    </View>
  );

  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea} edges={["top","bottom"]}>

        <TouchableOpacity onPress={() => Navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={25} color={'#000'} />
        </TouchableOpacity>

      <View style={styles.container}>

        <TextInput
          style={styles.input}
          placeholder="ابحث باسم المدينة..."
          value={search}
          onChangeText={setSearch}
        />
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00b29c" />
            <Text style={styles.loadingText}>جاري تحميل المختبرات...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchLabs} style={styles.retryButton}>
              <Text style={styles.retryText}>إعادة المحاولة</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredLabs}
            keyExtractor={item => item.id?.toString() || Math.random().toString()}
            renderItem={renderLabCard}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.emptyText}>لا يوجد مختبرات مطابقة</Text>}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00b29c', // نفس الأزرق المستخدم في باقي الشاشات
    marginBottom: 16,
    textAlign: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  backButton: {
    margin:10,
    marginTop:-20
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  labName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00b29c', // أزرق مثل العناوين
    marginBottom: 4,
  },
  labInfo: {
    fontSize: 15,
    color: '#222', // أسود واضح
    marginBottom: 2,
  },
  labCity: {
    fontSize: 14,
    color: '#00b29c',
    alignSelf: 'flex-end',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 30,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#00b29c',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LabsScreen;
