import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Index from "./index";
import Profile from "./profile";
import Ticket from "./ticket";
const Tab = createBottomTabNavigator();

export default function _layout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
      >
        <Tab.Screen name="index" component={Index} />
        <Tab.Screen name="profile" component={Profile} />
        <Tab.Screen name="ticket" component={Ticket} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
