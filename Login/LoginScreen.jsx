

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API = 'http://192.168.1.8:8000';


export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

 const handleLogin = async () => {
  try {
    const response = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      if (response.status === 403) {
        Alert.alert("الحساب معطل", "هذا الحساب معطل، تواصل مع الإدارة.");
      } else if (response.status === 401) {
        Alert.alert("خطأ", "اسم المستخدم أو كلمة المرور غير صحيحة");
      } else {
        Alert.alert("خطأ", "حدث خطأ في تسجيل الدخول");
      }
      setPassword("");
      return;
    }

    const data = await response.json();

    // ✅ تحقق محلي من is_active
    if (data.is_active === 0) {
      Alert.alert("الحساب معطل", "هذا الحساب معطل، تواصل مع الإدارة.");
      setPassword("");
      return;
    }

    await AsyncStorage.setItem("user_id", String(data.id));

    if (data.role === "DOCTOR") {
      await AsyncStorage.setItem("doctor_id", String(data.id));
      await AsyncStorage.setItem("patientId", ""); // Clear patient ID for doctor
    } else if (data.role === "PATIENT") {
      await AsyncStorage.removeItem("doctor_id");
      await AsyncStorage.setItem("patientId", String(data.id));
    }

    navigation.replace(data.route);

  } catch (e) {
    console.error("Login error:", e);
    Alert.alert("خطأ", "تعذر الاتصال بالخادم");
    setPassword("");
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>HepaCare</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#777"
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="اسم المستخدم"
            placeholderTextColor="#999"
            style={styles.input}
            onChangeText={setUsername}
            value={username}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#777"
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="كلمة المرور"
            placeholderTextColor="#999"
            style={[styles.input, { flex: 1 }]}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#00b29c"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>دخول</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    height: 180,
    backgroundColor: '#00b29c',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: { fontSize: 34, fontWeight: 'bold', color: '#fff' },
  form: { flex: 1, paddingHorizontal: 30, paddingTop: 50 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
  },
  inputIcon: { marginRight: 8 },
  input: { height: 50, flex: 1, fontSize: 16, color: '#333' },
  eyeButton: { padding: 8 },
  button: {
    height: 52,
    backgroundColor: '#00b29c',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
