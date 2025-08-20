import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  LayoutAnimation,
  UIManager,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import ENDPOINTS from "../samiendpoint";

/*********************** Header ************************/
const ChatHeader = ({ title, avatar }) => {
  return (
    <View style={headerStyles.container}>
      <View style={headerStyles.titleWrapper}>
        <Text style={headerStyles.title}>{title || "الطبيب المشرف"}</Text>
        <Text style={headerStyles.subtitle}>الرسائل</Text>
      </View>
      {avatar ? (
        <Ionicons
          name="person-circle"
          size={40}
          color="#fff"
          style={{ marginHorizontal: 6 }}
        />
      ) : null}
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00b29c",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  titleWrapper: { flex: 1, alignItems: "center" },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: { color: "#e8f6f3", fontSize: 12, marginTop: 2 },
});

/*********************** Message Bubble ************************/
const MessageBubble = ({ message }) => {
  const isPatient = message.sender === "patient";
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
    maxWidth: "80%",
    marginVertical: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  right: {
    alignSelf: "flex-end",
    backgroundColor: "#e0f7f1",
  },
  left: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
  },
  text: { fontSize: 16, color: "#004d40" },
  time: { fontSize: 11, color: "#666", marginTop: 4, textAlign: "left" },
});

/*********************** Message Input ************************/
const MessageInput = ({
  value,
  onChange,
  onSend,
  sending,
  onLayoutHeightChange,
}) => {
  const [inputContentHeight, setInputContentHeight] = useState(40);

  return (
    <View
      style={inputStyles.wrapper}
      onLayout={(e) => onLayoutHeightChange?.(e.nativeEvent.layout.height)}
    >
      <TextInput
        style={[
          inputStyles.textInput,
          { height: Math.min(120, Math.max(40, inputContentHeight)) },
        ]}
        value={value}
        onChangeText={onChange}
        placeholder="اكتب رسالة..."
        placeholderTextColor="#999"
        multiline
        textAlign="right"
        onContentSizeChange={(e) =>
          setInputContentHeight(e.nativeEvent.contentSize.height)
        }
        returnKeyType="send"
        blurOnSubmit={false}
      />
      <TouchableOpacity
        style={inputStyles.sendBtn}
        onPress={onSend}
        disabled={sending || value.trim() === ""}
      >
        {sending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Ionicons name="send" size={22} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const inputStyles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#00b29c",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 120,
    fontSize: 16,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: "#00b29c",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});

/*********************** Main Screen ************************/
const ChatScreenPatient3 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false, title: "" });
  }, [navigation]);

  const {
    doctorId,
    doctorName: passedDoctorName,
    doctorAvatar,
  } = route.params || {};
  const displayDoctorName = useMemo(() => {
    if (!passedDoctorName || passedDoctorName.trim() === "")
      return "الطبيب المشرف";
    return passedDoctorName;
  }, [passedDoctorName]);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [inputContainerHeight, setInputContainerHeight] = useState(56);

  const listRef = useRef(null);

  // Initial load
  useEffect(() => {
    let mounted = true;
    const fetchMessages = async () => {
      try {
        const previous = [];
        if (mounted) setMessages(previous);
      } catch (e) {
        // noop
      }
    };
    fetchMessages();
    return () => {
      mounted = false;
    };
  }, [doctorId]);

  // No manual keyboard listeners needed with KeyboardAvoidingView

  // Auto scroll on new messages
  useEffect(() => {
    requestAnimationFrame(() =>
      listRef.current?.scrollToEnd({ animated: true })
    );
  }, [messages]);

  // Smooth layout animation on keyboard show/hide to avoid jitter
  useEffect(() => {
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    const showEvt =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const onAnimate = () =>
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const s = Keyboard.addListener(showEvt, onAnimate);
    const h = Keyboard.addListener(hideEvt, onAnimate);
    return () => {
      s.remove();
      h.remove();
    };
  }, []);

  // Handle first mount once input height measured
  useEffect(() => {
    if (inputContainerHeight > 0) {
      requestAnimationFrame(() =>
        listRef.current?.scrollToEnd({ animated: false })
      );
    }
  }, [inputContainerHeight]);

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text) return;
    const newMsg = {
      id: Date.now().toString(),
      text,
      sender: "patient",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setSending(true);
    try {
      await fetch(ENDPOINTS.sendMessage, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, text }),
      });
    } catch (e) {
      // optionally show toast
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor="#00b29c" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={headerHeight + 25}
      >
        <View style={styles.flex}>
          <ChatHeader title={displayDoctorName} avatar={doctorAvatar} />

          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageBubble message={item} />}
            contentContainerStyle={[
              styles.messagesContainer,
              { paddingBottom: inputContainerHeight },
            ]}
            maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.select({
              ios: "interactive",
              android: "on-drag",
            })}
            showsVerticalScrollIndicator={false}
          />

          <MessageInput
            value={inputText}
            onChange={setInputText}
            onSend={sendMessage}
            sending={sending}
            onLayoutHeightChange={(h) =>
              setInputContainerHeight(Math.max(44, h))
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
  messagesContainer: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

export default ChatScreenPatient3;
