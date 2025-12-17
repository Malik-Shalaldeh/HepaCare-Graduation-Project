import { Alert } from "react-native";

// Regex
const nameRegex = /^[\u0600-\u06FFa-zA-Z\s]+$/;
const idRegex = /^\d{8,13}$/;
const phoneRegex = /^05\d{8}$/;

export const validatePatientStep1 = (patient) => {
  const { fullName, idNumber, phone, address, dob, gender, clinic } = patient;

  // تحقق من الفراغ
  if (!fullName || !idNumber || !phone || !address || !dob || !gender || !clinic) {
    Alert.alert("خطأ", "يرجى تعبئة جميع الحقول");
    return false;
  }

  // الاسم
  if (!nameRegex.test(fullName)) {
    Alert.alert("خطأ", "الاسم يجب أن يحتوي على أحرف فقط");
    return false;
  }

  // الهوية
  if (!idRegex.test(idNumber)) {
    Alert.alert("خطأ", "رقم الهوية يجب أن يكون من 8 إلى 13 رقم");
    return false;
  }

  // الجنس
  if (!["ذكر", "أنثى"].includes(gender)) {
    Alert.alert("خطأ", "يرجى اختيار الجنس");
    return false;
  }

  // الهاتف
  if (!phoneRegex.test(phone)) {
    Alert.alert("خطأ", "رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام");
    return false;
  }

  return true;
};
