/* eslint-disable import/no-named-as-default */
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { useSignUp } from "@clerk/clerk-expo";
import { ClerkAPIError } from "@clerk/types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";

const SignUp = () => {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ClerkAPIError[]>([]);
  const [pendingVerfication, setPendingVerfication] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");

  const onSignUp = async () => {
    if (!isLoaded) return;
    setIsLoading(true);
    setErrors([]);
    try {
      await signUp.create({
        emailAddress,
        password,
      });
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setPendingVerfication(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const onVerify = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    setErrors([]);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(index)");
      } else {
        console.log(signUpAttempt);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (pendingVerfication) {
    return (
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TextInput
          value={code}
          label={`Enter the verification code we sent to your ${emailAddress}`}
          placeholder="Enter the verification code"
          onChangeText={(code) => setCode(code)}
        />
        <Button
          onPress={onVerify}
          loading={isLoading}
          disabled={!code || isLoading}
        >
          Verify
        </Button>
        {errors.map((error) => (
          <ThemedText key={error.longMessage} style={{ color: "red" }}>
            {error.longMessage}
          </ThemedText>
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <TextInput
        label="Email"
        placeholder="Enter your email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={emailAddress}
        onChangeText={(email) => setEmailAddress(email)}
      />

      <TextInput
        label="Password"
        placeholder="Enter your password"
        secureTextEntry={true}
        value={password}
        onChangeText={(password) => setPassword(password)}
      />

      <Button
        onPress={onSignUp}
        loading={isLoading}
        disabled={!emailAddress || !password || isLoading}
      >
        Continue
      </Button>

      {errors.map((error) => (
        <ThemedText key={error.longMessage} style={{ color: "red" }}>
          {error.longMessage}
        </ThemedText>
      ))}

      <View style={{ marginTop: 40, alignItems: "center" }}>
        <ThemedText> Already have an account</ThemedText>
        <Button
          onPress={() => router.push("/(auth)")}
          variant="outline"
          style={{ marginTop: 10 }}
        >
          Sign In
        </Button>
      </View>
    </ScrollView>
  );
};

export default SignUp;
