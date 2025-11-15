// screens/ScreenWithDrawer.jsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../style/theme';

const ScreenWithDrawer = ({ title, children, showDrawerIcon = true }) => {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: showDrawerIcon
        ? () => (
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
              style={styles.headerLeftButton}
              activeOpacity={0.8}
              accessible
              accessibilityRole="button"
              accessibilityLabel="فتح قائمة التنقل الجانبية"
              accessibilityHint="يضغط لفتح القائمة الجانبية للتنقل بين الشاشات"
              accessibilityLanguage="ar"
            >
              <Ionicons
                name="menu"
                size={28}
                color={theme.colors.buttonPrimaryText}
                accessibilityRole="image"
                accessibilityLabel="أيقونة قائمة"
                accessibilityLanguage="ar"
              />
            </TouchableOpacity>
          )
        : undefined,
      headerTitleAlign: 'center',
      headerTitle: title,
      headerStyle: {
        backgroundColor: theme.colors.primary,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      headerTintColor: theme.colors.buttonPrimaryText,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: theme.typography.headingSm,
        color: theme.colors.buttonPrimaryText,
        fontFamily: theme.typography.fontFamily,
      },
    });
  }, [navigation, title, showDrawerIcon]);

  return (
    <SafeAreaView
      style={styles.container}
      edges={['left', 'right', 'bottom']}
      accessibilityLanguage="ar"
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerLeftButton: {
    marginLeft: theme.spacing.lg,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
});

export default ScreenWithDrawer;
