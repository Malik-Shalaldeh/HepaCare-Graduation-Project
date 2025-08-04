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
  // ارتفاع الهيدر
  const [headerHeight, setHeaderHeight] = useState(0);
  // ارتفاع بوكس الكتابة (مش مهم هسه للتعويض)
  const [inputHeight, setInputHeight] = useState(0);

  // الحصول على حواف الجهاز الآمنة وارتفاع شريط التبويبات
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  // بنعوض المسافة اللي خليّنا فيها التاب بار ثابت تحت
  const tabBarOffset = Platform.OS === 'android' ? 35 : 20;
  const bottomSpace = insets.bottom + tabBarHeight + tabBarOffset;
// اوفست تحت لنعوض المسافة اللي بتروح لما التاب بار تحت يختفي
const keyboardOffset = Platform.OS === 'ios' ? 0 : bottomSpace;

  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // بنخفي التابات لما يطلع الكيبورد وبرجعهم لما يسكر
  useEffect(() => {
    const parentNav = navigation.getParent();
    if (!parentNav) return;

    const hideTabBar = () => parentNav.setOptions({ tabBarStyle: { display: 'none' } });
    const showTabBar = () => parentNav.setOptions({ tabBarStyle: undefined });

    const showSub = Keyboard.addListener('keyboardDidShow', hideTabBar);
    const hideSub = Keyboard.addListener('keyboardDidHide', showTabBar);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [navigation]);

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

  // بنرندر صف مريض واحد بالبحث
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

  // منعوض ارتفاع الهيدر والمسافة اللي تحت (الحافة الآمنة + التاب بار)
  const totalOffset = Platform.OS === 'ios' ? headerHeight + bottomSpace : 0;

  // Handle back button press
  const handleBackPress = () => {
    if (fromPatientCard) {
      // If came from patient card, go back to previous screen (patient details)
      navigation.goBack();
    } else {
      // If in search mode, just clear the selected patient
      setSelectedPatient(null);
    }
  };

  // If no patient is selected, display patient search UI
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

return (
  <SafeAreaView style={styles.safeArea}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardOffset}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          {/* 1. الهيدر */}
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

          {/* 2. قائمة الرسائل */}
          <View style={styles.messagesContainer}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={item => item.id}
              contentContainerStyle={[
                styles.flatListContent,
                { paddingBottom: tabBarHeight + insets.bottom }
              ]}
              keyboardShouldPersistTaps="handled"
            />
          </View>

          {/* 3. صندوق الإدخال */}
          <View
            style={styles.inputWrapper}
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
  </SafeAreaView>
);


};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardContainer: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  headerWrapper: {
    // ارتفاع ديناميكي يُحسب بواسطة onLayout
  },
  messagesContainer: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    // قلّلنا paddingVertical ليصبح 5 نقاط فقط
    paddingVertical: 5,
    // أو يمكنك الاستغناء نهائيًا عن paddingBottom:
    // paddingBottom: 0,
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
    maxHeight: 180,
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
  arrow: {
    fontSize: 20,
    color: '#00b29c',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 8,
    color: '#00b29c',
    fontSize: 14,
  },
  noSelectionText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    color: '#666',
  },
});

export default ChatScreen;
