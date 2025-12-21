import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ScreenWithDrawer from '../screensDoctor/ScreenWithDrawer';
import theme from '../style/theme';

const Tests = () => {
  const navigation = useNavigation();

  return (
    <ScreenWithDrawer title={'الفحوصات'}>
     

      {/* زر إدخال نتائج الفحوصات */}
      <TouchableOpacity
        style={[styles.testButton, styles.entryButton]}
        onPress={() => navigation.navigate('InputTestResultScreen')}
        activeOpacity={0.9}
      >
        <View style={styles.testButtonContent}>
          <Ionicons
            name="create-outline"
            size={24}
            color={theme.colors.buttonPrimaryText}
            style={styles.icon}
          />
          <Text
            style={[styles.testButtonText, styles.testButtonTextOnPrimary]}
          >
            ادخال نتائج الفحوصات
          </Text>
        </View>
      </TouchableOpacity>

      {/* زر نتائج الفحوصات */}
      <TouchableOpacity
        style={[styles.testButton, styles.resultsButton]}
        onPress={() => navigation.navigate('TestResultsScreen')}
        activeOpacity={0.9}
      >
        <View style={styles.testButtonContent}>
          <Ionicons
            name="document-text-outline"
            size={24}
            color={theme.colors.buttonSecondaryText}
            style={styles.icon}
          />
          <Text
            style={[styles.testButtonText, styles.testButtonTextOnSecondary]}
          >
            نتائج فحوصات المرضى
          </Text>
        </View>
      </TouchableOpacity>

      {/* زر حساب القيم الطبية */}
      <TouchableOpacity
        style={[styles.testButton, styles.indicatorsButton]}
        onPress={() => navigation.navigate('MedicalIndicatorsScreen')}
        activeOpacity={0.9}
      >
        <View style={styles.testButtonContent}>
          <Ionicons
            name="medkit-outline"
            size={24}
            color={theme.colors.buttonInfoText}
            style={styles.icon}
          />
          <Text
            style={[styles.testButtonText, styles.testButtonTextOnInfo]}
          >
            حساب القيم الطبية
          </Text>
        </View>
      </TouchableOpacity>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({

  testButton: {
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light,
  },
  entryButton: {
    backgroundColor: theme.colors.buttonPrimary,  
  },
  resultsButton: {
    backgroundColor: theme.colors.buttonSecondary, 
  },
  indicatorsButton: {
    backgroundColor: theme.colors.buttonInfo,     
  },
  testButtonContent: {
    flexDirection: 'row-reverse', 
    alignItems: 'center',
    justifyContent: 'center',   
  },
  testButtonText: {
    fontSize: theme.typography.headingSm,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily,
  },
  testButtonTextOnPrimary: {
    color: theme.colors.buttonPrimaryText,
  },
  testButtonTextOnSecondary: {
    color: theme.colors.buttonSecondaryText,
  },
  testButtonTextOnInfo: {
    color: theme.colors.buttonInfoText,
  },
  icon: {
    marginLeft: theme.spacing.sm,
  },
});

export default Tests;
