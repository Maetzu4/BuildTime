import { SubScreenBar } from "@/components/top-app-bar";
import { useAppStore } from "@/lib/store";
import { useRouter } from "expo-router";
import {
  Award,
  CheckCircle,
  Flame,
  Layers,
  Repeat,
  Rocket,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ICON_MAP: Record<string, any> = {
  "check-circle": CheckCircle,
  trophy: Trophy,
  award: Award,
  flame: Flame,
  zap: Zap,
  star: Star,
  rocket: Rocket,
  layers: Layers,
  repeat: Repeat,
  sparkles: Sparkles,
};

export default function AchievementsScreen() {
  const router = useRouter();
  const { achievements } = useAppStore();
  const unlocked = achievements.filter((a) => a.unlocked).length;

  // pair achievements into rows of 2
  const rows: (typeof achievements)[] = [];
  for (let i = 0; i < achievements.length; i += 2) {
    rows.push(achievements.slice(i, i + 2));
  }

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <SubScreenBar title="Achievements" onBack={() => router.back()} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}
      >
        {/* Summary */}
        <View className="p-4 rounded-2xl bg-white/5 border border-white/10 items-center">
          <Text className="text-primary text-3xl font-bold">
            {unlocked}
            <Text className="text-white/40 text-sm font-normal">
              {" "}
              / {achievements.length}
            </Text>
          </Text>
          <Text className="text-white/40 text-xs mt-1">
            Achievements unlocked
          </Text>
        </View>

        {/* Grid — 2 columns */}
        {rows.map((row, ri) => (
          <View key={ri} className="flex-row gap-3">
            {row.map((achievement) => {
              const Icon = ICON_MAP[achievement.icon] || Star;
              const isUnlocked = achievement.unlocked;
              return (
                <View
                  key={achievement.id}
                  className={`flex-1 p-4 rounded-2xl border-2 items-center gap-2 ${
                    isUnlocked
                      ? "bg-white/5 border-accent/50"
                      : "bg-white/3 border-white/10 opacity-60"
                  }`}
                >
                  <View
                    className={`w-12 h-12 rounded-full items-center justify-center ${
                      isUnlocked ? "bg-accent/15" : "bg-white/10"
                    }`}
                  >
                    <Icon
                      size={24}
                      color={isUnlocked ? "#F59E0B" : "rgba(255,255,255,0.3)"}
                    />
                  </View>
                  <Text
                    className={`text-xs font-semibold text-center ${
                      isUnlocked ? "text-white" : "text-white/40"
                    }`}
                  >
                    {achievement.title}
                  </Text>
                  <Text className="text-white/40 text-[10px] text-center leading-tight">
                    {achievement.description}
                  </Text>
                  {isUnlocked && achievement.unlockedAt && (
                    <Text className="text-accent text-[9px] font-medium mt-1">
                      Unlocked {achievement.unlockedAt}
                    </Text>
                  )}
                </View>
              );
            })}
            {/* Si la fila tiene solo 1 elemento, rellena con espacio */}
            {row.length === 1 && <View className="flex-1" />}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
