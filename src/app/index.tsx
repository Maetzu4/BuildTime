import { useAppStore } from "@/lib/store";
import { Redirect } from "expo-router";

export default function Index() {
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);

  if (onboardingComplete) {
    return <Redirect href={"/(tabs)/home" as any} />;
  }

  return <Redirect href={"/onboarding" as any} />;
}
