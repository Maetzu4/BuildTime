import { ThemeProvider } from "@/components/theme-provider";
import { useAppStore } from "@/lib/store";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

function useProtectedRoute() {
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inTabs = segments[0] === "(tabs)";
    const inOnboarding = segments[0] === "onboarding";

    if (!onboardingComplete && !inOnboarding) {
      router.replace("/onboarding" as any);
    } else if (onboardingComplete && inOnboarding) {
      router.replace("/home" as any);
    }
  }, [onboardingComplete, segments]);
}

function RootNavigator() {
  useProtectedRoute();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="calendar" />
      <Stack.Screen name="statistics" />
      <Stack.Screen name="achievements" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
