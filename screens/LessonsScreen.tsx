import React, { useState, useCallback, useEffect } from "react";
import { FlatList } from "react-native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Spinner,
  Card,
  Button,
  useTheme,
  ButtonText,
} from "@gluestack-ui/themed";
import { useFocusEffect } from "@react-navigation/native";
import { fetchLessonsByLanguage } from "../services/lessonService";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "expo-router";

export default function LessonsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useTheme();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLessons = useCallback(async () => {
    if (!user?.currentLanguageId) {
      console.error("No language ID found for the user.");
      return;
    }

    try {
      console.log("Fetching lessons for language ID:", user.currentLanguageId);
      const data = await fetchLessonsByLanguage(user.currentLanguageId);
      console.log("Fetched lessons:", data);
      setLessons(data);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.currentLanguageId]);

  useFocusEffect(
    useCallback(() => {
      console.log("Screen focused: Fetching lessons again...");
      setLoading(true); 
      fetchLessons();
    }, [fetchLessons, user?.currentLanguageId])
  );

  const handlePress = (lesson) => {
    console.log("Navigating to lesson details for:", lesson);
    router.push(`/lessons/${lesson._id}`);
  };

  if (loading) {
    console.log("Loading lessons...");
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="$darkBlue800" px={4}>
        <Spinner color="$rose400" size="large" />
        <Text mt={4} fontSize={18} fontWeight="medium" color="$rose300">
          Loading lessons...
        </Text>
      </Box>
    );
  }

  console.log("Rendering lessons:", lessons);

  return (
    <Box flex={1} px={4} bg="$darkBlue800" >
      {/* Header Section */}
      <Text
        fontSize={36}
        fontWeight="bold"
        textAlign="center"
        mt={64}
        mb={30}
        color="$rose400"
      >
        Available Lessons
      </Text>

      {/* Lessons List */}
      <FlatList
        data={[...lessons].sort((a, b) => {
          const numA = parseInt(a.title.match(/^\d+/)?.[0] || "0", 10);
          const numB = parseInt(b.title.match(/^\d+/)?.[0] || "0", 10);
          return numA - numB; 
        })}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <Card
            mb={4}
            p={6}
            borderRadius="$lg"
            bg="$darkBlue700"
            borderColor="$rose500"
            borderWidth={1}
          >
            <HStack space={4} alignItems="center">
              <VStack flex={1}>
                <Text fontSize={20} fontWeight="bold" color="$rose300">
                  {item.title}
                </Text>
                <Text mt={8} fontSize={14} color="$rose200">
                  {item.description}
                </Text>
              </VStack>
              <Button
                size="md"
                bg="$rose500"
                onPress={() => handlePress(item)}
                mr={8}
              >
                <ButtonText color="$textLight0">Start</ButtonText>
              </Button>
            </HStack>
          </Card>
        )}
        ListEmptyComponent={
          <Box flex={1} justifyContent="center" alignItems="center" mt={4}>
            <Text fontSize={18} color="$rose200">
              No lessons available for the selected language.
            </Text>
          </Box>
        }
      />
    </Box>
  );
}