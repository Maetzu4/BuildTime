import { useAppStore } from "@/lib/store";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowRight, Cloud, FolderOpen, Rocket } from "lucide-react-native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const STEPS = [
  {
    icon: Rocket,
    emoji: "⚡",
    title: "BuildTime",
    subtitle: "Build your best self, one task at a time",
    cta: "Get Started",
    showSkip: true,
  },
  {
    icon: FolderOpen,
    emoji: "📁",
    title: "Start with a project",
    subtitle: "Projects help you organize your tasks and habits",
    cta: "Create project",
    showSkip: true,
  },
  {
    icon: Cloud,
    emoji: "☁️",
    title: "Save your progress",
    subtitle: "Sign in to sync across devices. You can always do this later.",
    cta: null,
    showSkip: false,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding, addProject } = useAppStore();
  const [step, setStep] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [timeline, setTimeline] = useState<"short" | "mid" | "long">("mid");

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  function animateTo(nextStep: number) {
    opacity.value = withTiming(0, { duration: 200 }, () => {
      translateX.value = 50;
      runOnJS(setStep)(nextStep);
      translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 250 });
    });
  }

  function finish() {
    completeOnboarding();
    router.replace("/(tabs)" as any);
  }

  function handleNext() {
    if (step === 1 && projectName.trim()) {
      addProject({
        name: projectName.trim(),
        description: "",
        timeline,
        targetDate: "2026-06-01",
      });
    }
    if (step < 2) {
      animateTo(step + 1);
    } else {
      finish();
    }
  }

  function handleSkip() {
    if (step < 2) animateTo(step + 1);
    else finish();
  }

  const timelineLabels = {
    short: "Short term",
    mid: "Mid term",
    long: "Long term",
  };

  return (
    <View className="flex-1">
      {/* Gradient background manual para RN */}
      <LinearGradient
        colors={["#6C3FC5", "#3B82F6"]}
        className="absolute inset-0"
      />
      <View
        className="absolute inset-0 opacity-40 bg-secondary"
        style={{ top: "50%" }}
      />

      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center px-8">
          <Animated.View style={animStyle} className="items-center w-full">
            {/* Icon box */}
            <View className="w-20 h-20 bg-white/20 rounded-2xl items-center justify-center mb-6">
              <Text style={{ fontSize: 40 }}>{STEPS[step].emoji}</Text>
            </View>

            {/* Title */}
            <Text className="text-white text-3xl font-bold text-center mb-3">
              {STEPS[step].title}
            </Text>
            <Text className="text-white/80 text-base text-center leading-relaxed mb-10">
              {STEPS[step].subtitle}
            </Text>

            {/* Step 1 — project input */}
            {step === 1 && (
              <View className="w-full gap-4 mb-8">
                <TextInput
                  placeholder="Project name"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={projectName}
                  onChangeText={setProjectName}
                  className="w-full h-14 bg-white/15 border border-white/20 rounded-xl px-4 text-white text-base"
                />
                {/* Timeline selector */}
                <View className="flex-row border border-white/20 rounded-full overflow-hidden">
                  {(["short", "mid", "long"] as const).map((t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setTimeline(t)}
                      className={`flex-1 py-2.5 items-center ${
                        timeline === t ? "bg-white/25" : ""
                      }`}
                    >
                      <Text
                        className={`text-sm font-semibold ${
                          timeline === t ? "text-white" : "text-white/50"
                        }`}
                      >
                        {timelineLabels[t]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Step 2 — sign in options */}
            {step === 2 && (
              <View className="w-full gap-3 mb-8">
                <TouchableOpacity
                  className="w-full h-14 bg-white rounded-xl flex-row items-center justify-center gap-3"
                  activeOpacity={0.9}
                >
                  <Text className="text-primary text-base font-semibold">
                    Continue with Google
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={finish}
                  className="w-full h-12 items-center justify-center"
                >
                  <Text className="text-white/70 text-base">
                    Use locally, skip sign in
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* CTA button (steps 0 and 1) */}
            {step < 2 && (
              <View className="w-full gap-3">
                <TouchableOpacity
                  onPress={handleNext}
                  className="w-full h-14 bg-white rounded-xl flex-row items-center justify-center gap-2"
                  activeOpacity={0.9}
                >
                  <Text className="text-primary text-base font-semibold">
                    {step === 1 && !projectName.trim()
                      ? "Skip"
                      : STEPS[step].cta}
                  </Text>
                  <ArrowRight size={20} color="#6C3FC5" />
                </TouchableOpacity>

                {step > 0 && (
                  <TouchableOpacity
                    onPress={handleSkip}
                    className="w-full h-12 items-center justify-center"
                  >
                    <Text className="text-white/50 text-base">
                      Skip for now
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </Animated.View>
        </View>

        {/* Progress dots */}
        <View className="flex-row justify-center gap-2 pb-10">
          {STEPS.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full bg-white transition-all ${
                i === step ? "w-6" : "w-2 opacity-30"
              }`}
            />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}
