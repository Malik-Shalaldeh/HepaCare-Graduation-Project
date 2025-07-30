import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  View,
  Keyboard,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MessageInput = ({ inputText, setInputText, sendMessage }) => {
  const inputRef = useRef(null);

  // عند فتح لوحة المفاتيح، نمرّر التركيز إلى حقل النص
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    );
    return () => showSub.remove();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      style={styles.wrapper}
    >
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="اكتب رسالة..."
          placeholderTextColor="#999"
          multiline
          textAlign="right"
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            inputText.trim() === '' && styles.sendButtonDisabled,
          ]}
          onPress={sendMessage}
          disabled={inputText.trim() === ''}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="send"
            size={24}
            color="#fff"
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#8FD3A5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    // ظل خفيف للأندرويد
    elevation: 3,
    // ظل خفيف للـ iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  sendButtonDisabled: {
    backgroundColor: '#cddfc7',
  },
  sendIcon: {
    transform: [{ rotate: '180deg' }], // لعكس اتجاه أيقونة الإرسال RTL
  },
});

export default MessageInput;
