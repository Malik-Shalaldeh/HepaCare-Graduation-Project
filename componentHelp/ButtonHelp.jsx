// HelpButton.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HelpButton = ({
  title = "مساعدة",
  info = "لا يوجد معلومات مساعدة",
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* زر المساعدة */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setVisible(true)}
      >
        <Ionicons name="help-circle-outline" size={20} color="#777" />
        <Text style={styles.helpText}>مساعدة</Text>
      </TouchableOpacity>

      {/* صندوق المساعدة */}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.body}>{info}</Text>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.closeText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // مكان الزر فوق يمين
  fab: {
    position: "absolute",
    top: 30,
    right: 12,
    alignItems: "center",
  },
  helpText: {
    fontSize: 10,
    color: "#777",
  },
  // خلفية المودال
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  // الكارد
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },
  // العنوان
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "right",
    writingDirection: "rtl",
  },
  // النص
  body: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    textAlign: "right",
    writingDirection: "rtl",
  },
  // زر الإغلاق
  closeBtn: {
    marginTop: 14,
    backgroundColor: "#eee",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start", // في RTL بتبين يمين
  },
  closeText: {
    color: "#333",
    fontWeight: "500",
  },
});

export default HelpButton;
