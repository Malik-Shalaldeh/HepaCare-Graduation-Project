// سامي - واجهة المختبرات المعتمدة
// هذه الشاشة تعرض قائمة المختبرات المعتمدة وتسمح بالبحث حسب المدينة

import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TextInput,
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ENDPOINTS from '../samiendpoint';

// المكون الرئيسي لشاشة المختبرات
const LabsScreen = ({ route }) => {
  // إعداد الـ navigation للعودة للصفحة السابقة
  const navigation = useNavigation();
  
  // المتغيرات (State) المستخدمة في الشاشة
  const [search, setSearch] = useState(''); // نص البحث
  const [labs, setLabs] = useState([]); // قائمة المختبرات
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState(null); // رسالة الخطأ

  // جلب المختبرات عند فتح الشاشة
  useEffect(() => {
    fetchLabs();
  }, []);

  // دالة جلب المختبرات من قاعدة البيانات
  const fetchLabs = async () => {
    try {
      // نبدأ التحميل
      setLoading(true);
      setError(null);
      
      // نرسل طلب للخادم لجلب المختبرات
      const response = await fetch(ENDPOINTS.labsList);
      
      // نتحقق من نجاح الطلب
      if (!response.ok) {
        throw new Error('فشل في جلب البيانات');
      }
      
      // نحول الرد إلى JSON ونحفظ المختبرات
      const data = await response.json();
      setLabs(data);
      
    } catch (err) {
      // في حالة حدوث خطأ
      console.error('خطأ في جلب المختبرات:', err);
      setError('حدث خطأ في جلب المختبرات');
    } finally {
      // ننهي حالة التحميل
      setLoading(false);
    }
  };

  // فلترة المختبرات حسب المدينة المدخلة
  const filteredLabs = search.trim()
    ? labs.filter(lab => 
        lab.city && 
        lab.city.toLowerCase().includes(search.toLowerCase())
      )
    : labs;

  // مكون عرض بطاقة المختبر الواحد
  const renderLabCard = ({ item }) => (
    <View style={styles.card}>
      {/* اسم المختبر */}
      <Text style={styles.labName}>{item.name || 'غير محدد'}</Text>
      
      {/* معلومات المختبر */}
      <Text style={styles.labInfo}>
        الموقع: {item.location || 'غير محدد'}
      </Text>
      
      <Text style={styles.labInfo}>
        رقم التواصل: {item.phone || 'غير محدد'}
      </Text>
      
      {/* المدينة */}
      <Text style={styles.labCity}>({item.city || 'غير محدد'})</Text>
    </View>
  );
  // العناصر المعروضة على الشاشة
  return (
    <SafeAreaView style={styles.safeArea} edges={["top","bottom"]}>
      <View style={styles.container}>
        {/* زر الرجوع */}
        <TouchableOpacity 
          onPress={() => {
            navigation.goBack(); // الرجوع للشاشة الرئيسية
            setTimeout(() => {
              navigation.openDrawer(); // ثم فتح الـ Sidebar
            }, 300);
          }} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={25} color={'#00b29c'} />
        </TouchableOpacity>
        {/* حقل البحث */}
        <TextInput
          style={styles.input}
          placeholder="ابحث باسم المدينة..."
          value={search}
          onChangeText={setSearch}
        />
        
        {/* عرض محتوى الشاشة حسب الحالة */}
        {loading ? (
          // شاشة التحميل
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00b29c" />
            <Text style={styles.loadingText}>جاري تحميل المختبرات...</Text>
          </View>
        ) : error ? (
          // شاشة الخطأ
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchLabs} style={styles.retryButton}>
              <Text style={styles.retryText}>إعادة المحاولة</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // قائمة المختبرات
          <FlatList
            data={filteredLabs}
            keyExtractor={item => item.id?.toString()}
            renderItem={renderLabCard}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>لا يوجد مختبرات مطابقة</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

// تنسيقات الشاشة (CSS للـ React Native)
const styles = StyleSheet.create({
  // تنسيق المنطقة الآمنة
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  
  // تنسيق الحاوية الرئيسية
  container: {
    flex: 1,
    padding: 16,
  },
  
  // تنسيق حقل البحث
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 50, // مسافة من الأعلى لتجنب تداخل مع زر الرجوع
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  
  // تنسيق زر الرجوع
  backButton: {
    position: 'absolute',
    top: 10,
    left: 16, // على الشمال
    padding: 8,
    borderRadius: 25,
    backgroundColor: '#f8f8f8',
    zIndex: 1,
    elevation: 3, // ظل للأندرويد
    shadowColor: '#000', // ظل لـ iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  // تنسيق محتوى القائمة
  listContent: {
    paddingBottom: 24,
  },
  
  // تنسيق بطاقة المختبر
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, // للظل في Android
  },
  
  // تنسيق اسم المختبر
  labName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00b29c',
    marginBottom: 4,
  },
  
  // تنسيق معلومات المختبر
  labInfo: {
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  
  // تنسيق المدينة
  labCity: {
    fontSize: 14,
    color: '#00b29c',
    alignSelf: 'flex-end',
  },
  // رسالة عند عدم وجود نتائج
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 30,
    fontSize: 16,
  },
  
  // تنسيق شاشة التحميل
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
  
  // تنسيق شاشة الخطأ
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
  
  // زر إعادة المحاولة
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
