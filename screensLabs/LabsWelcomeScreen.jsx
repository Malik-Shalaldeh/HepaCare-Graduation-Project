import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LabsWelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>مرحبا المختبرات</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
});
