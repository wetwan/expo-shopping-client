
import { ThemedText } from "@/componets/ThemedText";
import Button from "@/componets/ui/button";
import TextInput from "@/componets/ui/text-input";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { ClerkAPIError } from "@clerk/types";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView } from "react-native";

const ResetPassword = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<ClerkAPIError[]>([]);
  const [pendingVerfication, setPendingVerfication] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");

  const onResetPassword = useCallback(async () => {
    if (!isLoaded) return;
    setErrors([]);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });

      setPendingVerfication(true);
    } catch (error) {
      if (isClerkAPIResponseError(error)) setErrors(error.errors);
      console.error(JSON.stringify(error, null, 2));
    }
  }, [isLoaded, emailAddress, signIn]);
  const onVerify = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
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
    }
  }, [isLoaded, code, password, signIn, setActive, router]);

  if (pendingVerfication) {
    return (
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TextInput
          value={code}
          label={`Enter the verification code we sent to your ${emailAddress}`}
          placeholder="Enter the verification code"
          onChangeText={(code) => setCode(code)}
        />

        <TextInput
          label="Enter your new password"
          placeholder="Enter your new password"
          secureTextEntry={true}
          value={password}
          onChangeText={(password) => setPassword(password)}
        />
        {errors.map((error) => (
          <ThemedText key={error.longMessage} style={{ color: "red" }}>
            {error.longMessage}
          </ThemedText>
        ))}
        <Button onPress={onVerify} disabled={!code || !password}>
          Reset password
        </Button>
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
      {errors.map((error) => (
        <ThemedText
          key={error.longMessage}
          style={{ color: "red", paddingBottom: 3 }}
        >
          {error.longMessage}
        </ThemedText>
      ))}
      <Button onPress={onResetPassword} disabled={!emailAddress}>
        Continue
      </Button>
    </ScrollView>
  );
};

export default ResetPassword;
