import { Tabs } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View className="flex-row justify-around items-center bg-white py-3 border-t border-gray-100">
      <TouchableOpacity
        onPress={() => navigation.navigate("index")}
        className="items-center"
      >
        <Ionicons
          name={state.index === 0 ? "home" : "home-outline"}
          size={24}
          color={state.index === 0 ? "#4CAF50" : "#666"}
        />
        <Text
          className={`text-xs mt-1 ${
            state.index === 0 ? "text-[#4CAF50]" : "text-gray-500"
          }`}
        >
          Home
        </Text>
      </TouchableOpacity>


     
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
    
    </Tabs>
  );
}
