import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import tw from 'twrnc';

export default function LessonCard({ lesson, onPress }) {
  return (
    <TouchableOpacity
      onPress={() => onPress(lesson)}
      style={tw`bg-white shadow-lg rounded-lg p-4 mb-4`}
    >
      <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>{lesson.title}</Text>
      <Text style={tw`text-sm text-gray-600 mb-4`}>{lesson.description}</Text>
      <View style={tw`bg-blue-100 px-3 py-1 rounded-full self-start`}>
        <Text style={tw`text-xs text-blue-700 font-semibold`}>Start Lesson</Text>
      </View>
    </TouchableOpacity>
  );
}