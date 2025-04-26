import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ykkipspaahuvemajqobx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlra2lwc3BhYWh1dmVtYWpxb2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MTg0OTAsImV4cCI6MjA1NDI5NDQ5MH0.noxTUdZMwIdMTOb6_6H-BRzK_-mTw99dtDGBjf2-ZAs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
