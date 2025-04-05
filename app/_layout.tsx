import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import * as NavigationBar from "expo-navigation-bar";
import { NavigationContainer } from "@react-navigation/native";
export default function RootLayout() {
  NavigationBar.setVisibilityAsync("hidden");
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
