import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TripCard from "../../components/TripCard";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TripsScreen() {
  const { from, to, date, seats } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Search Summary */}
          <View className="bg-gray-50 p-4 rounded-2xl mb-6">
            <View className="flex-row items-center mb-2">
              <Ionicons name="location" size={20} color="#000" />
              <Text className="text-base ml-2">
                From <Text className="font-bold">{from || "Oran"}</Text> to{" "}
                <Text className="font-bold">{to || "Bechar"}</Text>
              </Text>
            </View>
            <View className="flex-row justify-between">
              <View className="flex-row items-center">
                <Ionicons name="calendar" size={16} color="#666" />
                <Text className="text-sm text-gray-600 ml-1">
                  {date || "Any date"}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="people" size={16} color="#666" />
                <Text className="text-sm text-gray-600 ml-1">
                  {seats || "1"} seat(s)
                </Text>
              </View>
            </View>
          </View>

          <Text className="text-xl font-bold mb-4">Available Trips</Text>
          <View className="gap-4">
            <TripCard
              id="1"
              from="Oran"
              to="Bechar"
              fromTime="08:00"
              toTime="14:30"
              price="1400.00"
              duration="6h 30min"
              isBestPrice={true}
            />
            <TripCard
              id="2"
              from="Oran"
              to="Bechar"
              fromTime="10:30"
              toTime="17:00"
              price="1600.00"
              duration="6h 30min"
              isBestPrice={false}
            />
            <TripCard
              id="3"
              from="Oran"
              to="Bechar"
              fromTime="14:00"
              toTime="20:30"
              price="1500.00"
              duration="6h 30min"
              isBestPrice={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
