import React, { useState } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import useAuth from "../hooks/useAuth";
import { Link } from "expo-router";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleRegister = () => {
    register({ email, password, username });
  };

  return (
    <View style={tw`flex-1 justify-center px-6`}>
      <Text style={tw`text-2xl font-bold mb-6`}>Register</Text>
      <Input placeholder="Email" onChangeText={setEmail} value={email} testID="registerEmailInput"/>
      <Input
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
        testID="registerUsernameInput"
      />
      <Input
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        testID="registerPasswordInput"
        autoCorrect={false} 
        textContentType="oneTimeCode" 
        importantForAutofill="no" 
      />
      <Button title="Register" onPress={handleRegister} testID="registerButton"/>
      <Link href="/auth/login" style={tw`mt-4 text-blue-500`}>
        Already have an account? Login
      </Link>
    </View>
  );
}
