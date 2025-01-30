import React, { useState, useCallback, useEffect, useRef, useContext } from "react";
import { Dimensions, Pressable, FlatList } from "react-native";
import {
  Box,
  HStack,
  Text,
  Spinner,
  Button,
  AlertDialog,
} from "@gluestack-ui/themed";
import { ProgressChart } from "react-native-chart-kit";
import { useFocusEffect } from "@react-navigation/native"; 
import { fetchLessonsByLanguage } from "@/services/lessonService";
import { updateLanguage, getUserProgress } from "@/services/userService"; 
import LanguageSelectorModal from "@/components/Home/LanguageSelector";
import { AuthContext } from "@/contexts/AuthContext";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");

export default function ProgressDashboard({ progress = {} }) {
  const safeProgress = {
    progress: [],
    streak: 0,
    badges: [],
    currentLanguageId: null,
    currentLanguageName: "",
    ...progress,
  };

  const [lessonsForLanguage, setLessonsForLanguage] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, updateUser } = useContext(AuthContext);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [updatedProgress, setUpdatedProgress] = useState(safeProgress);
  const [alertDialogVisible, setAlertDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [streakAnimationVisible, setStreakAnimationVisible] = useState(false);
  const [streakEnded, setStreakEnded] = useState(false);

  const previousStreak = useRef(safeProgress.streak);

  const getFlagEmoji = (languageName) => {
    const languageToFlag = {
      Spanish: "🇪🇸",
      English: "🇬🇧",
      French: "🇫🇷",
    };
    return languageToFlag[languageName] || "🌍";
  };

  useEffect(() => {
    const handleStreakChange = () => {
      let previousStreakValue = previousStreak.current;
      const newStreak = safeProgress.streak || 0;
      previousStreakValue = newStreak - 1;

      if (newStreak > previousStreakValue) {
        setStreakAnimationVisible(true);
        setTimeout(() => setStreakAnimationVisible(false), 3000);
      } else if (newStreak < previousStreakValue) {
        setStreakEnded(true);
        setTimeout(() => setStreakEnded(false), 3000);
      }
      previousStreak.current = newStreak;
    };
    handleStreakChange();
  }, [safeProgress.streak]);

  const handleLanguageChange = async (languageId) => {
    try {
      const updatedData = await updateLanguage(languageId);
      const newProgress = {
        ...updatedProgress,
        currentLanguageId: languageId,
        currentLanguageName: updatedData.currentLanguage,
      };
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
        const lessons = await fetchLessonsByLanguage(updatedProgress.currentLanguageId);
        setLessonsForLanguage(lessons);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [updatedProgress.currentLanguageId]);

  const totalLessons = lessonsForLanguage.length;
  const completedLessons = updatedProgress.progress?.reduce((count, p) => {
    return p.completed && lessonsForLanguage.some(l => l._id === p.lesson?._id) 
      ? count + 1 
      : count;
  }, 0) || 0;

  const completionPercentage = totalLessons > 0 ? completedLessons / totalLessons : 0;
  const chartData = { labels: ["Progress"], data: [completionPercentage || 0] };
  const flagEmoji = getFlagEmoji(updatedProgress.currentLanguageName);

  const openDialog = (message) => {
    setDialogMessage(message);
    setAlertDialogVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchUpdatedProgress = async () => {
        try {
          const data = await getUserProgress();
          setUpdatedProgress(data); 
        } catch (error) {
          console.error(" Error fetching updated progress:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUpdatedProgress();
    }, [user]) 
  );

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner color="$primary500" size={24} />
        <Text fontSize={10} fontWeight="medium">Loading Progress...</Text>
      </Box>
    );
  }

  return (
    <FlatList
      data={[]}
      ListHeaderComponent={
        <Box w="100%" borderRadius={30} borderWidth={2} borderColor="$rose500" px={4} py={8} alignItems="center">
          <HStack space={8} justifyContent="center" mb={8} mt={7}>
            <Box as={Pressable} width={80} height={80} borderRadius={30} borderWidth={2} borderColor="$rose500"
              justifyContent="center" alignItems="center" mb={4} mr={40} onPress={() => setIsLanguageSelectorOpen(true)} testID="languageSelectorButton">
              <Text fontSize={48} fontWeight="bold">{flagEmoji}</Text>
            </Box>
            <Box width={80} height={80} borderRadius={30} borderWidth={2} borderColor="$rose500"
              justifyContent="center" alignItems="center" mb={4} mr={40}>
              {streakAnimationVisible ? (
                <LottieView source={require("../../assets/animations/thumbs-ip.json")}
                  autoPlay loop={false} style={{ width: 60, height: 60 }} />
              ) : (
                <Text fontSize={30} fontWeight="bold" color="$warning600">🔥 {safeProgress.streak || 0}</Text>
              )}
              {streakEnded && <Text fontSize={20} fontWeight="bold" color="$error500" mt={4}>Oh no! Your streak has ended.</Text>}
            </Box>
            <Box as={Pressable} width={80} height={80} borderRadius={30} borderWidth={2} borderColor="$rose500"
              justifyContent="center" alignItems="center" mb={4} onPress={() => openDialog(`${updatedProgress.badges?.length || 0} Badges`)}>
              <Text fontSize={30} fontWeight="bold" color="$success600">🏆 0</Text>
            </Box>
          </HStack>
          <Box mb={8} alignItems="center">
            <ProgressChart data={chartData} width={width * 0.9} height={200} strokeWidth={16} radius={50}
              chartConfig={{
                backgroundGradientFrom: "#002851",
                backgroundGradientTo: "#002851",
                color: (opacity = 1) => `rgba(244, 63, 94, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }} hideLegend={true} />
            <Box mt={4} alignItems="center">
              <Text fontSize={25} fontWeight="bold" color="$rose500">
                {Math.round(completionPercentage * 100)}%
              </Text>
              <Text fontSize={20} color="$rose500">Lessons Completed</Text>
            </Box>
          </Box>
          <LanguageSelectorModal
            isVisible={isLanguageSelectorOpen}
            onClose={() => setIsLanguageSelectorOpen(false)}
            selected={updatedProgress.currentLanguageId}
            onSelect={(languageId) => handleLanguageChange(languageId)}
            testID="languageSelectorModal"
          />
          <AlertDialog isOpen={alertDialogVisible} onClose={() => setAlertDialogVisible(false)}>
            <AlertDialog.Content>
              <AlertDialog.Header>Details</AlertDialog.Header>
              <AlertDialog.Body>
                <Text>{dialogMessage}</Text>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button onPress={() => setAlertDialogVisible(false)}>Close</Button>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog>
        </Box>
      }
    />
  );
}