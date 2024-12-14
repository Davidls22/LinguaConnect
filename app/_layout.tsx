import React from "react";
import { GluestackUIProvider} from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config"; 
import { AuthProvider } from "../contexts/AuthContext"; 
import { Stack } from "expo-router"; 
import { LogBox } from "react-native";

LogBox.ignoreAllLogs();

export default function RootLayout() {
  return (
    <GluestackUIProvider config={config}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </GluestackUIProvider>
  );
}