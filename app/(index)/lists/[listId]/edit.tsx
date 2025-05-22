/* eslint-disable import/no-named-as-default */
/* eslint-disable react-hooks/exhaustive-deps */
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { useListCreation } from "@/context/ListCreationContext";
import { useShoppingListValue } from "@/stores/ShoppingListStore";
import { StatusBar } from "expo-status-bar";

export default function EditScreen() {
  const router = useRouter();
  const { listId } = useLocalSearchParams() as { listId: string };

  // List values
  const [name, setName] = useShoppingListValue(listId, "name");
  const [description, setDescription] = useShoppingListValue(
    listId,
    "description"
  );
  const [emoji, setEmoji] = useShoppingListValue(listId, "emoji");
  const [color, setColor] = useShoppingListValue(listId, "color");

  // List creation context
  const { selectedEmoji, selectedColor, setSelectedColor, setSelectedEmoji } =
    useListCreation();

  // Initialize context with current values
  useEffect(() => {
    setSelectedEmoji(emoji);
    setSelectedColor(color);
    return () => {
      setSelectedEmoji("");
      setSelectedColor("");
    };
  }, [listId]);

  // Update list when context changes
  useEffect(() => {
    if (selectedEmoji && selectedEmoji !== emoji) setEmoji(selectedEmoji);
    if (selectedColor && selectedColor !== color) setColor(selectedColor);
  }, [selectedEmoji, selectedColor]);

  const handleEmojiPress = () => {
    router.push("/emoji-picker");
  };

  const handleColorPress = () => {
    router.push("/color-picker");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Button variant="ghost" onPress={router.back}>
              Cancel
            </Button>
          ),
        }}
      />
      <StatusBar style="light" animated />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.inputContainer}>
          <TextInput
            label="Name"
            placeholder="Potatoes"
            value={name}
            onChangeText={setName}
            returnKeyType="done"
            containerStyle={styles.titleInputContainer}
          />
          <Pressable
            onPress={handleEmojiPress}
            style={[styles.emojiButton, { borderColor: color }]}
          >
            <View style={styles.emojiContainer}>
              <Text>{emoji}</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={handleColorPress}
            style={[styles.colorButton, { borderColor: color }]}
          >
            <View style={styles.colorContainer}>
              <View style={[styles.colorPreview, { backgroundColor: color }]} />
            </View>
          </Pressable>
        </View>
        <TextInput
          label="Description"
          placeholder="Potatoes are good"
          textAlignVertical="top"
          value={description}
          multiline
          numberOfLines={4}
          onChangeText={setDescription}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleInputContainer: {
    flexGrow: 1,
    flexShrink: 1,
  },
  emojiButton: {
    padding: 1,
    borderWidth: 3,
    borderRadius: 100,
    marginTop: 16,
  },
  emojiContainer: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  colorButton: {
    marginTop: 16,
    padding: 1,
    borderWidth: 3,
    borderRadius: 100,
  },
  colorContainer: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 100,
  },
});
