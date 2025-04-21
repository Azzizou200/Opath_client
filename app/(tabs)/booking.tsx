import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function BookingScreen() {
  const params = useLocalSearchParams();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("visa");
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const handleSeatSelection = () => {
    router.push({
      pathname: "/seat-selection",
      params: { ...params },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-lg font-semibold">Please enter your info!</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Seat Selection */}
        <TouchableOpacity
          onPress={handleSeatSelection}
          style={{ borderStyle: "dashed" }}
          className="border-4 border-gray-200 rounded-lg p-4 mb-6"
        >
          <View className="flex-row items-center mb-2">
            <Ionicons name="person-outline" size={24} color="black" />
            <Text className="text-base font-medium ml-2">
              {selectedSeat
                ? `Selected seat: ${selectedSeat}`
                : "Choose a seat please."}
            </Text>
          </View>
          <Text className="text-sm text-gray-500">
            {selectedSeat
              ? "Tap to change your seat"
              : "You must choose an empty seat for your trip."}
          </Text>
        </TouchableOpacity>

        {/* Personal Information */}
        <View className="bg-[#222222] rounded-xl p-4 mb-6">
          <Text className="text-white mb-4">Fill your informations please</Text>
          <View className="gap-4">
            <TextInput
              placeholder="@gmail.com"
              value={email}
              onChangeText={setEmail}
              className="bg-gray-800 text-white p-3 rounded-lg"
              placeholderTextColor="#666"
            />
            <TextInput
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              className="bg-gray-800 text-white p-3 rounded-lg"
              placeholderTextColor="#666"
            />
            <TextInput
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              className="bg-gray-800 text-white p-3 rounded-lg"
              placeholderTextColor="#666"
            />
          </View>
        </View>

        {/* Payment Methods */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Text className="text-base font-medium">Choose payment method</Text>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="gray"
              className="ml-1"
            />
          </View>

          {/* Visa */}
          <TouchableOpacity
            className={`flex-row items-center justify-between p-4 border rounded-lg mb-2 ${
              selectedPayment === "visa"
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
            }`}
            onPress={() => setSelectedPayment("visa")}
          >
            <View className="flex-row items-center">
              <Ionicons name="card-outline" size={24} color="black" />
              <Text className="ml-2">Regular AI</Text>
            </View>
            {selectedPayment === "visa" && (
              <Ionicons name="checkmark-circle" size={24} color="green" />
            )}
          </TouchableOpacity>

          {/* PayPal */}
          <TouchableOpacity
            className={`flex-row items-center justify-between p-4 border rounded-lg mb-2 ${
              selectedPayment === "paypal"
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
            }`}
            onPress={() => setSelectedPayment("paypal")}
          >
            <View className="flex-row items-center">
              <Ionicons name="card-outline" size={24} color="black" />
              <Text className="ml-2">Regular AI</Text>
            </View>
            {selectedPayment === "paypal" && (
              <Ionicons name="checkmark-circle" size={24} color="green" />
            )}
          </TouchableOpacity>

          {/* Chase */}
          <TouchableOpacity
            className={`flex-row items-center justify-between p-4 border rounded-lg mb-2 ${
              selectedPayment === "chase"
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
            }`}
            onPress={() => setSelectedPayment("chase")}
          >
            <View className="flex-row items-center">
              <Ionicons name="card-outline" size={24} color="black" />
              <Text className="ml-2">Regular AI</Text>
            </View>
            {selectedPayment === "chase" && (
              <Ionicons name="checkmark-circle" size={24} color="green" />
            )}
          </TouchableOpacity>

          {/* Add new card button */}
          <TouchableOpacity className="flex-row items-center p-2">
            <Ionicons name="add-circle-outline" size={20} color="black" />
            <Text className="ml-2">Add new card</Text>
          </TouchableOpacity>
        </View>

        {/* Pay Button */}
        <TouchableOpacity className="bg-black flex-row items-center justify-between p-4 rounded-xl mb-6">
          <Text className="text-white font-semibold">1500.00 DA</Text>
          <View className="flex-row items-center">
            <Text className="text-white font-semibold mr-2">Pay</Text>
            <Ionicons name="lock-closed" size={16} color="white" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
