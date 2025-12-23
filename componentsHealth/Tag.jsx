// sami


import React from "react";
import { View, Text, StyleSheet } from "react-native";


export default function Tag({
  text,
  color = "#EEF7F3",
  textColor = "#0B7A66",
}) {
  return (
    <View style={[styles.tag, { backgroundColor: color }]}>
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
