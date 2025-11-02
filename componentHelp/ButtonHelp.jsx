// HelpButton.js
import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const toRTL = (txt = "") => `\u202B${txt}\u202C`; // يجبره RTL

const HelpButton = ({
  info = "لا يوجد معلومات مساعدة",
  title = "مساعدة",
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* الزر اللي فوق على اليمين */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Ionicons name="help-circle-outline" size={20} color="#777" />
        <Text style={styles.helpText}>{toRTL("مساعدة")}</Text>
      </TouchableOpacity>

      {/* المودال */}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.title}>{toRTL(title)}</Text>

            <Text style={styles.body}>
              {toRTL(info)}
            </Text>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.closeText}>{toRTL("إغلاق")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    top: 12,
    right: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    zIndex: 999,
  },
  helpText: {
    fontSize: 10,
    color: "#777",
    textAlign: "right",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "right",
    writingDirection: "rtl",
  },
  body: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    textAlign: "right",
    writingDirection: "rtl",
  },
  closeBtn: {
    marginTop: 12,
    backgroundColor: "#eee",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start", // في RTL بتطلع يمين
  },
  closeText: {
    color: "#333",
    fontWeight: "500",
    textAlign: "right",
    writingDirection: "rtl",
  },
});

export default HelpButton;
