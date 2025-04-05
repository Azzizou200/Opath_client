import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { StatusBar } from "expo-status-bar";
import NotificationBell from "../../components/notificationBell";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";
export default function Index() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const onewayopacity = useSharedValue(1);
  const roundtripopacity = useSharedValue(0.2);
  const defaultStyles = useDefaultStyles();
  const [selected, setSelected] = useState();
  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const onewaystyle = useAnimatedStyle(() => ({
    opacity: withTiming(onewayopacity.value, config),
  }));

  const roundtripstyle = useAnimatedStyle(() => ({
    opacity: withTiming(roundtripopacity.value, config),
  }));

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="dark" translucent={false} />

      <KeyboardAvoidingView
        behavior="height"
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView className="bg-gray-100 flex-1">
            <View className="p-4 flex-row justify-between bg-white">
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Hi, there 👋{" "}
              </Text>
              <NotificationBell />
            </View>

            <View className="h-96">
              <Image
                className="w-full"
                source={require("@/assets/images/HomeBackground.jpg")}
                style={{ height: "100%", width: "100%" }}
              />
            </View>

            <View className="bg-red-100 items-center">
              <View className="bg-gray-100 w-5/6 rounded-3xl -inset-y-36 opacity-90 shadow-black shadow-2xl">
                <View className="py-2 pl-7 flex-row gap-9">
                  <Animated.Text
                    style={onewaystyle}
                    className="font-bold shadow-2xl text-lg shadow-gray-400"
                    onPress={() => {
                      onewayopacity.value = 1;
                      roundtripopacity.value = 0.2;
                    }}
                  >
                    One-way
                  </Animated.Text>
                  <Animated.Text
                    style={roundtripstyle}
                    className="font-bold shadow-2xl text-lg shadow-gray-400"
                    onPress={() => {
                      onewayopacity.value = 0.2;
                      roundtripopacity.value = 1;
                    }}
                  >
                    Round trip
                  </Animated.Text>
                </View>

                <View className="px-9 gap-3">
                  <View className="flex-row items-center bg-white border-2 rounded-xl px-3">
                    <TextInput className="flex-1 py-2" placeholder="From" />
                    <Ionicons name="search" size={20} color="black" />
                  </View>
                  <View className="flex-row items-center bg-white border-2 rounded-xl px-3">
                    <TextInput className="flex-1 py-2" placeholder="To" />
                    <Ionicons name="location" size={20} color="black" />
                  </View>

                  {/* Date & Passengers Inputs */}
                  <View className="flex-row gap-5">
                    {/* Date Input */}
                    <View
                      className="flex-1 flex-row items-center bg-white border-2 rounded-xl px-3"
                      onPress={() => setDatePickerVisibility(true)}
                    >
                      <TextInput
                        className="flex-1 py-2"
                        placeholder="Date"
                        onPress={() => setDatePickerVisibility(true)}
                      />
                      <Ionicons name="calendar" size={20} color="black" />
                    </View>

                    {/* Passengers Input */}
                    <View className="flex-1 flex-row items-center bg-white border-2 rounded-xl px-3">
                      <TextInput className="flex-1 py-2" placeholder="Seats" />
                      <Ionicons name="people" size={20} color="black" />
                    </View>
                  </View>

                  <TouchableOpacity className="bg-black p-3 rounded-3xl self-center mb-5 w-3/4">
                    <Text className="text-white text-center">Search</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="h-96"></View>
            <Modal
              visible={isDatePickerVisible}
              animationType="fade"
              transparent
              onRequestClose={() => setDatePickerVisibility(false)}
            >
              <View className="bg-black p-4 rounded-3xl w-full">
                <DateTimePicker
                  mode="multiple"
                  date={selected}
                  onChange={({ date }) => setSelected(date)}
                  styles={defaultStyles}
                />
              </View>
            </Modal>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
