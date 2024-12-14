import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import tw from 'twrnc';

export default function QuickActions({ actions }) {
  return (
    <View>
      {actions.map((action, idx) => (
        <TouchableOpacity
          key={idx}
          style={tw`bg-blue-500 p-4 rounded mb-2`}
          onPress={action.onPress}
        >
          <Text style={tw`text-white text-center`}>{action.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}