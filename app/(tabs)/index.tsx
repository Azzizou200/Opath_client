import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  Pressable,
} from "react-native";
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
import TripCard from "../../components/TripCard";
import { router } from "expo-router";

export default function Index() {
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [seats, setSeats] = useState("");
  const oneWayOpacity = useSharedValue(1);
  const roundTripOpacity = useSharedValue(0.2);

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

  const handleTripTypeChange = (type: "one-way" | "round-trip") => {
    setTripType(type);
    if (type === "one-way") {
      oneWayOpacity.value = 1;
      roundTripOpacity.value = 0.2;
    } else {
      oneWayOpacity.value = 0.2;
      roundTripOpacity.value = 1;
    }
  };

  const handleSearch = () => {
    router.push({
      pathname: "/trips",
      params: { from, to, date, seats },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="p-4 flex-row justify-between items-center">
          <Text className="text-xl font-bold">Hi, there 👋</Text>
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
          <View className="bg-white rounded-3xl opacity-90 p-4 shadow-lg">
            {/* Trip Type Toggle */}
            <View className="flex-row gap-6 mb-4 px-2">
              <Pressable onPress={() => handleTripTypeChange("one-way")}>
                <Animated.Text
                  style={oneWayStyle}
                  className="text-lg font-semibold"
                >
                  One-way
                </Animated.Text>
              </Pressable>
              <Pressable onPress={() => handleTripTypeChange("round-trip")}>
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
                  <TextInput
                    placeholder="Date"
                    className="flex-1"
                    placeholderTextColor="#666"
                    value={date}
                    onChangeText={setDate}
                  />
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
        <View className="px-4 mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold">Previous Trips</Text>
            <TouchableOpacity>
              <Text className="text-gray-400">See All</Text>
            </TouchableOpacity>
          </View>

          {/* Trip Cards */}
          <View className="gap-4">
            <TripCard
              id="87541"
              from="Oran"
              to="Bechar"
              fromTime="16:30"
              toTime="23:00"
              price="1500.00"
              duration="6h 30min"
              isBestPrice={false}
            />
            <TripCard
              id="87542"
              from="Alger"
              to="Constantine"
              fromTime="7:00 am"
              toTime="2:30 pm"
              price="1200.00"
              duration="5h 30min"
              isBestPrice={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
