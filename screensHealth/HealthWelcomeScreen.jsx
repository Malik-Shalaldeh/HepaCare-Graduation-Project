import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HealthWelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>مرحبا الصحة</Text>
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
