import React from "react";
import { Animated, ScrollView } from "react-native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Spinner,
  Image,
  Icon,
  Pressable,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { fetchFeed } from "@/services/userService";

export default function FetchFeedHook({ currentUsername }) {
  const [feedData, setFeedData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadFeed = async () => {
      try {
        const data = await fetchFeed();

        const uniqueFeed = [];
        const seenIds = new Set();

        data.forEach((item) => {
          if (!seenIds.has(item.id) && item.user.username !== currentUsername) {
            seenIds.add(item.id);
            uniqueFeed.push(item);
          }
        });

        setFeedData(uniqueFeed);
        console.log("Filtered feed data loaded:", uniqueFeed);
      } catch (error) {
        console.error("Error loading feed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, [currentUsername]); 

  if (loading) {
    return (
      <Box w="100%" justifyContent="center" alignItems="center" mt={4}>
        <Spinner size="lg" color="$primary500" />
      </Box>
    );
  }

  if (!feedData.length) {
    return (
      <Box
        w="100%"
        bg="$backgroundLight300"
        p={4}
        borderRadius={30}
        shadow="4"
        alignItems="center"
      >
        <Text color="$muted400" fontSize={20}>
          No recent activity to display.
        </Text>
      </Box>
    );
  }

  return (
    <>
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
        bounces={true} 
        showsVerticalScrollIndicator={true} 
        alwaysBounceVertical={true} 
      >
        {feedData.map((item) => (
          <StyledFeedCard key={item.id} data={item} />
        ))}
      </ScrollView>
    </>
  );
}

const AnimatedSeparator = () => {
  const animation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [animation]);

  const width = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Box alignItems="center" mt={0}>
      <Animated.View
        style={{
          height: 3,
          width,
          backgroundColor: "#f43f5e",
        }}
      />
    </Box>
  );
};

const StyledFeedCard = ({ data }) => {
  const [liked, setLiked] = React.useState(false);
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handleLikePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setLiked(!liked);
  };

  return (
    <Box w="95%" p={8} borderRadius={20} bg="$darkBlue700" shadow="8" mb={4}>
      <VStack space={4}>
        <HStack justifyContent="space-between" alignItems="center">
          <HStack alignItems="center" space={4}>
            {data.user.profileImage ? (
              <Image
                source={{ uri: data.user.profileImage }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                }}
                alt="Profile"
              />
            ) : (
              <Box
                size={13}
                borderRadius={50}
                bg="$rose400"
                justifyContent="center"
                alignItems="center"
              >
                <Icon
                  as={Ionicons}
                  name="person-circle-outline"
                  size={10}
                  color="$rose600"
                />
              </Box>
            )}
          </HStack>
          <VStack alignItems="center" flex={1}>
            <Text fontWeight="bold" fontSize={22} color="$rose400">
              {data.user.username}
            </Text>
          </VStack>
          <Text fontSize={14} color="$rose300" mr={10}>
            {data.timestamp}
          </Text>
        </HStack>

        <Text fontSize={22} fontWeight="medium" color="$rose200" m={15}>
          {data.message || "No message available"}
        </Text>

        <Box alignItems="flex-end" mt={2}>
          <Pressable onPress={handleLikePress}>
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <Icon
                as={Ionicons}
                name={liked ? "heart" : "heart-outline"}
                size={30}
                color={liked ? "$rose500" : "$rose400"}
              />
            </Animated.View>
          </Pressable>
        </Box>
      </VStack>
    </Box>
  );
};
