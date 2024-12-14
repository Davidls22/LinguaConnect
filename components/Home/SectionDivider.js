import React from "react";
import { Animated } from "react-native";
import { Box, VStack, HStack, Text, Divider } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";

export default function SectionDivider() {
  return (
    <Box alignItems="center" justifyContent="center" mt={8} mb={8}>
      {/* Gradient Divider */}
      <LinearGradient
        colors={["#f43f5e", "#8b5cf6"]} 
        style={{
          height: 4,
          width: "80%",
          borderRadius: 2,
        }}
      />
      {/* Subtle Section Title */}
      <Text
        mt={2}
        fontSize={22}
        fontWeight="extrabold"
        textTransform="uppercase"
        color="$violet400"
        letterSpacing={1.5}
        textAlign="center"
      >
        Recent Activity
      </Text>
    </Box>
  );
}