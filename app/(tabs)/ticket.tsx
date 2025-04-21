import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TripCard from "../../components/TripCard";

export default function TicketScreen() {
  const recentTrips = [
    {
      id: "87541",
      from: "Oran",
      to: "Bechar",
      fromTime: "16:30",
      toTime: "23:00",
      price: "1500.00",
      duration: "6h 30min",
    },
    {
      id: "87542",
      from: "Alger",
      to: "Constantine",
      fromTime: "7:00 am",
      toTime: "2:30 pm",
      price: "1200.00",
      duration: "7h 30min",
    },
  ];

  const savedTrips = [
    {
      id: "87543",
      from: "Oran",
      to: "Bechar",
      fromTime: "6:00 am",
      toTime: "12:30 pm",
      price: "900.00",
      duration: "6h 30min",
    },
    {
      id: "87544",
      from: "Setif",
      to: "Annaba",
      fromTime: "8:00 am",
      toTime: "2:00 pm",
      price: "800.00",
      duration: "6h",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="p-4 border-b border-gray-100">
          <Text className="text-2xl font-bold">My Tickets</Text>
        </View>

        {/* Recent Trips */}
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold">Recent Trips</Text>
            <Text className="text-gray-400 text-sm">View All</Text>
          </View>
          <View className="space-y-4">
            {recentTrips.map((trip, index) => (
              <TripCard key={`recent-${index}`} {...trip} isBestPrice={false} />
            ))}
          </View>
        </View>

        {/* Saved Trips */}
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold">Saved Trips</Text>
            <Text className="text-gray-400 text-sm">View All</Text>
          </View>
          <View className="space-y-4">
            {savedTrips.map((trip, index) => (
              <TripCard key={`saved-${index}`} {...trip} isBestPrice={false} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
