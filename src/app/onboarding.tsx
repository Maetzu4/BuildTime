import { useAppStore } from "@/lib/store";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  CheckCircle,
  Rocket,
  SkipForward,
  User,
} from "lucide-react-native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STEPS = [
  {
    icon: Rocket,
    title: "Welcome to BuildTime",
    subtitle:
      "Your personal productivity hub for task management, habit tracking, and project organization.",
  },
  {
    icon: CheckCircle,
    title: "Create Your First Project",
    subtitle:
      "Get started by creating a project to organize your tasks and habits.",
  },
  {
    icon: User,
    title: "You're all set!",
    subtitle: "Start organizing your tasks, habits, and projects in one place.",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { onboardingStep, setOnboardingStep, completeOnboarding, addProject } =
    useAppStore();
  const [projectName, setProjectName] = useState("");

  const step = STEPS[onboardingStep];
  const Icon = step.icon;

  function handleNext() {
    if (onboardingStep === 1 && projectName.trim()) {
      addProject({
        name: projectName.trim(),
        description: "",
        timeline: "mid",
        targetDate: "2026-06-01",
      });
    }
    if (onboardingStep < 2) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      completeOnboarding();
      router.replace("/(tabs)/home" as any);
    }
  }

  function handleSkip() {
    if (onboardingStep < 2) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      completeOnboarding();
      router.replace("/(tabs)/home" as any);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="flex-1 items-center justify-center px-8">
        {/* Progress dots */}
        <View className="flex-row gap-2 mb-12">
          {STEPS.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full ${
                i === onboardingStep
                  ? "w-8 bg-primary"
                  : i < onboardingStep
                    ? "w-2 bg-primary/60"
                    : "w-2 bg-white/20"
              }`}
            />
          ))}
        </View>

        {/* Icon */}
        <View className="w-24 h-24 rounded-3xl bg-primary/10 items-center justify-center mb-8">
          <Icon size={48} color="#6C3FC5" />
        </View>

        {/* Content */}
        <Text className="text-white text-2xl font-bold text-center mb-3">
          {step.title}
        </Text>
        <Text className="text-white/50 text-center leading-relaxed mb-10">
          {step.subtitle}
        </Text>

        {/* Step 1 — Project name input */}
        {onboardingStep === 1 && (
          <View className="w-full mb-8">
            <TextInput
              placeholder="Project name (e.g. My App)"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={projectName}
              onChangeText={setProjectName}
              className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-base"
            />
          </View>
        )}

        {/* Actions */}
        <View className="w-full gap-3">
          <TouchableOpacity
            onPress={handleNext}
            className="w-full h-14 bg-primary rounded-xl flex-row items-center justify-center gap-2"
          >
            <Text className="text-white text-base font-semibold">
              {onboardingStep === 2 ? "Get Started" : "Continue"}
            </Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>

          {onboardingStep > 0 && (
            <TouchableOpacity
              onPress={handleSkip}
              className="w-full h-12 flex-row items-center justify-center gap-2"
            >
              <SkipForward size={16} color="rgba(255,255,255,0.4)" />
              <Text className="text-white/40 text-base">Skip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
