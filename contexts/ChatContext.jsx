import React, { createContext, useContext, useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chatClient, setChatClient] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  /**
   * الاتصال بـ Stream Chat
   */
  const connectUser = async (userId, userToken, apiKey, userName) => {
    try {
      console.log('Connecting to Stream Chat...', userId);
      
      const client = StreamChat.getInstance(apiKey);
      
      await client.connectUser(
        {
          id: userId,
          name: userName,
        },
        userToken
      );
      
      setChatClient(client);
      setCurrentUser({ id: userId, name: userName });
      setIsReady(true);
      
      console.log('✅ Connected to Stream Chat successfully');
    } catch (error) {
      console.error('❌ Error connecting to Stream Chat:', error);
    }
  };

  /**
   * قطع الاتصال من Stream Chat
   */
  const disconnectUser = async () => {
    try {
      if (chatClient) {
        await chatClient.disconnectUser();
        setChatClient(null);
        setCurrentUser(null);
        setIsReady(false);
        console.log('✅ Disconnected from Stream Chat');
      }
    } catch (error) {
      console.error('❌ Error disconnecting from Stream Chat:', error);
    }
  };

  /**
   * إنشاء أو الحصول على قناة
   */
  const getChannel = async (channelId) => {
    if (!chatClient) {
      throw new Error('Chat client not initialized');
    }

    try {
      const channel = chatClient.channel('messaging', channelId);
      await channel.watch();
      return channel;
    } catch (error) {
      console.error('Error getting channel:', error);
      throw error;
    }
  };

  return (
    <ChatContext.Provider 
      value={{ 
        chatClient, 
        isReady, 
        currentUser,
        connectUser, 
        disconnectUser,
        getChannel 
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};
