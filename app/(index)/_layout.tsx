/* eslint-disable import/no-named-as-default */
import Button from "@/componets/ui/button";
import { ListCreationProvider } from "@/context/ListCreationContext";
import ShoppingListsStore from "@/stores/ShoppingListsStore";
import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack, useRouter } from "expo-router";
import { Provider as TinyBaseProvider } from "tinybase/ui-react";

export default function HomeRootLayOut() {
  const router = useRouter();
  const { user } = useUser();

  if (!user) {
    return <Redirect href={"/(auth)"} />;
  }
  return (
    <TinyBaseProvider>
      <ShoppingListsStore />
      <ListCreationProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerTitle: "Shopping Lists" }}
          />
          <Stack.Screen
            name="lists/new/index"
            options={{
              presentation: "formSheet",
              sheetGrabberVisible: true,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="profile"
            options={{
              presentation: "formSheet",
              sheetAllowedDetents: [0.75, 1],
              sheetGrabberVisible: true,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="lists/new/scan"
            options={{
              presentation: "fullScreenModal",
              headerLargeTitle: false,
              headerTitle: "Scan QR Code",
              sheetAllowedDetents: [0.75, 1],
              sheetGrabberVisible: true,
              headerLeft: () => (
                <Button variant="ghost" onPress={() => router.back()}>
                  Cancel
                </Button>
              ),
            }}
          />
          <Stack.Screen
            name="emoji-picker"
            options={{
              presentation: "formSheet",
              headerLargeTitle: false,
              headerTitle: "Choose an Emoji",
              sheetAllowedDetents: [0.5, 0.75, 1],
              sheetGrabberVisible: true,
            }}
          />
          <Stack.Screen
            name="color-picker"
            options={{
              presentation: "formSheet",
              headerLargeTitle: false,
              headerTitle: "Choose an color",
              sheetAllowedDetents: [0.5, 0.75, 1],
              sheetGrabberVisible: true,
            }}
          />
          <Stack.Screen
            name="lists/[listId]/product/new"
            options={{
              presentation: "formSheet",
              headerLargeTitle: false,
              headerTitle: "Add a product",
              sheetAllowedDetents: [0.4, 0.55, 0.85],
              sheetGrabberVisible: true,
            }}
          />
          <Stack.Screen
            name="lists/[listId]/edit"
            options={{
              presentation: "formSheet",
              headerLargeTitle: false,
              headerTitle: "Edit",
              sheetAllowedDetents: [0.4, 0.55, 0.85],
              sheetGrabberVisible: true,
            }}
          />
          <Stack.Screen
            name="lists/[listId]/share"
            options={{
              presentation: "formSheet",
              headerLargeTitle: false,
              headerTitle: "Share",
              sheetGrabberVisible: true,
            }}
          />
          <Stack.Screen
            name="lists/[listId]/product/[productId]"
            options={{
              presentation: "formSheet",
              headerLargeTitle: false,
              headerTitle: "Share",
              sheetAllowedDetents: [0.5, 0.75, 1],
              sheetGrabberVisible: true,
            }}
          />
        </Stack>
      </ListCreationProvider>
    </TinyBaseProvider>
  );
}
