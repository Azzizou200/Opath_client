import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

type SeatStatus = "available" | "taken" | "selected";

interface Seat {
  id: string;
  status: SeatStatus;
}

export default function SeatSelectionScreen() {
  const params = useLocalSearchParams();
  const seatsToSelect = parseInt(params.seats_initial as string) || 1;
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seats, setSeats] = useState<Record<string, Seat>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch taken seats from the database
  useEffect(() => {
    const fetchTakenSeats = async () => {
      try {
        // Get all bookings for this trip
        const { data: bookings, error: bookingsError } = await supabase
          .from("clientbookings")
          .select("seat_number")
          .eq("trip_id", params.id);

        if (bookingsError) throw bookingsError;

        // Initialize seats
        const rows = ["A", "B", "C", "D"];
        const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
        const initialSeats: Record<string, Seat> = {};

        // First, mark all seats as available
        rows.forEach((row) => {
          numbers.forEach((num) => {
            const id = `${row}${num}`;
            initialSeats[id] = {
              id,
              status: "available",
            };
          });
        });

        // Then mark booked seats as taken
        bookings?.forEach((booking) => {
          const bookedSeats = booking.seat_number.split(",");
          bookedSeats.forEach((seatId: string) => {
            if (initialSeats[seatId.trim()]) {
              initialSeats[seatId.trim()].status = "taken";
            }
          });
        });

        setSeats(initialSeats);
      } catch (error) {
        console.error("Error fetching taken seats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTakenSeats();
  }, [params.id]);

  const handleSeatPress = (seatId: string) => {
    if (seats[seatId].status === "taken") return;

    setSeats((prev) => {
      const newSeats = { ...prev };

      if (newSeats[seatId].status === "selected") {
        // Deselect the seat
        newSeats[seatId].status = "available";
        setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
      } else if (selectedSeats.length < seatsToSelect) {
        // Select the seat if we haven't reached the limit
        newSeats[seatId].status = "selected";
        setSelectedSeats([...selectedSeats, seatId]);
      }

      return newSeats;
    });
  };

  const handleConfirm = () => {
    if (selectedSeats.length === seatsToSelect) {
      router.push({
        pathname: "/booking",
        params: {
          ...params,
          selectedSeats: selectedSeats.join(","),
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

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white mt-4">Loading seats...</Text>
      </SafeAreaView>
    );
  }

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
          <Text className="text-lg font-semibold text-white">
            Select {seatsToSelect} seat{seatsToSelect > 1 ? "s" : ""}
          </Text>
          <Text className="text-sm text-gray-400">
            {selectedSeats.length} of {seatsToSelect} selected
          </Text>
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
                    seats[`A${number}`]?.status || "available"
                  )}`}
                >
                  <Text className="font-bold text-white">A{number}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSeatPress(`B${number}`)}
                  className={`w-12 h-12 rounded-lg justify-center items-center ${getSeatColor(
                    seats[`B${number}`]?.status || "available"
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
                    seats[`C${number}`]?.status || "available"
                  )}`}
                >
                  <Text className="font-bold text-white">C{number}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSeatPress(`D${number}`)}
                  className={`w-12 h-12 rounded-lg justify-center items-center ${getSeatColor(
                    seats[`D${number}`]?.status || "available"
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
          disabled={selectedSeats.length !== seatsToSelect}
          className={`p-4 rounded-xl ${
            selectedSeats.length === seatsToSelect
              ? "bg-green-500"
              : "bg-gray-500"
          }`}
        >
          <Text className="text-white text-center font-semibold">
            {selectedSeats.length === seatsToSelect
              ? "Confirm Selection"
              : `Select ${seatsToSelect - selectedSeats.length} more seat${
                  seatsToSelect - selectedSeats.length > 1 ? "s" : ""
                }`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
