import React, { useState, useRef, useEffect } from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import ChatHeader from '../componentDoctor/ChatHeader';
import MessageBubble from '../componentDoctor/MessageBubble';
import MessageInput from '../componentDoctor/MessageInput';
import Ionicons from 'react-native-vector-icons/Ionicons';

const INITIAL_MESSAGES = [
  { id: '1', text: 'مرحباً دكتور، أشعر بألم في المعدة منذ يومين', sender: 'patient', time: '10:30 AM' },
  { id: '2', text: 'هل تناولت أي طعام غير معتاد خلال اليومين الماضيين؟', sender: 'doctor', time: '10:32 AM' },
  { id: '3', text: 'نعم، تناولت وجبة من مطعم جديد', sender: 'patient', time: '10:33 AM' },
  { id: '4', text: 'حسناً، قد يكون هذا هو السبب. أنصحك بشرب الكثير من الماء وتناول طعام خفيف لمدة 24 ساعة. إذا استمر الألم، يرجى زيارة العيادة', sender: 'doctor', time: '10:35 AM' },
];

const ChatScreen = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Patient search state
  const [patients] = useState([
    { id: '1', name: 'أحمد محمد' },
    { id: '2', name: 'سارة علي' },
    { id: '3', name: 'محمد أحمد' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );
  
  const route = useRoute();
  const navigation = useNavigation();
  const { patient, fromPatientCard } = route.params || {};
  const initialPatient = patient || null;
  const [selectedPatient, setSelectedPatient] = useState(initialPatient);
  
  const [headerHeight, setHeaderHeight] = useState(0);
  const [inputHeight, setInputHeight] = useState(60); // قيمة افتراضية

  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  
  const flatListRef = useRef(null);

  // إدارة الكيبورد بشكل أفضل
  useEffect(() => {
    const parentNav = navigation.getParent();
    
    const keyboardWillShow = (event) => {
      setKeyboardHeight(event.endCoordinates.height);
      parentNav?.setOptions({ 
        tabBarStyle: { display: 'none' }
      });
    };

    const keyboardWillHide = () => {
      setKeyboardHeight(0);
      parentNav?.setOptions({ 
        tabBarStyle: undefined 
      });
    };

    const showListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', 
      keyboardWillShow
    );
    const hideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', 
      keyboardWillHide
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [navigation]);

  // التمرير التلقائي عند إضافة رسائل جديدة
  useEffect(() => {
    const timer = setTimeout(() => {
      if (flatListRef.current && messages.length > 0) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMsg = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'doctor',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  const renderMessage = ({ item }) => <MessageBubble message={item} />;

  const renderPatientItem = ({ item }) => (
    <TouchableOpacity
      style={styles.patientItem}
      activeOpacity={0.8}
      onPress={() => {
        Keyboard.dismiss();
        setSelectedPatient(item);
      }}
    >
      <View style={styles.patientRow}>
        <View style={styles.patientLeft}>
          <Ionicons name="person-circle-outline" size={26} color="#004d40" />
          <Text style={styles.patientName}>{item.name}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#00b29c" />
      </View>
    </TouchableOpacity>
  );

  const handleBackPress = () => {
    if (fromPatientCard) {
      navigation.goBack();
    } else {
      setSelectedPatient(null);
    }
  };

  // شاشة البحث عن المرضى
  if (!selectedPatient) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.searchContainer}>
            <View style={styles.searchSection}>
              <Ionicons
                name="search"
                size={22}
                color={styles.placeholder.color}
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.input, styles.rtlText]}
                placeholder="ابحث عن مريض"
                placeholderTextColor={styles.placeholder.color}
                value={searchTerm}
                onChangeText={text => setSearchTerm(text)}
                autoCorrect={false}
              />
            </View>

            {searchTerm.trim() !== '' && (
              <FlatList
                data={filteredPatients}
                keyExtractor={item => item.id}
                renderItem={renderPatientItem}
                style={styles.patientsList}
                ListEmptyComponent={<Text style={styles.emptyText}>لم يتم العثور على مرضى</Text>}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              />
            )}

            {searchTerm.trim() === '' && (
              <Text style={styles.noSelectionText}>ابحث عن مريض لبدء المحادثة</Text>
            )}
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }

  // حساب المساحات بشكل صحيح
  const bottomPadding = keyboardHeight > 0
    ? 0 // لا نحتاج padding إضافي عند ظهور الكيبورد
    : insets.bottom;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#00b29c" />
      
      <View style={styles.container}>
        {/* Header */}
        <View
          style={styles.headerWrapper}
          onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}
        >
          <ChatHeader
            patientName={selectedPatient?.name || '---'}
            patientInitial={selectedPatient?.name?.charAt(0) || 'م'}
            onBack={handleBackPress}
          />
        </View>

        {/* Messages Container with proper KeyboardAvoidingView */}
        <KeyboardAvoidingView
          style={styles.messagesSection}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.messagesContent}>
              {/* Messages List */}
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={[styles.flatListContent, { paddingBottom: insets.bottom + 8 } ]}
                keyboardShouldPersistTaps="handled"
                


              />

              {/* Input Section */}
              <View
                style={[
                  styles.inputWrapper,
                  { paddingBottom: bottomPadding }
                ]}
                onLayout={e => setInputHeight(e.nativeEvent.layout.height)}
              >
                <MessageInput
                  inputText={inputText}
                  setInputText={setInputText}
                  sendMessage={sendMessage}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  headerWrapper: {
    backgroundColor: '#fff',
    zIndex: 1,
  },
  messagesSection: {
    flex: 1,
  },
  messagesContent: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  inputWrapper: {
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  /* Search styles */
  searchContainer: {
    flex: 1,
    padding: 10,
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  searchSection: {
    position: 'relative',
    marginBottom: 12,
  },
  searchIcon: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#00b29c',
    borderRadius: 8,
    padding: 10,
    paddingLeft: 36,
    backgroundColor: '#FFF',
    fontSize: 16,
    color: '#004d40',
  },
  placeholder: {
    color: '#00b29c',
  },
  patientsList: {
    maxHeight: 300,
  },
  patientItem: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 4,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0F7F1',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  patientRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  patientLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004d40',
    marginRight: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#00b29c',
    fontSize: 16,
    fontWeight: '500',
  },
  noSelectionText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    color: '#666',
  },
});

export default ChatScreen;