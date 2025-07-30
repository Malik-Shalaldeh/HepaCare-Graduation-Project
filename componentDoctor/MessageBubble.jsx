import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MessageBubble = ({ message }) => {
  const isDoctor = message.sender === 'doctor';
  
  return (
    <View style={[
      styles.messageBubble,
      isDoctor ? styles.doctorMessage : styles.patientMessage
    ]}>
      <Text style={styles.messageText}>{message.text}</Text>
      <Text style={styles.timeText}>{message.time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
  },
  doctorMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#8FD3A5', // Light green color for doctor messages
    borderBottomRightRadius: 5,
  },
  patientMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0', // Light gray for patient messages
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timeText: {
    fontSize: 11,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});

export default MessageBubble;
