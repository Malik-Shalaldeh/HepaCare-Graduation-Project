import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { Channel, MessageList, MessageInput, Chat } from 'stream-chat-expo';
import { useChat } from '../contexts/ChatContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ENDPOINTS from '../samiendpoint';

const ChatScreenPatient = () => {
  const { chatClient, isReady, getChannel } = useChat();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeChannel();
  }, [isReady]);

  const initializeChannel = async () => {
    if (!isReady || !chatClient) {
      setLoading(false);
      return;
    }

    try {
      const patientId = await AsyncStorage.getItem('patientId');
      
      // جلب معلومات القناة من Backend
      const response = await axios.get(
        `${ENDPOINTS.BASE_URL}/chat/patient-channel`,
        { params: { patient_id: patientId } }
      );

      const { channel_id } = response.data;
      
      // الحصول على القناة من Stream
      const ch = await getChannel(channel_id);
      setChannel(ch);
    } catch (error) {
      console.error('Error initializing channel:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196f3" />
      </View>
    );
  }

  if (!channel) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196f3" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <View style={styles.chatContainer}>
            <MessageList />
            <MessageInput />
          </View>
        </Channel>
      </Chat>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  chatContainer: {
    flex: 1,
  },
});

export default ChatScreenPatient;
