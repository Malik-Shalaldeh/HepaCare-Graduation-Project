// screensDoctor/Medications.jsx
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import theme from '../style/theme';

export default function Medications() {
  const navigation = useNavigation();

  return (
    <View
      style={styles.container}
    >
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
        translucent={false}
      />

      {/* الهيدر */}
      <View
        style={styles.header}
      >
        {/* زر القائمة الجانبية */}
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          activeOpacity={0.8}
        >
          <Ionicons
            name="menu"
            size={28}
            color={theme.colors.buttonPrimaryText}
          />
        </TouchableOpacity>

        <Text
          style={styles.headerTitle}
        >
          الأدوية
        </Text>
        <View style={{ width: 28 }} />
      </View>

      {/* المحتوى */}
      <View style={styles.content}>

        {/* زر جدولة دواء لمريض */}
        <TouchableOpacity
          style={[styles.button, styles.scheduleButton]}
          onPress={() => navigation.navigate('MedPatientsScreen')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="calendar-outline"
            size={24}
            color={theme.colors.buttonPrimaryText}
            style={styles.icon}
          />
          <Text
            style={[styles.buttonText, styles.buttonTextPrimary]}
          >
            جدولة دواء لمريض
          </Text>
        </TouchableOpacity>

        {/* زر عرض أدوية الصحة */}
        <TouchableOpacity
          style={[styles.button, styles.healthMedsButton]}
          onPress={() => navigation.navigate('HealthMedicationsDisplay')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="medkit-outline"
            size={24}
            color={theme.colors.buttonInfoText}
            style={styles.icon}
          />
          <Text
            style={[styles.buttonText, styles.buttonTextInfo]}
          >
            عرض أدوية الصحة
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop:
          Platform.OS === "android"
          ? StatusBar.currentHeight || 0
          : 44,
    paddingBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  headerTitle: {
    color: theme.colors.buttonPrimaryText,
    fontSize: theme.typography.headingMd,
    fontWeight: 'bold',
    fontFamily: theme.typography.fontFamily,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  button: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light,
  },
  scheduleButton: {
    backgroundColor: theme.colors.buttonPrimary,
  },
  healthMedsButton: {
    backgroundColor: theme.colors.buttonInfo,
  },
  buttonText: {
    fontSize: theme.typography.bodyLg,
    fontWeight: '600',
    marginRight: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily,
  },
  buttonTextPrimary: {
    color: theme.colors.buttonPrimaryText,
  },
  buttonTextInfo: {
    color: theme.colors.buttonInfoText,
  },
  icon: {
    marginLeft: theme.spacing.sm,
  },
});
