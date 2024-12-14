import React, { useEffect, useState, useContext } from "react";
import { Box, VStack, Text, Button, Spinner, Card, useTheme } from "@gluestack-ui/themed";
import { useLocalSearchParams } from "expo-router";
import { getQuizByLessonId } from "../../../../services/quizService";
import { updateLeaderboard } from "../../../../services/leaderboardService";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";

interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface Quiz {
  _id: string;
  title: string;
  description: string | null;
  questions: QuizQuestion[];
}

export default function LessonQuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useContext(AuthContext);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [score, setScore] = useState<number>(0);
  const [quizEnded, setQuizEnded] = useState<boolean>(false);
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    const fetchQuiz = async () => {
      if (id) {
        try {
          const data = await getQuizByLessonId(id);
          setQuiz(data);
          setSelectedAnswers(Array(data.questions.length).fill(null));
        } catch (error) {
          console.error("Error fetching quiz:", error);
        }
      }
    };
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (quizEnded) {
      handleQuizEnd();
    }
  }, [quizEnded]);

  const handleOptionSelect = (option: string) => {
    if (quizEnded) return;

    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[currentQuestionIndex] = option;
    setSelectedAnswers(updatedSelectedAnswers);

    const correctAnswer = quiz?.questions[currentQuestionIndex].correctAnswer || "";
    const isCorrect =
      option.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setTimeout(() => {
      goToNextQuestion();
    }, 1000);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex + 1 < (quiz?.questions.length || 0)) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizEnded(true);
    }
  };

  const handleQuizEnd = async () => {
    try {
      await updateLeaderboard(user.userId, user.username, score);
      router.push(`/lessons/${id}`);
    } catch (error) {
      console.error("Error updating leaderboard:", error);
    }
  };

  if (!quiz) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner color={theme?.colors?.primary500 || "blue"} size="large" />
        <Text fontSize="lg" mt={4}>
          Loading quiz...
        </Text>
      </Box>
    );
  }

  if (quizEnded) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" px={4}>
        <Card p={4} w="80%" shadow="lg">
          <Text fontSize="xl" fontWeight="bold" textAlign="center" mb={4}>
            Quiz Ended
          </Text>
          <Text fontSize="md" textAlign="center" mb={4}>
            Your Score: {score} / {quiz.questions.length}
          </Text>
          <Button onPress={handleQuizEnd}>Go Back</Button>
        </Card>
      </Box>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <Box flex={1} p={4}>
      {/* Quiz Title */}
      <Card mb={4} p={4} shadow="lg">
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          {quiz.title}
        </Text>
        {quiz.description && (
          <Text fontSize="md" textAlign="center" mt={2}>
            {quiz.description}
          </Text>
        )}
      </Card>

      {/* Current Question */}
      <Card mb={4} p={4} shadow="lg">
        <Text fontSize="md" mb={2}>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </Text>
        <Text fontSize="lg">{currentQuestion.questionText}</Text>
      </Card>

      {/* Options */}
      <VStack space={4}>
        {currentQuestion.options.map((option, idx) => (
          <Button
            key={idx}
            onPress={() => handleOptionSelect(option)}
            bg={theme?.colors?.backgroundLight300 || "gray.100"}
          >
            {option}
          </Button>
        ))}
      </VStack>
    </Box>
  );
}