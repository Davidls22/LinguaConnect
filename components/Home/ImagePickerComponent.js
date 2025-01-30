import React, { useState, useContext } from "react";
import { Image, Alert, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Box, VStack, Icon } from "@gluestack-ui/themed";
import { AuthContext } from "@/contexts/AuthContext";
import { updateUserProfileImage } from "@/services/userService";

export default function ImagePickerComponent({ currentImage, user }) {
  const [imageUri, setImageUri] = useState(currentImage || null);
  const { updateUser } = useContext(AuthContext);

  const handleImagePicker = async () => {
    console.log("Opening image picker...");

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "You need to grant permission to access your photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      console.log("User cancelled image picker");
    } else if (result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      console.log("Selected image URI:", selectedImage);
      setImageUri(selectedImage);

      try {
        console.log("Uploading image...");
        const response = await updateUserProfileImage(selectedImage, user.token);
        console.log("Image uploaded successfully:", response);
        updateUser({ profileImage: response.imageUrl });
        Alert.alert("Success", "Profile image updated successfully!");
      } catch (error) {
        console.error("Error uploading image:", error);
        Alert.alert("Error", "Failed to update profile image.");
      }
    } else {
      console.log("No assets found in picker result");
    }
  };

  return (
    <VStack alignItems="center" space={4}>
      <Pressable onPress={handleImagePicker} testID="profileImage">
        <Box
          width={60}
          height={60}
          borderRadius={20}
          overflow="hidden"
          bg="$backgroundLight300"
          borderWidth={2}
        borderColor="$rose500"
          alignItems="center"
          justifyContent="center"
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={{ width: 80, height: 80 }} />
          ) : (
            <Icon as={Ionicons} name="person-circle-outline" size={50} color="$muted600" />
          )}
        </Box>
      </Pressable>
    </VStack>
  );
}