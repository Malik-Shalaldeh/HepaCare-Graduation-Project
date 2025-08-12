// LabsStack.jsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWithDrawer from '../screensDoctor/ScreenWithDrawer';

const primary = '#00b29c';
const dark = '#2C3E50';

export default function LabsStack({ navigation }) {
  return (
    <ScreenWithDrawer>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.container}>
          <Text style={styles.title}>المختبرات</Text>

          {/* إضافة مختبر */}
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={() => navigation.navigate('LabAdd')}
            activeOpacity={0.9}
          >
            <View style={styles.btnContent}>
              <Ionicons name="add-circle-outline" size={22} color="#fff" />
              <Text style={styles.btnText}>إضافة مختبر</Text>
            </View>
          </TouchableOpacity>

          {/* حذف مختبر */}
          <TouchableOpacity
            style={[styles.btn, styles.btnDark]}
            onPress={() => navigation.navigate('LabDelete')}
            activeOpacity={0.9}
          >
            <View style={styles.btnContent}>
              <Ionicons name="trash-outline" size={22} color="#fff" />
              <Text style={styles.btnText}>حذف مختبر</Text>
            </View>
          </TouchableOpacity>

          {/* عرض المختبرات */}
          <TouchableOpacity
            style={[styles.btn, styles.btnOutline]}
            onPress={() => navigation.navigate('LabsList')}
            activeOpacity={0.9}
          >
            <View style={styles.btnContent}>
              <Ionicons name="list-outline" size={22} color={primary} />
              <Text style={[styles.btnText, { color: primary }]}>
                عرض المختبرات
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScreenWithDrawer>
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
    marginTop: 30,
  },
  btn: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  btnPrimary: {
    backgroundColor: primary,
  },
  btnDark: {
    backgroundColor: dark,
  },
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
