import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  Spinner,
  Badge,
  Icon,
  useTheme,
} from "@gluestack-ui/themed";
import { getLeaderboard } from "../services/leaderboardService";
import { Ionicons } from "@expo/vector-icons";

interface LeaderboardEntry {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  score: number;
  date?: string;
}

export default function LeaderboardScreen() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const data = await getLeaderboard();
        console.log("Fetched leaders:", data);
        setLeaders(data);
      } catch (error) {
        setError("Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  if (loading) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        bg="$darkBlue800"
      >
        <Spinner color="$rose400" size="large" />
        <Text mt={4} fontSize={30} color="$rose300">
          Loading leaderboard...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        bg="$darkBlue800"
      >
        <Text fontSize={30} fontWeight="bold" color="$error500">
          {error}
        </Text>
      </Box>
    );
  }

  return (
    <Box flex={1} p={4} bg="$darkBlue800">
      {/* Title */}
      <Text
        fontSize={40}
        fontWeight="bold"
        textAlign="center"
        mt={80}
        mb={20}
        color="$rose400"
      >
        Leaderboard
      </Text>

      {/* Leaderboard List */}
      <FlatList
        data={leaders}
        keyExtractor={(item, index) => {
          const cleanId = item.user._id.startsWith("drafts.")
            ? item.user._id.replace("drafts.", "")
            : item.user._id;
          console.log(`Key for index ${index}: ${cleanId}`);
          return cleanId; 
        }}
        renderItem={({ item, index }) => {
          console.log("Rendering item at index:", index);
          console.log("Leaderboard entry:", item);

          return (
            <Card
              p={6}
              mb={10}
              borderRadius="$lg"
              bg="$darkBlue700"
              borderColor="$rose500"
              borderWidth={1}
            >
              <HStack justifyContent="space-between" alignItems="center">
                <HStack alignItems="center" space={4}>
                  {index === 0 ? (
                    <Icon
                      as={Ionicons}
                      name="trophy"
                      color="$success500"
                      size={30}
                      mr={18}
                    />
                  ) : (
                    <Box
                      borderRadius={50}
                      borderWidth={1}
                      borderColor="$rose500"
                      px={8}
                      py={2}
                      justifyContent="center"
                      alignItems="center"
                      mr={20}
                    >
                      <Text
                        fontSize={20}
                        fontWeight="bold"
                        color="$rose300"
                      >
                        {index + 1}
                      </Text>
                    </Box>
                  )}
                  <Text fontSize={30} fontWeight="bold" color="$rose300">
                    {item.user.username}
                  </Text>
                </HStack>
                <Text fontSize={20} fontWeight="bold" color="$rose300">
                  {item.score} pts
                </Text>
              </HStack>
            </Card>
          );
        }}
        ListEmptyComponent={
          <Box flex={1} justifyContent="center" alignItems="center" mt={4}>
            <Text fontSize={30} color="$muted400">
              No leaders available at this time.
            </Text>
          </Box>
        }
      />
    </Box>
  );
}
