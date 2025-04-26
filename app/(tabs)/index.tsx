import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import TripCard_link from "../../components/TripCard_link";
import { router } from "expo-router";

export default function Index() {
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(new Date());
  const [seats, setSeats] = useState("");
  const oneWayOpacity = useSharedValue(1);
  const roundTripOpacity = useSharedValue(0.2);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const animationConfig = {
    duration: 300,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const oneWayStyle = useAnimatedStyle(() => ({
    opacity: withTiming(oneWayOpacity.value, animationConfig),
  }));

  const roundTripStyle = useAnimatedStyle(() => ({
    opacity: withTiming(roundTripOpacity.value, animationConfig),
  }));
  const formatDate = (date) => {
    if (!(date instanceof Date)) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`; // This gives format YYYY-MM-DD
  };
  const handleDateChange = (event, selectedDate) => {
    // iOS keeps picker visible
    if (selectedDate) {
      setDate(selectedDate);
      setShowDatePicker(false);
    }
  };

  const handleSearch = () => {
    if (!from || !to || !seats) {
      alert("Please fill in all fields");
      return;
    }
    if (parseInt(seats) <= 0) {
      alert("Please enter a valid number of seats");
      return;
    }

    router.push({
      pathname: "/trips",
      params: {
        from: from.trim(),
        to: to.trim(),
        date: formatDate(date),
        seats: seats.trim(),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="p-4 flex-row justify-between items-center">
          <Text className="text-xl font-bold">Hi, there </Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Map Background */}
        <View className="h-72 bg-gray-100">
          <Image
            source={require("../../assets/images/HomeBackground.jpg")}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Booking Card */}
        <View className="px-4 -mt-40">
          <View className="bg-white rounded-3xl opacity-95 p-4 shadow-lg">
            {/* Trip Type Toggle */}
            <View className="flex-row gap-6 mb-4 px-2">
              <Pressable>
                <Animated.Text
                  style={oneWayStyle}
                  className="text-lg font-semibold"
                >
                  One-way
                </Animated.Text>
              </Pressable>
              <Pressable>
                <Animated.Text
                  style={roundTripStyle}
                  className="text-lg font-semibold"
                >
                  Round-trip
                </Animated.Text>
              </Pressable>
            </View>

            {/* Form Fields */}
            <View className="gap-4">
              {/* From */}
              <View className="flex-row items-center border border-gray-200 rounded-xl px-4 py-3">
                <TextInput
                  placeholder="From"
                  className="flex-1"
                  placeholderTextColor="#666"
                  value={from}
                  onChangeText={setFrom}
                />
                <Ionicons name="search" size={20} color="#666" />
              </View>

              {/* To */}
              <View className="flex-row items-center border border-gray-200 rounded-xl px-4 py-3">
                <TextInput
                  placeholder="To"
                  className="flex-1"
                  placeholderTextColor="#666"
                  value={to}
                  onChangeText={setTo}
                />
                <Ionicons name="location" size={20} color="#666" />
              </View>

              {/* Date and Seats */}
              <View className="flex-row gap-4">
                <View className="flex-1 flex-row items-center border border-gray-200 rounded-xl px-4 py-3">
                  <Pressable
                    onPress={() => setShowDatePicker(true)}
                    className="flex-1 flex-row items-center border border-gray-200 rounded-xl px-4 py-3"
                  >
                    <Text className="flex-1 text-gray-800">
                      {date instanceof Date ? formatDate(date) : "Select date"}
                    </Text>
                  </Pressable>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                      minimumDate={new Date()}
                    />
                  )}
                  <Ionicons name="calendar" size={20} color="#666" />
                </View>
                <View className="flex-1 flex-row items-center border border-gray-200 rounded-xl px-4 py-3">
                  <TextInput
                    placeholder="Seats"
                    className="flex-1"
                    placeholderTextColor="#666"
                    value={seats}
                    onChangeText={setSeats}
                    keyboardType="numeric"
                  />
                  <Ionicons name="people" size={20} color="#666" />
                </View>
              </View>

              {/* Search Button */}
              <TouchableOpacity
                className="bg-black py-4 rounded-2xl"
                onPress={handleSearch}
              >
                <Text className="text-white text-center font-semibold">
                  Search
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Previous Trips Section */}
      </ScrollView>
    </SafeAreaView>
  );
}
