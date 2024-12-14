import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import Button from '../components/UI/Button';
import useAuth from '../hooks/useAuth';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Text style={tw`text-2xl mb-4`}>Profile</Text>
      <Text style={tw`text-base mb-4`}>Email: {user?.email}</Text>
      <Button title="Logout" onPress={logout} style={tw`w-1/2`} />
    </View>
  );
}