import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function TicketDetailScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="p-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text className="text-white text-xl font-bold text-center mt-2">
          My Ticket
        </Text>
      </View>

      {/* Ticket Card */}
      <View className="mx-4">
        <View className="bg-white rounded-3xl p-6">
          {/* Route Line */}
          <View className="flex-row justify-between items-center mb-8">
            <View className="items-center">
              <View className="h-3 w-3 rounded-full bg-gray-400" />
              <Text className="text-black font-bold mt-2">ORAN</Text>
              <Text className="text-gray-400 text-xs">Algeria</Text>
            </View>
            <View className="flex-1 items-center">
              <View className="w-full h-[1px] border-t-2 border-dashed border-gray-300" />
            </View>
            <View className="items-center">
              <View className="h-3 w-3 rounded-full bg-gray-400" />
              <Text className="text-black font-bold mt-2">BECHAR</Text>
              <Text className="text-gray-400 text-xs">Algeria</Text>
            </View>
          </View>

          {/* Ticket Details */}
          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="text-gray-400 text-xs">Passenger:</Text>
              <Text className="text-black font-semibold">Reguig Ali</Text>
            </View>
            <View>
              <Text className="text-gray-400 text-xs">Voyage ID:</Text>
              <Text className="text-black font-semibold">87541</Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="text-gray-400 text-xs">Date:</Text>
              <Text className="text-black font-semibold">2025-04-30</Text>
            </View>
            <View>
              <Text className="text-gray-400 text-xs">Boarding:</Text>
              <Text className="text-black font-semibold">16:30</Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-6">
            <View>
              <Text className="text-gray-400 text-xs">Passenger ID:</Text>
              <Text className="text-black font-semibold">864652</Text>
            </View>
            <View>
              <Text className="text-gray-400 text-xs">Seat Number:</Text>
              <Text className="text-black font-semibold">87541</Text>
            </View>
          </View>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="h-6 w-6 rounded-full bg-black -ml-9" />
            <View className="flex-1 border-t-2 border-dashed border-gray-300" />
            <View className="h-6 w-6 rounded-full bg-black -mr-9" />
          </View>

          {/* QR Code */}
          <View className="items-center">
            <View className="bg-black p-2 rounded-lg mb-4">
              <Ionicons name="qr-code" size={32} color="white" />
            </View>
            <View className="h-8 w-48 bg-gray-900" />
          </View>
        </View>
      </View>

      {/* Download Button */}
      <Pressable className="mt-6">
        <Text className="text-blue-500 text-center">Download the receite</Text>
      </Pressable>
    </SafeAreaView>
  );
}
