import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

export default function BookingScreen() {
  const params = useLocalSearchParams();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("visa");
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [bus_layout, setBus_layout] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const backup = params;

  useEffect(() => {
    const calculatePrice = async () => {
      if (params.id && params.seats_initial) {
        try {
          const { data: tripData, error } = await supabase
            .from("trips")
            .select("price")
            .eq("id", params.id)
            .single();

          if (error) throw error;
          if (!tripData) throw new Error("Trip not found");

          const seatsCount = parseInt(params.seats_initial as string) || 0;
          const calculatedPrice = tripData.price * seatsCount;
          setTotalPrice(calculatedPrice);
        } catch (error) {
          console.error("Error calculating price:", error);
          setTotalPrice(0);
        }
      }
    };

    calculatePrice();
  }, [params.id, params.seats_initial]);

  const fetchBus = async () => {
    const { data: busData, error: busError } = await supabase
      .from("buses")
      .select("*")
      .eq("id", params.bus_id);

    if (busError) throw busError;
    setBus_layout(busData[0].layout_type);
    return console.log("********* bus data", busData[0]);
  };

  const handleSeatSelection = () => {
    router.push({
      pathname:
        bus_layout === "A"
          ? "/seat-selection"
          : bus_layout === "B"
          ? "/seat-selection-8"
          : "/seat-selection-10",
      params: {
        id: params.id,
        seats_initial: params.seats_initial,
        bus_id: params.bus_id,
      },
    });
  };

  const handlePayment = async () => {
    if (!email || !fullName) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (!params.selectedSeats) {
      Alert.alert("Error", "Please select your seats first");
      return;
    }

    try {
      setIsLoading(true);

      const { data: tripData, error: tripError } = await supabase
        .from("trips")
        .select("price")
        .eq("id", params.id)
        .single();

      if (tripError) throw tripError;
      if (!tripData) throw new Error("Trip not found");

      const seatsCount = parseInt(params.seats_initial as string) || 0;
      const totalPrice = tripData.price * seatsCount;

      const { data, error } = await supabase
        .from("clientbookings")
        .insert([
          {
            client_name: fullName,
            email: email,
            seat_number: params.selectedSeats,
            payment_status: "pending",
            trip_id: params.id,
          },
        ])
        .select();

      if (error) throw error;

      const { data: currentTripData, error: fetchError } = await supabase
        .from("trips")
        .select("seats_left, total_earnings")
        .eq("id", params.id)
        .single();

      if (fetchError) throw fetchError;
      if (!currentTripData) throw new Error("Trip not found");

      const { error: updateError } = await supabase
        .from("trips")
        .update({
          seats_left: currentTripData.seats_left - seatsCount,
          total_earnings: (currentTripData.total_earnings || 0) + totalPrice,
        })
        .eq("id", params.id);

      if (updateError) throw updateError;

      router.push({
        pathname: "/final_ticket/qr",
        params: {
          booking_id: data[0].id,
        },
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      Alert.alert("Error", "Failed to create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  fetchBus();
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
              {params.selectedSeats
                ? `Selected seats: ${params.selectedSeats}`
                : "Choose seats please."}
            </Text>
          </View>
          <Text className="text-sm text-gray-500">
            {params.selectedSeats
              ? "Tap to change your seats"
              : "You must choose empty seats for your trip."}
          </Text>
        </TouchableOpacity>

        {/* Personal Information */}
        <View className="bg-[#222222] rounded-xl p-4 mb-6">
          <Text className="text-white mb-4">Fill your information please</Text>
          <View className="gap-4">
            <TextInput
              placeholder="@gmail.com"
              value={email}
              onChangeText={setEmail}
              className="bg-gray-800 text-white p-3 rounded-lg"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
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
        <TouchableOpacity
          className="bg-black flex-row items-center justify-between p-4 rounded-xl mb-6"
          onPress={handlePayment}
          disabled={isLoading}
        >
          <Text className="text-white font-semibold">{totalPrice} DA</Text>
          <View className="flex-row items-center">
            <Text className="text-white font-semibold mr-2">
              {isLoading ? "Processing..." : "Pay"}
            </Text>
            <Ionicons name="lock-closed" size={16} color="white" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
