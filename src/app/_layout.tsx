import { Stack } from "expo-router";
import {tokenCache} from "@clerk/expo/token-cache";
import {Slot} from "expo-router";
import {ClerkProvider} from "@clerk/expo";
import '../../src/global.css';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if(!publishableKey) {
  throw new Error("Missing publishable key. Please add it to your .env file.");
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey || ``} tokenCache={tokenCache}>
      <Slot />
    </ClerkProvider>
  )
}
