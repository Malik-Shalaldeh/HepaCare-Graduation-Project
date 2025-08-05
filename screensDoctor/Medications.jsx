// screensDoctor/Medications.jsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  primary: '#00b29c',       // أخضر فاتح
  secondary: '#4c68d7',     // أزرق غامق
  accent: '#ff6b6b',        // أحمر فاتح مائل للوردي
  background: '#f9fafb',    // خلفية فاتحة
  textDark: '#333',         // نص داكن
};

export default function Medications() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* شريط الحالة */}
      <StatusBar
        backgroundColor={COLORS.primary}
        barStyle="light-content"
        translucent={false}
      />
      <SafeAreaView style={styles.safeAreaTop} />

      {/* الهيدر */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الأدوية</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* المحتوى */}
      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.secondary }]}
          onPress={() => navigation.navigate('Medicationschedule')}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar-outline" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>جدولة دواء لمريض</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.primary }]}
          onPress={() => navigation.navigate('HealthMedicationsDisplay')}
          activeOpacity={0.8}
        >
          <Ionicons name="medkit-outline" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>عرض أدوية الصحة</Text>
        </TouchableOpacity>

        {/* مثال على زر إضافي لو احتجت */}

      </View>
    </View>
  );
}

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 24,
  },
  button: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  icon: {
    marginLeft: 8,
  },
});
