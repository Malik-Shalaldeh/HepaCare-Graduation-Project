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
// لو بدك تربط الأزرار بالتنقّل، فعّل السطر التالي
// import { useNavigation } from '@react-navigation/native';

const primary = '#00b29c';
const dark = '#2C3E50';

export default function Setting() {
  // فعّل التنقّل إذا عندك Navigator
  const navigation = useNavigation();

  const onResetUser = () => {
    Alert.alert('إعادة تعيين', 'سيتم إعادة تعيين كلمة مرور مستخدم.');
    // navigation.navigate('ResetUserPassword');
  };

  const onResetAdmin = () => {
    Alert.alert('إعادة تعيين', 'سيتم إعادة تعيين كلمة مرور الأدمن.');
    // navigation.navigate('ResetAdminPassword');
  };

  const onViewPolicy = () => {
  navigation.navigate('PrivacyPolicyScreen'); // ✅ الاسم كما في Drawer.Screen
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <Text style={styles.title}>الاعدادات</Text>

        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={onResetUser}
          activeOpacity={0.9}
        >
          <View style={styles.btnContent}>
            <Ionicons name="key-outline" size={22} color="#fff" />
            <Text style={styles.btnText}>إعادة تعيين كلمة مرور مستخدم</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnDark]}
          onPress={onResetAdmin}
          activeOpacity={0.9}
        >
          <View style={styles.btnContent}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#fff" />
            <Text style={styles.btnText}>إعادة تعيين كلمة مرور الأدمن</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnOutline]}
          onPress={navigation.navigate('')}
          activeOpacity={0.9}
        >
          <View style={styles.btnContent}>
            <Ionicons name="document-text-outline" size={22} color={primary} />
            <Text style={[styles.btnText, { color: primary }]}>الاطلاع على السياسة</Text>
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
    gap: 14,
  },
  title: {
    color: dark,
    fontSize: 27,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    marginTop:30
  },
  btn: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    // ظل خفيف
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  btnPrimary: { backgroundColor: primary },
  btnDark: { backgroundColor: dark },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: primary,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
