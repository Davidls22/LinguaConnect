import React from 'react';
import { TextInput } from 'react-native';
import tw from 'twrnc';

export default function Input({ placeholder, style, ...props }) {
  return (
    <TextInput
      placeholder={placeholder}
      style={[tw`border border-gray-300 rounded p-2 mb-4`, style]}
      {...props}
    />
  );
}