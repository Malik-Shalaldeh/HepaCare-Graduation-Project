import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ENDPOINTS from '../samiendpoint';

/*********************** Helper Components ************************/ 
const ChatHeader = ({ doctorName, doctorAvatar, onBack }) => (
  <View style={headerStyles.container}>
    {onBack && (
      <TouchableOpacity style={headerStyles.backBtn} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
    )}
    <View style={headerStyles.titleWrapper}>
      <Text style={headerStyles.title}>{doctorName || 'الطبيب المشرف'}</Text>
      <Text style={headerStyles.subtitle}>الرسائل</Text>
      
    </View>
    {doctorAvatar && (
      <Ionicons name="person-circle" size={40} color="#fff" style={{ marginHorizontal: 6 }} />
    )}
  </View>
);



const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00b29c',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backBtn: { marginLeft: 8 },
  titleWrapper: { flex: 1, alignItems: 'center' },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { color: '#e8f6f3', fontSize: 12, marginTop: 2 },
});

const MessageBubble = ({ message }) => {
  const isPatient = message.sender === 'patient';
  return (
    <View
      style={[
        bubbleStyles.container,
        isPatient ? bubbleStyles.right : bubbleStyles.left,
      ]}
    >
      <Text style={bubbleStyles.text}>{message.text}</Text>
      <Text style={bubbleStyles.time}>{message.time}</Text>
    </View>
  );
};

const bubbleStyles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginVertical: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  right: {
    alignSelf: 'flex-end',
    backgroundColor: '#e0f7f1',
  },
  left: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  text: { fontSize: 16, color: '#004d40' },
  time: { fontSize: 11, color: '#666', marginTop: 4, textAlign: 'left' },
});

const MessageInput = ({ inputText, setInputText, onSend, sending }) => (
  <View style={inputStyles.wrapper}>
    <TextInput
      style={inputStyles.textInput}
      value={inputText}
      onChangeText={setInputText}
      placeholder="اكتب رسالة..."
      placeholderTextColor="#999"
      multiline
    />
    <TouchableOpacity style={inputStyles.sendBtn} onPress={onSend} disabled={sending}>
      {sending ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Ionicons name="send" size={22} color="#fff" />
      )}
    </TouchableOpacity>
  </View>
);

const inputStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#00b29c',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 120,
    fontSize: 16,
    textAlign: 'right',
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: '#00b29c',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/*********************** Main Screen ************************/ 
const ChatScreenPatient = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Hide default navigator header (removes top word "الرسائل")
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false, title: '' });
  }, [navigation]);
  const tabBarHeight = useBottomTabBarHeight();

  // doctor info can be passed via params or fetched from context/API
  const { doctorId, doctorName: passedDoctorName, doctorAvatar } = route.params || {};
  const displayDoctorName = passedDoctorName && passedDoctorName.trim() !== '' ? passedDoctorName : 'الطبيب المشرف';

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);

  // Load conversation on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Replace with real API call
        const previous = [];
        setMessages(previous);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [doctorId]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text) return;
    const newMsg = {
      id: Date.now().toString(),
      text,
      sender: 'patient',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setSending(true);
    try {
      // Send to backend
      await fetch(ENDPOINTS.sendMessage, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId, text }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#00b29c" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={insets.top + tabBarHeight}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.flex}>
          <View style={styles.flex}>
            {/* Header */}
            <ChatHeader doctorName={displayDoctorName} doctorAvatar={doctorAvatar} />

            {/* Messages list */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <MessageBubble message={item} />}
              contentContainerStyle={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
            />

            {/* Input */}
            <MessageInput
              inputText={inputText}
              setInputText={setInputText}
              onSend={sendMessage}
              sending={sending}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  messagesContainer: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

export default ChatScreenPatient;
