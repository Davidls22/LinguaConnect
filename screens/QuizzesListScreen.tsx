import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import QuizCard from '../components/Lesson/QuizCard';
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


