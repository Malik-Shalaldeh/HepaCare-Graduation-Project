import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

// ===== عدّل هذا على عنوان سيرفرك =====
const API = "http://192.168.1.2:8000"; // عدّل IP

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("bad creds");
      const data = await res.json(); // { id, username, role, route }
      navigation.replace(data.route); // "Doctor" | "Patient" | "Admin" | "Labs" | "Health"
    } catch (e) {
      Alert.alert('خطأ', 'اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <View style={styles.container}>
      {/* ===== جزء الشعار بخلفية ملونة وشكل منحني ===== */}
      <View style={styles.header}>
        <View style={styles.curve} />
        <Text style={styles.logo}>HepaCare</Text>
      </View>

      {/* ===== نموذج تسجيل الدخول ===== */}
      <View style={styles.form}>
        {/* حقل اسم المستخدم مع أيقونة */}
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

        {/* حقل كلمة المرور مع أيقونة وزر لإظهار/إخفاء */}
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

        {/* زر الدخول */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>دخول</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // الحاوية الرئيسية
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  // الهيدر مع الخلفية الملونة
  header: {
    height: 180,
    backgroundColor: '#00b29c',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    zIndex: 10,
  },
  // الشكل المنحني السفلي للهيدر
  curve: {
    position: 'absolute',
    bottom: -40,
    width: width,
    height: 80,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    zIndex: 1,
  },
  // المنطقة التي تحتوي على الحقول والأزرار
  form: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  // حاوية كل حقل نصي مع الأيقونة
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
  // ستايل الأيقونة داخل حقل النص
  inputIcon: {
    marginRight: 8,
  },
  // حقل النص نفسه
  input: {
    height: 50,
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  // زر إظهار/إخفاء كلمة المرور (على اليمين)
  eyeButton: {
    padding: 8,
  },
  // ستايل زر الدخول
  button: {
    height: 52,
    backgroundColor: '#00b29c',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    // ظل خفيف للأندرويد
    elevation: 4,
    // ظل خفيف للـ iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
