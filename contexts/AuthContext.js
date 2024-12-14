import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginService, register as registerService } from '../services/authService';
import { getUserProgress } from '@/services/userService';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
  
        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log('User data loaded from storage:', parsedUser);
  
          const progressData = await getUserProgress(parsedUser.userId);
  
          const updatedUser = {
            ...parsedUser,
            ...progressData,
          };
  
          console.log('Updated user data with progress:', updatedUser);
  
          setUser(updatedUser);
  
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        } else {
          console.log('No user data found in storage.');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
  
    loadUser();
  }, []);

  const updateUser = (updatedFields) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, ...updatedFields };
      AsyncStorage.setItem('user', JSON.stringify(updatedUser)); 
      return updatedUser;
    });
  };

  const login = async (credentials) => {
    try {
        const userData = await loginService(credentials);

        if (userData.token) {
            await AsyncStorage.setItem('user', JSON.stringify(userData));
        }

        console.log("LoginService response:", userData);

        const previousStreak = userData.streak || 0; 

        console.log("Previous streak (from login):", previousStreak);

        const progress = await getUserProgress(userData.userId);
        console.log("Fetched progress:", progress);

        const newStreak = progress.streak || 0; 

        console.log("New streak (from progress):", newStreak);

        if (newStreak > previousStreak) {
            console.log("Streak increased!");
            triggerStreakAnimation();
        } else if (newStreak < previousStreak) {
            console.log("Streak ended!");
            triggerStreakEndAlert(); 
        }

        const completeUserData = { ...userData, ...progress };
        console.log("Final combined user data:", completeUserData);

        setUser(completeUserData);
        await AsyncStorage.setItem("user", JSON.stringify(completeUserData));

        router.replace("/(tabs)/home"); 
    } catch (error) {
        console.error("Login error:", error);
    }
};

  const register = async (credentials) => {
    try {
      console.log('Attempting to register with credentials:', credentials);
      const userData = await registerService(credentials);
      console.log('Registration successful:', userData);
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const logout = async () => {
    console.log('Logging out user:', user);
    setUser(null);
    await AsyncStorage.removeItem('user');
    router.replace('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};