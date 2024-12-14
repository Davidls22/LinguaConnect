import React, { useState } from 'react';
import { Box, Text, VStack, Input,Pressable,Icon, InputField, Button, useTheme, ButtonText } from '@gluestack-ui/themed';
import { useRouter, Link } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import useAuth from '../hooks/useAuth';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();
  const router = useRouter();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError(''); 
    console.log('Logging in with:', { email, password }); 

    try {
      await login({ email, password });
      router.push('/home'); 
    } catch (err) {
      setError('Invalid credentials. Please try again.'); 
      console.error("Login error:", err); 
    }
  };

  return (
    <Box flex={1} bg="$darkBlue800" px={6} py={20} justifyContent="center" alignItems="center">
      {/* LinguaConnect Header */}
      <VStack space={4} alignItems="center" mb={60}>
        <Text fontSize={40} fontWeight="bold" color="$rose400">Lingua</Text>
        <Text fontSize={40} fontWeight="bold" color="$rose300">Connect</Text>
      </VStack>

      {/* Login Form */}
      <VStack space={6} w="100%" maxWidth={400} alignItems="center">
        {/* Email Input */}
        <Input 
          bg="$darkBlue700" 
          color="$rose400"
          borderColor="$rose500"
          mb={10}
        >
          <InputField 
            placeholder="Email" 
            color="$rose300"
            value={email} 
            onChangeText={setEmail}
          />
        </Input>

        {/* Password Input */}
        <Input
          bg="$darkBlue700" 
          color="$rose400"
          borderColor="$rose500"
          mb={10}
        >
          <InputField
        placeholder="Password"
        color="$rose400"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        style={{ paddingRight: 50 }}
      />

      {/* Eye Icon for Show/Hide Password */}
      <Pressable
        onPress={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: [{ translateY: -10 }],
        }}
      >
        <Icon
          as={Ionicons}
          name={showPassword ? "eye-off-outline" : "eye-outline"}
          size={24}
          color="$rose400"
        />
      </Pressable>
        </Input>

        {/* Error Message */}
        {error && <Text color="$red500" fontSize={14}>{error}</Text>}

        {/* Login Button */}
        <Button 
          onPress={handleLogin} 
          bg="$rose500" 
          color="$textLight0" 
          
        >
          <ButtonText>Login</ButtonText>
        </Button>

        {/* Register Link */}
        <Link 
          href="/auth/register" 
          mt={140} 
          color="$blue500" 
          fontWeight="bold"
        >
          Don't have an account? Register
        </Link>
      </VStack>
    </Box>
  );
}