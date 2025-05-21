/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/no-named-as-default */

import Button from "@/componets/ui/button";
import TextInput from "@/componets/ui/text-input";
import { backgroundColors, emojies } from "@/constants/Colors";
import { useListCreation } from "@/context/ListCreationContext";
import { useAddShoppingListCallback } from "@/stores/ShoppingListsStore";
import { Link, Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const CreateScreen = () => {
  const { selectedColor, selectedEmoji, setSelectedColor, setSelectedEmoji } =
    useListCreation();

  const router = useRouter();

  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");
  const useAddshoppingList = useAddShoppingListCallback();

  const handleCreateList = () => {
    if (!listName) {
      return;
    }

    const listId = useAddshoppingList(
      listName,
      listDescription,
      selectedEmoji,
      selectedColor
    );
    router.replace({
      pathname: "/lists/[listId]",
      params: { listId },
    });
  };

  useEffect(() => {
    setSelectedColor(
      backgroundColors[Math.floor(Math.random() * backgroundColors.length)]
    );
    setSelectedEmoji(emojies[Math.floor(Math.random() * emojies.length)]);

    return () => {
      setSelectedColor("");
      setSelectedEmoji("");
    };
  }, [setSelectedColor, setSelectedEmoji]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "New List",
          headerLargeTitle: false,
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Grocery Essentials"
            size="lg"
            variant="ghost"
            returnKeyType="done"
            onSubmitEditing={handleCreateList}
            value={listName}
            onChangeText={setListName}
            autoFocus
            inputStyle={styles.titleInput}
            containerStyle={styles.titleInputContainer}
          />

          <Link
            href={{
              pathname: "/emoji-picker",
            }}
            style={[styles.emojiButton, { borderColor: selectedColor }]}
          >
            <View style={styles.emojiContainer}>
              <Text>{selectedEmoji}</Text>
            </View>
          </Link>

          <Link
            href={{
              pathname: "/color-picker",
            }}
            style={[styles.emojiButton, { borderColor: selectedColor }]}
          >
            <View style={styles.colorContainer}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 100,
                  backgroundColor: selectedColor,
                }}
              />
            </View>
          </Link>
        </View>
        <TextInput
          placeholder=" Description (optional)"
          value={listDescription}
          onChangeText={setListDescription}
          onSubmitEditing={handleCreateList}
          variant="ghost"
          inputStyle={styles.descriptionInput}
          returnKeyType="done"
        />
        <Button onPress={handleCreateList} variant="ghost" disabled={!listName}>
          Create List
        </Button>
      </ScrollView>
    </>
  );
};

export default CreateScreen;

const styles = StyleSheet.create({
  scrollViewContent: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleInput: {
    fontWeight: "600",
    fontSize: 28,
    padding: 0,
  },
  titleInputContainer: {
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: "auto",
    marginBottom: 0,
  },
  emojiButton: {
    padding: 1,
    borderWidth: 3,
    borderRadius: 100,
  },
  emojiContainer: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  descriptionInput: {
    padding: 0,
  },

  colorButton: {
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
});
