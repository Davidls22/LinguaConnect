import React, { useState, useContext, useCallback, useRef } from "react";
import { Animated, Dimensions, TouchableWithoutFeedback, ScrollView  } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getUserProgress } from "@/services/userService";
import { AuthContext } from "@/contexts/AuthContext";
import {
  Box,
  VStack,
  Text,
  Spinner,
  Icon,
  Divider,
  Pressable,
} from "@gluestack-ui/themed"; 
import { Ionicons } from "@expo/vector-icons"; 
import ProgressCard from "@/components/Home/ProgressCard";
import ImagePickerComponent from "@/components/Home/ImagePickerComponent";
import FetchFeedHook from "@/hooks/fetchFeedHook";

const { height } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);
  const [progress, setProgress] = useState(null);
  const [isFeedVisible, setIsFeedVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current; 

  const fetchProgress = async () => {
    try {
      if (user?.token) {
        console.log("Fetching progress...");
        const data = await getUserProgress();
        setProgress(data);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProgress();
    }, [user])
  );

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const openFeed = () => {
    setIsFeedVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0, 
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeFeed = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsFeedVisible(false)); 
  };

  if (!progress) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner color="$primary500" size={24} />
        <Text fontSize={18} mt={4}>
          Loading...
        </Text>
      </Box>
    );
  }

  return (
    <Box flex={1} p={4} pt={10} bg="$darkBlue800">
      {/* Profile Image in Top Right */}
      <Box position="absolute" top={60} right={20}>
        <ImagePickerComponent currentImage={progress?.profileImage} user={user}/>
      </Box>

      <VStack space={6} alignItems="center" mt={50}>
        {/* Header */}
        <Text
          fontSize={38}
          fontWeight="bold"
          textAlign="center"
          mb={80}
          mr={30}
          color="$rose400"
        >
          <Text fontSize={38} fontWeight="bold" color="$rose400">
            Lingua
          </Text>
          <Text fontSize={40} fontWeight="extrabold" color="$rose200">
            Connect
          </Text>
        </Text>

        {/* Progress Card */}
        <Box w="100%" alignItems="center">
          <ProgressCard progress={progress} />
        </Box> 

        {/* Divider and Feed Button */}
        <Box w="100%" alignItems="center">
          <Divider
            thickness="2"
            bg="$rose500"
            style={{ width: "90%", marginVertical: 10, marginTop: 40 }}
          />
          <Pressable onPress={openFeed} testID="feedButton">
            <Box
              width={60}
              height={60}
              bg="$rose500"
              borderRadius={30}
              justifyContent="center"
              alignItems="center"
              shadow="8"
            >
              <Icon as={Ionicons} name="people" size={30} color="$white" />
            </Box>
          </Pressable>
        </Box>
      </VStack>

      {/* Sliding Feed */}
      {isFeedVisible && (
        <TouchableWithoutFeedback onPress={closeFeed} testID="closeButton">
          <Animated.View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: height,
              backgroundColor: "#002851",
              transform: [{ translateY: slideAnim }],
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Box p={4}>
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                mt={80}
                bg="$darkBlue800"
                px={4} 
                testID="friendFeedContainer"
              >
                {/* Friend Feed Title */}
                <Text
                  fontSize={32}
                  fontWeight="bold"
                  color="$rose500"
                  mb={30}
                  ml={120}
                >
                  Friend Feed
                </Text>

                {/* Placeholder X */}
                <Icon
                  as={Ionicons}
                  name="close-circle-outline"
                  size={30}
                  color="$rose500"
                  mb={30}
                  mr={20}
                />
              </Box>
          <FetchFeedHook currentUsername={user.username} />
            </Box>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
    </Box>
  );
}
