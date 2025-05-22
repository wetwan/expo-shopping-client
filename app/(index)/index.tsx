/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-named-as-default */
import { IconCircle } from "@/components/iconCircle";
import ShoppingListItem from "@/components/shoppinglistitem";
import Button from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { appleBlue, backgroundColors } from "@/constants/Colors";
import { useShoppingListIds } from "@/stores/ShoppingListsStore";
import { useClerk } from "@clerk/clerk-expo";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";

const HomescreenLayOut = () => {
  const router = useRouter();
  const { signOut } = useClerk();

  const shoppingListIds = useShoppingListIds();

  const renderEmptyList = () => (
    <ScrollView contentContainerStyle={styles.emptyStateContainer}>
      <IconCircle
        emoji="🛒"
        backgroundColor={
          backgroundColors[Math.floor(Math.random() * backgroundColors.length)]
        }
      />
      <Button onPress={() => router.push("/lists/new")} variant="ghost">
        Create your first list
      </Button>
    </ScrollView>
  );

  const renderHeaderRight = () => {
    return (
      <Pressable
        style={{ padding: 2 }}
        onPress={() => router.push("/lists/new")}
      >
        <IconSymbol name="plus" color={appleBlue} />
      </Pressable>
    );
  };
  const renderHeaderleft = () => {
    return (
      <Pressable onPress={() => router.push("/profile")}>
        <IconSymbol name="gear" color={appleBlue} />
      </Pressable>
    );
  };
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: renderHeaderRight,
          headerLeft: renderHeaderleft,
        }}
      />
      <FlatList
        data={shoppingListIds}
        renderItem={({ item: listId }) => <ShoppingListItem listId={listId} />}
        contentContainerStyle={styles.listContainer}
        contentInsetAdjustmentBehavior="automatic"
        keyExtractor={(item) => item}
        ListEmptyComponent={renderEmptyList}
      />
    </>
  );
};

export default HomescreenLayOut;

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 8,
  },
  emptyStateContainer: {
    alignItems: "center",
    gap: 8,
    paddingTop: 100,
  },
  headerButton: {
    padding: 8,
    paddingRight: 0,
    marginHorizontal: Platform.select({ web: 16, default: 0 }),
  },
  headerButtonLeft: {
    paddingLeft: 0,
  },
});
