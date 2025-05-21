/* eslint-disable import/no-named-as-default */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { View, Text, FlatList, ScrollView, Pressable } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ThemedText } from "@/componets/ThemedText";
import {
  useShoppingListProductIds,
  useShoppingListValue,
} from "@/stores/ShoppingListStore";
import Button from "@/componets/ui/button";
import Animated from "react-native-reanimated";
import { IconSymbol } from "@/componets/ui/IconSymbol";
import ShoppingListProductItem from "@/componets/ShoppingListProductItem";

const ListScreen = () => {
  const router = useRouter();
  const { listId } = useLocalSearchParams() as { listId: string };

  const [name] = useShoppingListValue(listId, "name");
  const [emoji] = useShoppingListValue(listId, "emoji");
  const [color] = useShoppingListValue(listId, "color");
  const [description] = useShoppingListValue(listId, "description");

  const newProductHref = {
    pathname: "/lists/[listId]/product/new",
    params: { listId },
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: emoji + " " + name,
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/lists/[listId]/share",
                    params: { listId },
                  });
                }}
                style={{ padding: 8 }}
              >
                <IconSymbol name="square.and.arrow.up" color={"#007AFF"} />
              </Pressable>
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/lists/[listId]/edit",
                    params: { listId },
                  });
                }}
                style={{ padding: 8 }}
              >
                <IconSymbol
                  name="pencil.and.list.clipboard"
                  color={"#007AFF"}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/lists/[listId]/product/new",
                    params: { listId },
                  });
                }}
                style={{ paddingLeft: 8 }}
              >
                <IconSymbol name="plus" color={"#007AFF"} />
              </Pressable>
            </View>
          ),
        }}
      />
      <Animated.FlatList
        data={useShoppingListProductIds(listId)}
        renderItem={({ item: productId }) => (
          <ShoppingListProductItem listId={listId} productId={productId} />
        )}
        contentContainerStyle={{
          paddingTop: 12,
        }}
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={() =>
          description ? (
            <ThemedText
              style={{ paddingHorizontal: 16, fontSize: 14, color: "gray" }}
            >
              {description}
            </ThemedText>
          ) : null
        }
        ListEmptyComponent={() => (
          <ScrollView
            contentContainerStyle={{
              alignItems: "center",
              gap: 8,
              paddingTop: 100,
            }}
          >
            <Button
              onPress={() => {
                router.push({
                  pathname: "/lists/[listId]/product/new",
                  params: { listId },
                });
              }}
              variant="ghost"
            >
              Add the first product to this list
            </Button>
          </ScrollView>
        )}
      />
    </>
  );
};

export default ListScreen;
