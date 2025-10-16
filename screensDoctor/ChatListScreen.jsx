import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ENDPOINTS from '../samiendpoint';
import { useNavigation } from '@react-navigation/native';

const ChatListScreen = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const doctorId = await AsyncStorage.getItem('doctorId');
      
      const response = await axios.get(
        `${ENDPOINTS.BASE_URL}/chat/doctor-channels`,
        { params: { doctor_id: doctorId } }
      );

      setChannels(response.data.channels);
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const openChat = (channel) => {
    navigation.navigate('ChatScreen', {
      channelId: channel.channel_id,
      patientName: channel.patient_name,
      patientId: channel.patient_id,
    });
  };

  const renderChannel = ({ item }) => (
    <TouchableOpacity
      style={styles.channelCard}
      onPress={() => openChat(item)}
    >
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle" size={50} color="#2196f3" />
      </View>
      <View style={styles.channelInfo}>
        <Text style={styles.patientName}>{item.patient_name}</Text>
        <Text style={styles.channelSubtext}>اضغط لفتح المحادثة</Text>
      </View>
      <Ionicons name="chevron-back" size={24} color="#666" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196f3" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>المحادثات</Text>
      </View>

      {channels.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>لا توجد محادثات</Text>
        </View>
      ) : (
        <FlatList
          data={channels}
          renderItem={renderChannel}
          keyExtractor={(item) => item.channel_id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#2196f3',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContent: {
    padding: 12,
  },
  channelCard: {
    flexDirection: 'row-reverse',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginLeft: 12,
  },
  channelInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  channelSubtext: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
  },
});

export default ChatListScreen;
