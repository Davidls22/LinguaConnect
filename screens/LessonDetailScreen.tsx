import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Text,
  VStack,
  Button,
  Spinner,
  Card,
  useTheme,
} from "@gluestack-ui/themed";
import { ScrollView } from "react-native";
import { getLessonById } from "../services/lessonService";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams();
  const [lesson, setLesson] = useState(null);
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const theme = useTheme();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await getLessonById(id);
        setLesson(data);
      } catch (error) {
        console.error("Error fetching lesson:", error);
      }
    };
    if (id) {
      fetchLesson();
    }
  }, [id]);

  const handleCompleteLesson = async () => {
    try {
      console.log("Marking lesson as completed...");
      const response = await fetch(
        `http://localhost:5001/api/users/${user.userId}/progress`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            lessonId: lesson._id,
            completed: true,
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update lesson progress: ${errorMessage}`);
      }

      console.log("Lesson marked as completed");
      router.push("/lessons");
    } catch (error) {
      console.error("Error updating lesson progress:", error.message);
    }
  };

  const handleStartQuiz = () => {
    router.push(`/lessons/${lesson._id}/quiz`);
  };

  if (!lesson) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="$darkBlue800">
        <Spinner color="$rose400" size="large" />
        <Text mt={4} fontSize={18} fontWeight="medium" color="$rose300">
          Loading lesson...
        </Text>
      </Box>
    );
  }

  return (
    <Box flex={1} p={4} bg="$darkBlue800">
      {/* Lesson Details Card */}
      <ScrollView>
        <Card
          mb={8}
          p={6}
          bg="$darkBlue700"
          borderColor="$rose500"
          borderWidth={1}
          borderRadius="$lg"
          shadow="lg"
          mt={90}
        >
          <Text fontSize={24} fontWeight="bold" color="$rose400" mb={4} p={5}>
            {lesson.title}
          </Text>
          <Text fontSize={16} color="$rose300" lineHeight={24} p={5}>
            {lesson.content}
          </Text>
        </Card>
      </ScrollView>

      {/* Actions */}
      <VStack space={4}>
        <Button
          onPress={handleCompleteLesson}
          bg="$rose500"
          borderRadius="$md"
          size="lg"
          m={10}
        >
          <Text color="$textLight0" fontWeight="bold">Mark Complete</Text>
        </Button>

        <Button
          onPress={handleStartQuiz}
          bg="$darkBlue700"
          borderWidth={1}
          borderColor="$rose500"
          borderRadius="$md"
          size="lg"
          m={10}
          mb={110}
        >
          <Text color="$rose500" fontWeight="bold">Start Quiz</Text>
        </Button>
      </VStack>
    </Box>
  );
}