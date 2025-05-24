import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TripCard from "../../components/TripCard";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../../lib/supabase";

// Define Trip interface to fix TypeScript errors
interface Trip {
  id: string;
  from: string;
  to: string;
  fromTime: string;
  toTime: string;
  price: string; // Changed to string to match TripCard props
  duration: string;
  date: string;
  seatsLeft: number;
  bus_id: string;
  seats_initial: number;
}

export default function TripsScreen() {
  // Get the search params
  const params = useLocalSearchParams();
  // Create state variables that will update when params change
  const [searchParams, setSearchParams] = useState({
    from: params.from as string,
    to: params.to as string,
    date: params.date as string,
    seats: params.seats as string
  });
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [routeIds, setRouteIds] = useState<string[]>([]);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  // Update searchParams when params change
  useEffect(() => {
    const newParams = {
      from: params.from as string,
      to: params.to as string,
      date: params.date as string,
      seats: params.seats as string
    };
    
    // Only update if the params have actually changed
    if (JSON.stringify(newParams) !== JSON.stringify(searchParams)) {
      console.log("Params changed, updating search parameters:", newParams);
      setSearchParams(newParams);
    }
  }, [params]);

  // Fetch trips whenever searchParams change
  useEffect(() => {
    console.log("Search parameters updated, fetching trips");
    fetchTrips();
  }, [searchParams]);

  useFocusEffect(
    useCallback(() => {
      console.log("Screen focused");
      // Check if params have changed since last focus
      const newParams = {
        from: params.from as string,
        to: params.to as string,
        date: params.date as string,
        seats: params.seats as string
      };
      
      if (JSON.stringify(newParams) !== JSON.stringify(searchParams)) {
        setSearchParams(newParams);
      }
    }, [params, searchParams])
  );

  useEffect(() => {
    if (!routeIds.length) return; // Don't subscribe if no routes

    console.log("Setting up subscription for routes:", routeIds);

    const subscription = supabase
      .channel("trips_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trips",
          filter: `route_id=in.(${routeIds.join(",")})`,
        },
        (payload) => {
          console.log("Real-time update received:", payload);
          setShouldRefresh(true); // Mark for refresh instead of immediate fetch
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, [routeIds]); // Only re-run when routeIds change

  useEffect(() => {
    if (shouldRefresh) {
      fetchTrips();
      setShouldRefresh(false);
    }
  }, [shouldRefresh]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("from", `%${searchParams.from}%`);
      console.log("to", `%${searchParams.to}%`);
      const { data: routeData, error: routeError } = await supabase
        .from("routes")
        .select("id")
        .ilike("start_location", `%${searchParams.from}%`)
        .ilike("destination", `%${searchParams.to}%`);

      if (routeError) throw routeError;
      console.log("routeData", routeData);
      if (!routeData?.length) {
        setTrips([]);
        setError("No routes found for these locations");
        return;
      }

      const newRouteIds = routeData.map((route) => route.id);
      // Only update routeIds if they've changed
      if (JSON.stringify(newRouteIds) !== JSON.stringify(routeIds)) {
        setRouteIds(newRouteIds);
      }

      const { data: tripData, error: tripError } = await supabase
        .from("trips")
        .select(
          `
          *,
          routes:route_id (
            start_location,
            destination,
            duration
          )
        `
        )
        .in("route_id", newRouteIds)
        .gte("seats_left", parseInt(searchParams.seats as string) || 1);

      if (tripError) throw tripError;

      let filteredTripData = tripData;
      if (searchParams.date) {
        filteredTripData = tripData.filter(
          (trip) => new Date(trip.date) >= new Date(searchParams.date as string)
        );
      }

      const transformedTrips = filteredTripData.map((trip) => ({
        id: trip.id,
        from: trip.routes.start_location,
        to: trip.routes.destination,
        fromTime: trip.start_time,
        toTime: trip.end_time,
        price: trip.price,
        duration: trip.duration,
        date: trip.date,
        seatsLeft: trip.seats_left,
        bus_id: trip.bus_id,
        seats_initial: parseInt(searchParams.seats as string),
      }));

      setTrips(transformedTrips);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching trips";
      setError(errorMessage);
      console.error("Error fetching trips:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Search Summary */}
          <View className="bg-gray-50 p-4 rounded-2xl mb-6">
            <View className="flex-row items-center mb-2">
              <Ionicons name="location" size={20} color="#000" />
              <Text className="text-base ml-2">
                From <Text className="font-bold">{searchParams.from}</Text> to{" "}
                <Text className="font-bold">{searchParams.to}</Text>
              </Text>
            </View>
            <View className="flex-row justify-between">
              <View className="flex-row items-center">
                <Ionicons name="calendar" size={16} color="#666" />
                <Text className="text-sm text-gray-600 ml-1">{searchParams.date}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="people" size={16} color="#666" />
                <Text className="text-sm text-gray-600 ml-1">
                  {searchParams.seats} seat(s)
                </Text>
              </View>
            </View>
          </View>

          {/* Status Messages */}
          {error ? (
            <View className="p-4 bg-red-50 rounded-xl mb-4">
              <Text className="text-red-600 text-center">{error}</Text>
            </View>
          ) : (
            <Text className="text-xl font-bold mb-4">
              {loading ? "Searching..." : `Available Trips (${trips.length})`}
            </Text>
          )}

          {/* Results */}
          <View className="gap-4">
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : trips.length > 0 ? (
              trips.map((trip) => (
                <TripCard
                  key={trip.id}
                  id={trip.id}
                  from={trip.from}
                  to={trip.to}
                  fromTime={trip.fromTime}
                  toTime={trip.toTime}
                  price={trip.price}
                  duration={trip.duration}
                  date={trip.date}
                  seatsLeft={trip.seatsLeft}
                  bus_id={trip.bus_id}
                  seats_initial={parseInt(searchParams.seats as string)}
                />
              ))
            ) : (
              <View className="p-4 bg-gray-50 rounded-xl">
                <Text className="text-center text-gray-500">
                  No trips found matching your criteria
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
