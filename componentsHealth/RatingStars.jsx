// sami
// جميع التعليقات داخل الكود باللغة العربية فقط.

import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

/*
  مكون لعرض/اختيار نجوم التقييم.
  الخصائص:
  - value: القيمة الحالية (1-5)
  - onChange: دالة استدعاء عند تغيير النجوم
  - size: حجم الأيقونات
  - disabled: تعطيل التفاعل
*/
export default function RatingStars({
  value = 0,
  onChange,
  size = 22,
  disabled = false,
}) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.row}>
      {stars.map((s) => {
        const filled = s <= value;
        const Icon = (
          <Ionicons
            key={s}
            name={filled ? "star" : "star-outline"}
            size={size}
            color={filled ? "#F4C430" : "#C8CCD4"}
            style={styles.icon}
          />
        );
        if (disabled) return <View key={s}>{Icon}</View>;
        return (
          <TouchableOpacity key={s} onPress={() => onChange && onChange(s)}>
            {Icon}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 2,
  },
});
