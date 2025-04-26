import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface TripCardProps {
  from: string;
  to: string;
  fromTime: string;
  toTime: string;
  price: string;
  duration: string;
  isBestPrice?: boolean;
  id?: string;
}

export default function TripCard_link({
  from,
  to,
  fromTime,
  toTime,
  price,
  duration,
  isBestPrice = false,
  id,
}: TripCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/booking",
      params: { from, to, fromTime, toTime, price, duration, id },
    });
  };

  return (
    <Pressable>
      <View className="bg-black rounded-2xl p-4 w-full mb-4">
        {/* Price Header */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center space-x-2">
            <Ionicons name="bus-outline" size={20} color="white" />
            <Text className="text-white font-bold text-lg">Opath</Text>
          </View>
          <Text className="text-gray-400 font-bold text-2xl">{price} DA</Text>
        </View>

        {/* Locations */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white font-semibold">{from}</Text>
          <Text className="text-white font-semibold">{to}</Text>
        </View>

        {/* Trip Times */}
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-gray-400 text-sm mb-1">From</Text>
            <Text className="text-white text-xl font-bold">{fromTime}</Text>
          </View>

          {/* Timeline */}
          <View className="flex-1 mx-4 items-center">
            <View className="flex-row items-center">
              <View className="h-2 w-2 rounded-full bg-[#4CAF50]" />
              <View className="h-[1px] flex-1 bg-[#4CAF50]" />
              <View className="h-2 w-2 rounded-full bg-[#4CAF50]" />
            </View>
          </View>

          <View>
            <Text className="text-gray-400 text-sm mb-1">Destination</Text>
            <Text className="text-white text-xl font-bold">{toTime}</Text>
          </View>
        </View>

        {/* Duration and Best Price */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text className="text-gray-400 text-sm ml-1">
              Duration: {duration}
            </Text>
          </View>
          {isBestPrice && (
            <Text className="text-[#4CAF50] font-semibold">
              "Best <Text className="text-[#4CAF50]">Price</Text>"
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
