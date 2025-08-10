import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// إذا بدك تنقّل لشاشات ثانية، فعّل السطر التالي واستخدمه
// import { useNavigation } from '@react-navigation/native';

const primary = '#00b29c';
const textColor = '#2C3E50';

export default function DoctorsScreen() {
  // فعّل التنقّل إذا عندك Navigator:
  const navigation = useNavigation();

  const onAdd = () => {
    navigation.navigate('AddDoctor');
  };

  const onDelete = () => {
     navigation.navigate('DeleteDoctor');
  };

  const onShowAll = () => {
    navigation.navigate('AllDoctors');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <Text style={styles.title}>إدارة سجلات الأطباء</Text>

        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onAdd} activeOpacity={0.9}>
          <View style={styles.btnContent}>
            <Ionicons name="person-add-outline" size={24} color="#fff" />
            <Text style={styles.btnText}>إضافة طبيب جديد</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn , styles.btnPrimary]} onPress={onDelete} activeOpacity={0.9}>
          <View style={styles.btnContent}>
            <Ionicons name="trash-outline" size={24} color="#fff" />
            <Text style={styles.btnText}>حذف طبيب</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onShowAll} activeOpacity={0.9}>
          <View style={styles.btnContent}>
            <Ionicons name="list-outline" size={24} color="#fff" />
            <Text style={styles.btnText}>عرض جميع الأطباء</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: textColor,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    marginTop:40
  },
  btn: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 14,
    // ظلّ خفيف
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  btnPrimary: {
    backgroundColor: primary,
  },
  btnDanger: {
    backgroundColor: '#ef4444',
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginStart: 8,
  },
});
