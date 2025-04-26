import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import ViewShot from "react-native-view-shot";
import * as Print from "expo-print";

interface TicketData {
  clientName: string;
  seatNumber: string;
  date: string;
  startTime: string;
  duration: string;
  startLocation: string;
  destination: string;
  startStreet: string;
  destinationStreet: string;
  bookingId: string;
}

const requestStoragePermission = async () => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "App needs access to storage to save the ticket",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

export default function TicketDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const ticketRef = useRef<ViewShot>(null);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const { data: bookingData, error: bookingError } = await supabase
          .from("clientbookings")
          .select("client_name, seat_number, trip_id")
          .eq("id", params.booking_id)
          .single();

        if (bookingError) throw bookingError;

        const { data: tripData, error: tripError } = await supabase
          .from("trips")
          .select(
            `
            date,
            start_time,
            duration,
            routes:route_id (
              start_location,
              destination,
              start_street,
              destination_street
            )
          `
          )
          .eq("id", bookingData.trip_id)
          .single();

        if (tripError) throw tripError;

        setTicketData({
          clientName: bookingData.client_name,
          seatNumber: bookingData.seat_number,
          date: tripData.date,
          startTime: tripData.start_time,
          duration: tripData.duration,
          startLocation: tripData.routes?.start_location,
          destination: tripData.routes?.destination,
          startStreet: tripData.routes?.start_street,
          destinationStreet: tripData.routes?.destination_street,
          bookingId: params.booking_id as string,
        });
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [params.booking_id]);

  const generatePDF = async () => {
    try {
      // Capture with higher quality settings
      const imageURI = await ticketRef.current?.capture({
        quality: 1,
        format: "png",
        result: "data-uri",
        snapshotContentContainer: true,
      });

      if (!imageURI) {
        throw new Error("Failed to capture ticket image");
      }

      // Create PDF with better image handling
      const { uri } = await Print.printToFileAsync({
        html: `
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
              <style>
                body {
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  background-color: white;
                }
                .ticket-container {
                  width: 100%;
                  max-width: 100%;
                  text-align: center;
                }
                img {
                  width: 100%;
                  max-width: 100%;
                  height: auto;
                  object-fit: contain;
                }
              </style>
            </head>
            <body>
              <div class="ticket-container">
                <img src="${imageURI}" />
              </div>
            </body>
          </html>
        `,
        base64: false,
        margins: { left: 0, top: 0, right: 0, bottom: 0 },
      });

      // Share the PDF file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Save Ticket",
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert("Error", "Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Error generating ticket:", error);
      Alert.alert("Error", "Failed to generate ticket");
    }
  };

  const handleDownload = async () => {
    await generatePDF();
  };

  if (loading || !ticketData) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center">
          <Text className="text-white">Loading ticket details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-800">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-xl font-bold flex-1 text-center">
            My Ticket
          </Text>
          <View style={{ width: 40 }} /> {/* Spacer for alignment */}
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Ticket Card */}
        <View className="mx-4 my-6">
          <ViewShot
            ref={ticketRef}
            options={{
              format: "png",
              quality: 1,
              result: "data-uri",
            }}
          >
            <View className="bg-white rounded-3xl p-6 shadow-lg">
              {/* Route Line */}
              <View className="mb-8">
                {/* Cities and Streets with Simple Line */}
                <View className="px-4 py-2">
                  {/* From */}
                  <View className="mb-4">
                    <Text className="text-gray-500 text-xs">From</Text>
                    <Text className="text-black font-bold text-lg">
                      {ticketData.startLocation}
                    </Text>
                    <Text className="text-gray-400 text-xs">
                      {ticketData.startStreet}
                    </Text>
                  </View>

                  {/* Simple Line with Dots */}
                  <View className="flex-row items-center justify-center my-2">
                    <View className="h-2 w-2 rounded-full bg-[#4CAF50]" />
                    <View className="flex-1 h-0.5 bg-[#4CAF50] mx-2" />
                    <View className="h-2 w-2 rounded-full bg-[#4CAF50] opacity-60" />
                  </View>

                  {/* To */}
                  <View className="mt-4">
                    <Text className="text-gray-500 text-xs">To</Text>
                    <Text className="text-black font-bold text-lg">
                      {ticketData.destination}
                    </Text>
                    <Text className="text-gray-400 text-xs">
                      {ticketData.destinationStreet}
                    </Text>
                  </View>
                </View>

                {/* Time Info */}
                <View className="flex-row justify-between px-4 mt-4">
                  <View className="items-start">
                    <Text className="text-gray-500 text-xs">Departure</Text>
                    <Text className="text-black font-medium mt-1">
                      {ticketData.startTime}
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-gray-500 text-xs">Duration</Text>
                    <Text className="text-black font-medium mt-1">
                      {ticketData.duration}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-gray-500 text-xs">Date</Text>
                    <Text className="text-black font-medium mt-1">
                      {ticketData.date}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Info Grid */}
              <View className="bg-gray-50 rounded-xl p-4 mb-6">
                <View className="flex-row justify-between mb-4">
                  <View className="flex-1 pr-2">
                    <Text className="text-gray-500 text-xs mb-1">
                      Passenger
                    </Text>
                    <Text className="text-black font-semibold">
                      {ticketData.clientName}
                    </Text>
                  </View>
                  <View className="flex-1 pl-2">
                    <Text className="text-gray-500 text-xs mb-1">Seat</Text>
                    <Text className="text-black font-semibold">
                      {ticketData.seatNumber}
                    </Text>
                  </View>
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
                <View className="bg-gray-900 p-4 rounded-xl mb-4">
                  <QRCode
                    value={JSON.stringify({
                      bookingId: ticketData.bookingId,
                      clientName: ticketData.clientName,
                      seatNumber: ticketData.seatNumber,
                      date: ticketData.date,
                      startTime: ticketData.startTime,
                      from: ticketData.startLocation,
                      to: ticketData.destination,
                    })}
                    size={200}
                    color="white"
                    backgroundColor="black"
                  />
                </View>
                <View className="h-1 w-32 bg-gray-300 rounded-full mb-2" />
                <View className="h-1 w-24 bg-gray-200 rounded-full" />
              </View>
            </View>
          </ViewShot>
        </View>

        {/* Download Button */}
        <Pressable className="mx-4 mb-6" onPress={handleDownload}>
          <View className="bg-[#4CAF50] p-4 rounded-xl">
            <Text className="text-white text-center font-semibold">
              Download Ticket
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
