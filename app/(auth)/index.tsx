/* eslint-disable import/no-named-as-default */
import { ThemedText } from "@/componets/ThemedText";
import Button from "@/componets/ui/button";
import TextInput from "@/componets/ui/text-input";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { ClerkAPIError } from "@clerk/types";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [errors, setErrors] = useState<ClerkAPIError[]>([]);

  const onSignIn = useCallback(async () => {
    if (!isLoaded) return;
    setIsSigningIn(true);
    setErrors([]);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(index)");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (error) {
      if (isClerkAPIResponseError(error)) setErrors(error.errors);
      console.error(JSON.stringify(error, null, 2));
    } finally {
      setIsSigningIn(false);
    }
  }, [emailAddress, password, isLoaded, signIn, setActive, router]);
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <TextInput
        label="Email"
        placeholder="Enter your email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={emailAddress}
        onChangeText={setEmailAddress}
      />

      <TextInput
        label="Password"
        placeholder="Enter your password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <Button
        onPress={onSignIn}
        loading={isSigningIn}
        disabled={!emailAddress || !password || isSigningIn}
      >
        Sign In
      </Button>
      {errors.map((error) => (
        <ThemedText key={error.longMessage} style={{ color: "red" }}>
          {error.longMessage}
        </ThemedText>
      ))}

      <View style={{ marginTop: 16, alignItems: "center" }}>
        <ThemedText> Don&apos;t have an account</ThemedText>
        <Button onPress={() => router.push("/sign-up")} variant="ghost">
          Sign Up
        </Button>
      </View>

      <View style={{ marginTop: 16, alignItems: "center" }}>
        <ThemedText> Forget paswword?</ThemedText>
        <Button onPress={() => router.push("/reset-password")} variant="ghost">
          Reset Passwrod
        </Button>
      </View>
    </ScrollView>
  );
};

export default SignIn;
