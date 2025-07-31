// screens/ScreenWithDrawer.jsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      {children}
    </View>
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




