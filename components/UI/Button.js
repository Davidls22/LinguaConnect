import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import tw from 'twrnc';

export default function Button({ title, onPress, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[tw`bg-blue-600 rounded-full py-3 px-6 shadow-lg`, style]}
    >
      <Text style={tw`text-white text-center font-semibold text-lg`}>{title}</Text>
    </TouchableOpacity>
  );
}