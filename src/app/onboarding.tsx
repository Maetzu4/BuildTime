import { PROJECT_TIMELINE_LABELS, PROJECT_TIMELINES } from "@/lib/constants";
import { useAppStore } from "@/lib/store";
import { ProjectTimeline } from "@/lib/types";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STEPS = [
  {
    id: "1",
    emoji: "🕓",
    title: "BuildTime",
    subtitle: "Build your best self, one task at a time",
  },
  {
    id: "2",
    emoji: "📁",
    title: "Start with a project",
    subtitle: "Projects help you organize your tasks and habits",
  },
  {
    id: "3",
    emoji: "☁️",
    title: "Save your progress",
    subtitle: "Sign in to sync across devices. You can always do this later.",
  },
];

export default function OnboardingScreen() {
  const { completeOnboarding, addProject } = useAppStore();
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);

  const [step, setStep] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [timeline, setTimeline] = useState<ProjectTimeline>("mid");

  function finish() {
    completeOnboarding();
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
      flatListRef.current?.scrollToIndex({ index: step + 1, animated: true });
    }
  }

  function handleBack() {
    if (step > 0) {
      flatListRef.current?.scrollToIndex({ index: step - 1, animated: true });
    }
  }

  // Detectar cambios cuando el usuario hace swipe con el dedo
  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const currentIndex = Math.round(
      event.nativeEvent.contentOffset.x / slideSize,
    );
    if (currentIndex !== step) {
      setStep(currentIndex);
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof STEPS)[0];
    index: number;
  }) => {
    return (
      <View
        style={{ width, paddingHorizontal: 32 }}
        className="items-center justify-center flex-1"
      >
        {/* Icon */}
        <View className="w-20 h-20 rounded-2xl items-center justify-center mb-6 bg-m3-surface-container">
          <Text style={{ fontSize: 40 }}>{item.emoji}</Text>
        </View>

        {/* Title + subtitle */}
        <Text className="text-m3-on-surface text-3xl font-bold text-center mb-3">
          {item.title}
        </Text>
        <Text className="text-m3-on-surface-variant text-base text-center leading-relaxed mb-10">
          {item.subtitle}
        </Text>

        {/* Step 1 — Project input */}
        {index === 1 && (
          <View className="w-full gap-4 mb-8">
            <TextInput
              placeholder="Project name"
              placeholderClassName="text-m3-outline"
              value={projectName}
              onChangeText={setProjectName}
              className="w-full h-14 border rounded-xl px-4 text-base bg-m3-surface-container border-m3-outline text-m3-on-surface"
            />
            <View className="flex-row border rounded-full overflow-hidden border-m3-outline">
              {PROJECT_TIMELINES.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTimeline(t)}
                  className={`flex-1 py-2.5 items-center ${timeline === t ? "bg-m3-primary" : "bg-transparent"}`}
                >
                  <Text
                    className={`text-sm font-semibold ${timeline === t ? "text-m3-on-primary" : "text-m3-on-surface-variant"}`}
                  >
                    {PROJECT_TIMELINE_LABELS[t]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 2 — Sign in & Finish */}
        {index === 2 && (
          <View className="w-full gap-4 mb-8">
            <TouchableOpacity
              className="w-full h-14 rounded-full flex-row items-center justify-center gap-3 shadow-sm bg-m3-primary"
              activeOpacity={0.8}
            >
              <Text className="text-m3-on-primary text-base font-bold">
                Continue with Google
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={finish}
              className="w-full h-14 rounded-full items-center justify-center bg-m3-surface-container"
              activeOpacity={0.8}
            >
              <Text className="text-m3-on-surface text-base font-semibold">
                Use locally, skip sign in
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-m3-surface">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={flatListRef}
          data={STEPS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onMomentumScrollEnd={handleScroll}
        />

        {/* Navegación Inferior (Controles en las esquinas) */}
        <View className="px-6 pb-6 pt-4 flex-row items-center justify-between">
          {/* Esquina Izquierda: Botón Atrás (Aparece en vista 2 y 3) */}
          <View className="w-24 items-start">
            {step > 0 && (
              <TouchableOpacity
                onPress={handleBack}
                className="flex-row items-center py-2 gap-1 rounded-full"
                activeOpacity={0.7}
              >
                <ArrowLeft size={20} className="text-m3-primary" />
                <Text className="text-m3-primary font-semibold text-base">
                  Back
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Indicadores de Progreso Centrales */}
          <View className="flex-row gap-2">
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={{ width: i === step ? 24 : 8 }}
                className={`h-2 rounded-full ${i === step ? "bg-m3-primary" : "bg-m3-surface-container"}`}
              />
            ))}
          </View>

          {/* Esquina Derecha: Botón Adelante (Aparece en vista 1 y 2) */}
          <View className="w-24 items-end">
            {step < 2 && (
              <TouchableOpacity
                onPress={handleNext}
                className="flex-row items-center py-2 gap-1 rounded-full"
                activeOpacity={0.7}
              >
                <Text className="text-m3-primary font-semibold text-base">
                  Next
                </Text>
                <ArrowRight size={20} className="text-m3-primary" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
