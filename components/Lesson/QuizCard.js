import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

export default function QuizCard({ quiz, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(quiz)} style={tw`border p-4 mb-4 rounded`}>
      <Text style={tw`text-xl font-bold`}>{quiz.title}</Text>
      <Text style={tw`text-base text-gray-600`}>{quiz.description}</Text>
    </TouchableOpacity>
  );
}