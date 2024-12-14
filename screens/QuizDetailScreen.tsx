
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import QuizCard from '../components/Quiz/QuizCard';
import { fetchQuizzes } from '../services/quizService';

export default function QuizzesListScreen() {
  const [quizzes, setQuizzes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getQuizzes = async () => {
      try {
        const data = await fetchQuizzes();
        setQuizzes(data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };
    getQuizzes();
  }, []);

  const handlePress = (quiz) => {
    router.push(`/quizzes/${quiz._id}`);
  };

  return (
    <View style={tw`flex-1 p-4`}>
      <FlatList
        data={quizzes}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <QuizCard quiz={item} onPress={() => handlePress(item)} />
        )}
      />
    </View>
  );
}

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useLocalSearchParams } from 'expo-router';
import { getQuizById } from '../services/quizService';
import { updateUserPoints } from '../services/userService';

export default function QuizDetailScreen() {
  const { id } = useLocalSearchParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuizById(id);
        setQuiz(data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };
    if (id) {
      fetchQuiz();
    }
  }, [id]);

  if (!quiz) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading quiz...</Text>
      </View>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleOptionPress = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = async () => {
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    setSelectedOption(null);

    if (currentQuestionIndex + 1 < quiz.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowScore(true);
      try {
        await updateUserPoints(score);
      } catch (error) {
        console.error('Error updating points:', error);
      }
    }
  };

  if (showScore) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-2xl`}>
          Your Score: {score}/{quiz.questions.length}
        </Text>
        {/* Optionally, add a button to retake the quiz or go back */}
      </View>
    );
  }

  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-xl font-bold mb-4`}>{currentQuestion.questionText}</Text>
      {currentQuestion.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleOptionPress(option)}
          style={[
            tw`p-4 mb-2 rounded`,
            selectedOption === option ? tw`bg-blue-200` : tw`bg-gray-200`,
          ]}
        >
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={handleNextQuestion}
        style={tw`bg-blue-500 p-4 rounded mt-4`}
      >
        <Text style={tw`text-white text-center`}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}