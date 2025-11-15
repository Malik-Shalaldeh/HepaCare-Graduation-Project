// screensAdmin/DoctorsOperationsScreen.jsx
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
import { useNavigation } from '@react-navigation/native';
import theme from '../style/theme';

export default function DoctorsScreen() {
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
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <View style={styles.container}>
        <Text style={styles.title}>إدارة سجلات الأطباء</Text>

        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={onAdd}
          activeOpacity={0.9}
        >
          <View style={styles.btnContent}>
            <Ionicons name="person-add-outline" size={24} color={theme.colors.buttonPrimaryText} />
            <Text style={styles.btnText}>إضافة طبيب جديد</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={onDelete}
          activeOpacity={0.9}
        >
          <View style={styles.btnContent}>
            <Ionicons name="trash-outline" size={24} color={theme.colors.buttonPrimaryText} />
            <Text style={styles.btnText}>تعطيل /تفعيل حساب طبيب</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={onShowAll}
          activeOpacity={0.9}
        >
          <View style={styles.btnContent}>
            <Ionicons name="list-outline" size={24} color={theme.colors.buttonPrimaryText} />
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
    backgroundColor: theme.colors.backgroundLight,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.headingMd,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.xl,
    fontFamily: theme.typography.fontFamily,
  },
  btn: {
    borderRadius: theme.radii.lg,
    paddingVertical: theme.spacing.md + 4,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.buttonPrimary,
    ...theme.shadows.medium,
  },
  btnPrimary: {
    backgroundColor: theme.colors.buttonPrimary,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: theme.colors.buttonPrimaryText,
    fontSize: theme.typography.bodyLg,
    fontWeight: '700',
    marginStart: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily,
  },
});
