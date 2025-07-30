// HealthMedicationsDisplay.jsx

import React from "react";
import { StatusBar, SafeAreaView, StyleSheet, Platform, View } from "react-native";
import HealthMedComponent from "../componentDoctor/HealthMedComponent";

export default function HealthMedicationsDisplay() {
  return (
    <View style={styles.wrapper}>
      {/* نخلي الشريط شفاف ويوزع المحتوى صح */}
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <SafeAreaView style={styles.screen}>
        <HealthMedComponent />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,

  },
  screen: {
    flex: 1,
    
    // نضيف padding top على أندرويد بحجم شريط الحالة
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    // نضيف مساحة تحتية حتى لا تتعارض مع أزرار التنقل على أندرويد
    paddingBottom: Platform.OS === "android" ? 20 : 0,
  },
});
