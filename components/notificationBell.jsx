import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

const NotificationBell = () => {
  return (
    <View>
      <FontAwesome name="bell-o" size={24} color="black"></FontAwesome>
    </View>
  );
};

export default NotificationBell;

const styles = StyleSheet.create({});
