import React, { useEffect, useState } from "react";
import { FlatList, Dimensions, Pressable } from "react-native";
import LottieView from "lottie-react-native";
import {
  Modal,
  Box,
  Text,
  Button,
  VStack,
  ButtonText,
} from "@gluestack-ui/themed";
import { fetchAllLanguages } from "@/services/languageService";

const { width } = Dimensions.get("window");

export default function LanguageSelectorModal({
  isVisible,
  onClose,
  onSelect,
  selected,
}) {
  const [languages, setLanguages] = useState([]);
  const [playingAnimation, setPlayingAnimation] = useState(null);
  const [currentSelected, setCurrentSelected] = useState(selected);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const data = await fetchAllLanguages();
        setLanguages(data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };
    fetchLanguages();
  }, []);

  const handleSelect = (id) => {
    setPlayingAnimation(id);
    setCurrentSelected(id);
    onSelect(id);
    setTimeout(() => {
      setPlayingAnimation(null);
      onClose();
    }, 1000);
  };

  return (
    <Modal isOpen={isVisible} onClose={onClose}>
      <Modal.Content bg="rgba(0, 0, 0, 0.7)">
        <Modal.Body>
          <Box flex={1}>
            <FlatList
              data={languages}
              keyExtractor={(item) => item._id}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: "space-evenly",
              }}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleSelect(item._id)}>
                  <Box
                    bg={
                      currentSelected === item._id ? "$primary100" : "$backgroundLight100"
                    }
                    width={(width / 2) - 70}
                    height={150}
                    justifyContent="center"
                    alignItems="center"
                    borderRadius={12}
                    shadow={currentSelected === item._id ? "lg" : "sm"}
                    borderWidth={currentSelected === item._id ? 2 : 1}
                    borderColor={
                      currentSelected === item._id ? "$primary600" : "$muted300"
                    }
                    marginBottom={40}
                    marginTop={40}
                  >
                    {playingAnimation === item._id ? (
                      <LottieView
                        source={require("../../assets/animations/seletedAnimation.json")}
                        autoPlay
                        style={{ width: 80, height: 80 }}
                      />
                    ) : (
                      <Text fontSize={40}>{item.flagEmoji}</Text>
                    )}
                    <Text fontSize={20} fontWeight="bold" mt={10}>
                      {item.name}
                    </Text>
                  </Box>
                </Pressable>
              )}
            />
          </Box>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}