import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type SeatStatus = "available" | "taken" | "selected";

interface Seat {
  id: string;
  status: SeatStatus;
}

export default function SeatSelectionScreen() {
  const params = useLocalSearchParams();
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  // Initialize seats data
  const generateSeats = () => {
    const rows = ["A", "B", "C", "D"];
    const numbers = Array.from({ length: 10 }, (_, i) => i + 1); // Changed to 10 rows
    const seats: Record<string, Seat> = {};

    rows.forEach((row) => {
      numbers.forEach((num) => {
        const id = `${row}${num}`;
        // Simulate some taken seats
        const isTaken = ["A1", "A2", "A3", "B1", "B2", "A5"].includes(id);
        seats[id] = {
          id,
          status: isTaken ? "taken" : "available",
        };
      });
    });

    return seats;
  };

  const [seats, setSeats] = useState(generateSeats());

  const handleSeatPress = (seatId: string) => {
    if (seats[seatId].status === "taken") return;

    setSeats((prev) => {
      const newSeats = { ...prev };
      // Reset previously selected seat
      if (selectedSeat) {
        newSeats[selectedSeat].status = "available";
      }
      // Set new selected seat
      newSeats[seatId].status =
        newSeats[seatId].status === "selected" ? "available" : "selected";
      return newSeats;
    });
    setSelectedSeat(seatId);
  };

  const handleConfirm = () => {
    if (selectedSeat) {
      router.push({
        pathname: "/booking",
        params: {
          ...params,
          selectedSeat,
        },
      });
    }
  };

  const getSeatColor = (status: SeatStatus) => {
    switch (status) {
      case "taken":
        return "bg-red-500";
      case "selected":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row items-center p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="white"
            style={{ marginTop: 20 }}
          />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-lg font-semibold text-white">Take a seat!</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Legend */}
      <View className="flex-row bg-black justify-center gap-4 p-4">
        <View className="flex-row items-center">
          <View className="w-4 h-4 bg-gray-300 rounded-sm mr-2" />
          <Text className="text-white">Available</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-4 h-4 bg-red-500 rounded-sm mr-2" />
          <Text className="text-white">Taken</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-4 h-4 bg-green-500 rounded-sm mr-2" />
          <Text className="text-white">Selected</Text>
        </View>
      </View>

      <ScrollView className="flex-1 bg-zinc-900 px-4">
        <View className="flex-row bg-zinc-900 h-full justify-center gap-2">
          {/* Left side seats */}
          <View className="gap-2">
            {/* Driver Icon */}
            <View className="flex-row flex-[2] justify-center mb-4">
              <View>
                <Ionicons
                  name="caret-up-circle-outline"
                  size={50}
                  color="rgba(156, 230, 149, 0.37)"
                  style={{ marginTop: 10 }}
                />
              </View>
            </View>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((number) => (
              <View key={`left${number}`} className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => handleSeatPress(`A${number}`)}
                  className={`w-12 h-12 rounded-lg justify-center items-center ${getSeatColor(
                    seats[`A${number}`].status
                  )}`}
                >
                  <Text className="font-bold text-white">A{number}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSeatPress(`B${number}`)}
                  className={`w-12 h-12 rounded-lg justify-center items-center ${getSeatColor(
                    seats[`B${number}`].status
                  )}`}
                >
                  <Text className="font-bold text-white">B{number}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Aisle */}
          <View className="w-8" />

          {/* Right side seats */}
          <View className="gap-2" style={{ marginTop: -25 }}>
            <View className="flex-row mb-4">
              <View
                className="bg-zinc-900"
                style={{ width: "25%", marginTop: 90 }}
              ></View>
            </View>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((number) => (
              <View key={`right${number}`} className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => handleSeatPress(`C${number}`)}
                  className={`w-12 h-12 rounded-lg justify-center items-center ${getSeatColor(
                    seats[`C${number}`].status
                  )}`}
                >
                  <Text className="font-bold text-white">C{number}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSeatPress(`D${number}`)}
                  className={`w-12 h-12 rounded-lg justify-center items-center ${getSeatColor(
                    seats[`D${number}`].status
                  )}`}
                >
                  <Text className="font-bold text-white">D{number}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View className="p-4">
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={!selectedSeat}
          className={`p-4 rounded-xl ${
            selectedSeat ? "bg-green-500" : "bg-gray-500"
          }`}
        >
          <Text className="text-white text-center font-semibold">Confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
