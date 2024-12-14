import React, { useState, useEffect, useRef, useContext } from "react";
import { Dimensions, Pressable, FlatList } from "react-native";
import {
  Box,
  VStack,
  Text,
  HStack,
  useTheme,
  Spinner,
  Button,
  AlertDialog,
} from "@gluestack-ui/themed";
import { ProgressChart } from "react-native-chart-kit";
import { fetchLessonsByLanguage } from "@/services/lessonService";
import { getUserProgress, updateLanguage } from "@/services/userService";
import LanguageSelectorModal from "@/components/Home/LanguageSelector";
import { AuthContext } from "@/contexts/AuthContext";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");

export default function ProgressDashboard({ progress }) {
  const [lessonsForLanguage, setLessonsForLanguage] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, updateUser, logout } = useContext(AuthContext);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [updatedProgress, setUpdatedProgress] = useState(progress);
  const [alertDialogVisible, setAlertDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [streakAnimationVisible, setStreakAnimationVisible] = useState(false);
  const [streakEnded, setStreakEnded] = useState(false);

  const theme = useTheme();
  const previousStreak = useRef(progress.streak || 0);

  const getFlagEmoji = (languageName) => {
    const languageToFlag = {
      Spanish: "🇪🇸",
      English: "🇬🇧",
      French: "🇫🇷",
    };
    return languageToFlag[languageName] || "🌍";
  };

  useEffect(() => {
    console.log("Triggering useEffect for streak...");

    const handleStreakChange = () => {
        let previousStreakValue = previousStreak.current;
        const newStreak = progress.streak || 0;

        previousStreakValue = newStreak - 1;

        console.log("Previous streak in dashboard (faked):", previousStreakValue);
        console.log("New streak in dashboard:", newStreak);

        if (newStreak > previousStreakValue) {
            console.log("Streak increased in dashboard (faked)!");
            setStreakAnimationVisible(true);
            setTimeout(() => {
                setStreakAnimationVisible(false);
            }, 3000);
        } else if (newStreak < previousStreakValue) {
            console.log("Streak ended in dashboard (faked)!");
            setStreakEnded(true);
            setTimeout(() => {
                setStreakEnded(false);
            }, 3000);
        }

        previousStreak.current = newStreak;
    };

    handleStreakChange();
}, [progress.streak]);

  const handleLanguageChange = async (languageId) => {
    try {
      console.log("Changing language to ID:", languageId);
      const updatedData = await updateLanguage(languageId);

      const newProgress = {
        ...updatedProgress,
        currentLanguageId: languageId,
        currentLanguageName: updatedData.currentLanguage,
      };

      console.log("Updated language progress:", newProgress);

      setUpdatedProgress(newProgress); 
      updateUser(newProgress);
      setIsLanguageSelectorOpen(false);
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        console.log("Fetching lessons for language ID:", updatedProgress.currentLanguageId);
        const lessons = await fetchLessonsByLanguage(updatedProgress.currentLanguageId);
        console.log("Fetched lessons:", lessons);
        setLessonsForLanguage(lessons);
      } catch (error) {
        console.error("Error fetching lessons for current language:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [updatedProgress.currentLanguageId]);

  
  const totalLessons = lessonsForLanguage.length;
  const completedLessons = updatedProgress.progress?.filter((p) =>
    lessonsForLanguage.some((l) => l._id === p.lesson._id && p.completed)
  ).length || 0;

  const completionPercentage = totalLessons > 0 ? completedLessons / totalLessons : 0;

  const chartData = {
    labels: ["Progress"],
  };

  const flagEmoji = getFlagEmoji(updatedProgress.currentLanguageName);

  const openDialog = (message) => {
    setDialogMessage(message);
    setAlertDialogVisible(true);
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner color="$primary500" size={24} />
        <Text fontSize={10} fontWeight="medium">
          Loading Progress...
        </Text>
      </Box>
    );
  }

  return (
    <FlatList
      data={[]}
      ListHeaderComponent={
        <Box
          w="100%"
          borderRadius={30}
          borderWidth={2}
          borderColor="$rose500"
          px={4}
          py={8}
          alignItems="center"
        >
          <HStack space={8} justifyContent="center" mb={8} mt={7}>
            {/* Current Language Flag */}
            <Box
              as={Pressable}
              width={80}
              height={80}
              borderRadius={30}
              borderWidth={2}
              borderColor="$rose500"
              justifyContent="center"
              alignItems="center"
              mb={4}
              mr={40}
              onPress={() => setIsLanguageSelectorOpen(true)}
            >
              <Text fontSize={48} fontWeight="bold">
                {flagEmoji}
              </Text>
            </Box>

            {/* Streak Symbol */}
            <Box
              width={80}
              height={80}
              borderRadius={30}
              borderWidth={2}
              borderColor="$rose500"
              justifyContent="center"
              alignItems="center"
              mb={4}
              mr={40}
            >
              {/* Show Animation or Streak Count */}
              {streakAnimationVisible ? (
                <LottieView
                  source={require("../../assets/animations/thumbs-ip.json")} 
                  autoPlay
                  loop={false}
                  style={{ width: 60, height: 60 }}
                />
              ) : (
                <Text fontSize={30} fontWeight="bold" color="$warning600">
                  🔥 {progress.streak || 0}
                </Text>
              )}

              {/* Show Alert if Streak Ended */}
              {streakEnded && (
                <Text fontSize={20} fontWeight="bold" color="$error500" mt={4}>
                  Oh no! Your streak has ended.
                </Text>
              )}
            </Box>

            {/* Badges Symbol */}
            <Box
              as={Pressable}
              width={80}
              height={80}
              borderRadius={30}
              borderWidth={2}
              borderColor="$rose500"
              justifyContent="center"
              alignItems="center"
              mb={4}
              onPress={() =>
                openDialog(`${updatedProgress.badges?.length || 0} Badges`)
              }
            >
              <Text fontSize={30} fontWeight="bold" color="$success600">
                🏆 0
              </Text>
            </Box>
          </HStack>

          {/* Progress Ring */}
          <Box mb={8} alignItems="center">
          <ProgressChart
        data={chartData}
        width={width * 0.9}
        height={200}
        strokeWidth={16} 
        radius={50} 
        chartConfig={{
          backgroundGradientFrom: "#002851",
          backgroundGradientTo: "#002851",
          color: (opacity = 1) => `rgba(244, 63, 94, ${opacity})`, 
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, 
        }}
        hideLegend={true} 
      />
            <Box mt={4} alignItems="center">
              <Text fontSize={25} fontWeight="bold" color="$rose500">
                {Math.round(completionPercentage * 100)}%
              </Text>
              <Text fontSize={20} color="$rose500">
                Lessons Completed
              </Text>
            </Box>
          </Box>

          {/* Language Selector Modal */}
          <LanguageSelectorModal
            isVisible={isLanguageSelectorOpen}
            onClose={() => setIsLanguageSelectorOpen(false)}
            selected={updatedProgress.currentLanguageId}
            onSelect={(languageId) => handleLanguageChange(languageId)}
          />

          {/* Alert Dialog for Streak and Badges */}
          <AlertDialog
            isOpen={alertDialogVisible}
            onClose={() => setAlertDialogVisible(false)}
          >
            <AlertDialog.Content>
              <AlertDialog.Header>Details</AlertDialog.Header>
              <AlertDialog.Body>
                <Text>{dialogMessage}</Text>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button onPress={() => setAlertDialogVisible(false)}>
                  Close
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog>
        </Box>
      }
    />
  );
}
