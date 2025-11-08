// screens/ScreenWithDrawer.jsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const primary = '#00b29c';

const ScreenWithDrawer = ({ title, children, showDrawerIcon = true }) => {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: showDrawerIcon
        ? () => (
            <TouchableOpacity 
              onPress={() => navigation.toggleDrawer()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name='menu' size={28} color="#fff" />
            </TouchableOpacity>
          )
        : undefined,
      headerTitleAlign: 'center',
      headerTitle: title,
      headerStyle: {
        backgroundColor: primary,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, title, showDrawerIcon]);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 15,
  },
});

export default ScreenWithDrawer;




