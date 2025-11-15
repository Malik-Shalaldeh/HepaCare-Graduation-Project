// screensPatient/PatientMedications.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import ScreenWithDrawer from '../screensDoctor/ScreenWithDrawer';
import theme from '../style/theme';

const PatientMedications = () => {
  const navigation = useNavigation();

  return (
    <ScreenWithDrawer title="الأدوية">
      <View
        style={styles.container}
        accessibilityLanguage="ar"
      >
        {/* ✅ زر "الأدوية التي أتناولها" */}
        <TouchableOpacity
          style={[styles.button, styles.currentMedsButton]}
          onPress={() => navigation.navigate('الأدوية التي أتناولها')}
          activeOpacity={0.9}
          accessible
          accessibilityRole="button"
          accessibilityLabel="الأدوية التي أتناولها"
          accessibilityHint="يفتح شاشة تعرض قائمة الأدوية التي تم وصفها لك"
          accessibilityLanguage="ar"
        >
          <View style={styles.buttonContent}>
            <Ionicons
              name="medkit-outline"
              size={24}
              color={theme.colors.buttonPrimaryText}
              style={styles.icon}
              accessibilityRole="image"
              accessibilityLabel="أيقونة حقيبة دواء"
              accessibilityLanguage="ar"
            />
            <Text
              style={styles.buttonText}
              accessibilityRole="text"
              accessibilityLanguage="ar"
            >
              الأدوية التي أتناولها
            </Text>
          </View>
        </TouchableOpacity>

        {/* ✅ زر "الأدوية المتوفرة في وزارة الصحة" */}
        <TouchableOpacity
          style={[styles.button, styles.mohMedsButton]}
          onPress={() => navigation.navigate('الأدوية المتوفرة في الصحة')}
          activeOpacity={0.9}
          accessible
          accessibilityRole="button"
          accessibilityLabel="الأدوية المتوفرة في وزارة الصحة"
          accessibilityHint="يفتح شاشة تعرض قائمة الأدوية المتوفرة في وزارة الصحة"
          accessibilityLanguage="ar"
        >
          <View style={styles.buttonContent}>
            <Ionicons
              name="list-outline"
              size={24}
              color={theme.colors.buttonPrimaryText}
              style={styles.icon}
              accessibilityRole="image"
              accessibilityLabel="أيقونة قائمة أدوية"
              accessibilityLanguage="ar"
            />
            <Text
              style={styles.buttonText}
              accessibilityRole="text"
              accessibilityLanguage="ar"
            >
              الأدوية المتوفرة في الصحة
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.buttonMuted,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginHorizontal: theme.spacing.xs,
    ...theme.shadows.light,
  },
  currentMedsButton: {
    backgroundColor: theme.colors.buttonPrimary, // زر أساسي
  },
  mohMedsButton: {
    backgroundColor: theme.colors.buttonInfo, // أزرق واضح
  },
  buttonContent: {
    flexDirection: 'row-reverse', // عربي
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: theme.colors.buttonPrimaryText,
    fontSize: theme.typography.headingSm,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1,
    fontFamily: theme.typography.fontFamily,
  },
  icon: {
    marginLeft: theme.spacing.sm,
  },
});

export default PatientMedications;
