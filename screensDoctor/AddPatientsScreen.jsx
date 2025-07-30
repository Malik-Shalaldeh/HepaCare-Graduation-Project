// AddPatientsScreen.jsx

import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import AddPatientsComponent from "../componentDoctor/AddPatientsComponent";

export default function AddPatientsScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <AddPatientsComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF",
    // على أندرويد: ارفع المحتوى فوق شريط الحالة
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    // على أندرويد: أضف مساحة أسفل المحتوى حتى لا يختلط مع أزرار التنقل
    paddingBottom: Platform.OS === "android" ? 20 : 0,
  },
});
