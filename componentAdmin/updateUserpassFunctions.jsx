import { Alert } from "react-native";
import axios from "axios";
import ENDPOINTS from "../malikEndPoint";

// roles
export const roles = [
  { key: "DOCTOR", label: "طبيب" },
  { key: "PATIENT", label: "مريض" },
  { key: "LAB", label: "مختبر" },
  { key: "HEALTH", label: "وزارة الصحة" },
  { key: "ADMIN", label: "أدمن" },
];

// اختيار الدور
export const chooseRole = async (r, setRole, setUser, setResults, setName) => {
  setRole(r);
  setUser(null);
  setResults([]);
  setName("");

  if (r === "HEALTH" || r === "ADMIN") {
    try {
      const res = await axios.get(ENDPOINTS.ADMIN.SEARCH_BY_ROLE, {
        params: { role: r },
      });
      if (res.data.length > 0) 
        setUser(res.data[0]);
    } catch {
      Alert.alert("خطأ", "تعذر جلب حساب هذا الدور");
    }
  }
};

// اختيار مستخدم من نتائج البحث
export const selectUser = async (id, role, setUser, setResults) => {
  try {
    const res = await axios.get(ENDPOINTS.ADMIN.USER_DETAILS, {
      params: { user_id: id, role },
    });

    setUser(res.data);
    setResults([]); // إخفاء القائمة بعد الاختيار
  } catch 
  {
    Alert.alert("خطأ", "تعذر جلب تفاصيل المستخدم");
  }
};


// بحث مستخدم
export const searchUser = async (role, name, setResults) => {
  if (!role) return;

  if (!name.trim()) {
    setResults([]);
    return;
  }

  try {
    const res = await axios.get(ENDPOINTS.ADMIN.SEARCH_BY_ROLE, {
      params: {
        role,
        name: name.trim(),
      },
    });

    if (!res.data || res.data.length === 0) {
      setResults([]);
      return;
    }

    setResults(res.data);

  } catch (e) {
    setResults([]);
  }
};


// تحديث كلمة مرور
export const updatePassword = async (user, pass1, pass2, setUser, setPass1, setPass2) => 
  {
  if (!user) 
    return Alert.alert("تنبيه", "اختر مستخدم أولاً");

  if (!pass1 || !pass2) 
    return Alert.alert("تنبيه", "أدخل كلمة المرور");

  if (pass1 !== pass2) 
    return Alert.alert("تنبيه", "كلمتا المرور غير متطابقتين");

  try {
    await axios.post(
      ENDPOINTS.ADMIN.UPDATE_USER_PASSWORD,
      null,
      {
        params: { user_id: user.id, new_password: pass1 },
      }
    );

    Alert.alert("تم", `تم تحديث كلمة مرور: ${user.name}`);

    setUser(null);
    setPass1("");
    setPass2("");

  } catch {
    Alert.alert("خطأ", "تعذر تحديث كلمة المرور");
  }
};
