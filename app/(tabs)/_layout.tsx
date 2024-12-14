import React from "react";
import { Tabs } from "expo-router";
import ProtectedRoute from "../../components/ProtectedRoute";
import { Ionicons } from "@expo/vector-icons"; 
import { useTheme } from "@gluestack-ui/themed";

export default function TabLayout() {
  const theme = useTheme(); 

  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            left: 16,
            right: 16,
            height: 70, 
            backgroundColor: theme.colors?.darkBlue800 || "#002851", 
            shadowColor: theme.colors?.primary500 || "#0077E6",
            shadowOpacity: 0.1,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            borderRadius: 16,
          },
          tabBarItemStyle: {
            paddingVertical: 1,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            color: theme.colors?.rose400 || "#FB7185",
          },
          tabBarActiveTintColor: theme.colors?.rose400 || "#FB7185", 
          tabBarInactiveTintColor: theme.colors?.rose300 || "#FDA4AF", 
        }}
      >
        {/* Home Tab */}
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ), 
          }}
        />
        {/* Lessons Tab */}
        <Tabs.Screen
          name="lessons"
          options={{
            title: "Lessons",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book-outline" color={color} size={size} />
            ), 
          }}
        />
        {/* Leaderboard Tab */}
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: "Leaderboard",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="trophy-outline" color={color} size={size} />
            ), 
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}