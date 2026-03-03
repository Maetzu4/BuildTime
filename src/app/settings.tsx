import { SubScreenBar } from "@/components/top-app-bar";
import { useAppStore } from "@/lib/store";
import { useRouter } from "expo-router";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  GripVertical,
  Moon,
  Palette,
  RefreshCw,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const THEME_COLORS = [
  { label: "Purple", value: "#6C3FC5" },
  { label: "Blue", value: "#3B82F6" },
  { label: "Green", value: "#10B981" },
  { label: "Red", value: "#EF4444" },
  { label: "Orange", value: "#F59E0B" },
];

function SectionLabel({ label }: { label: string }) {
  return (
    <Text className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
      {label}
    </Text>
  );
}

function SettingRow({
  icon: Icon,
  label,
  right,
}: {
  icon: any;
  label: string;
  right: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center justify-between h-14 px-4 rounded-2xl bg-white/5 border border-white/10">
      <View className="flex-row items-center gap-3">
        <Icon size={20} color="rgba(255,255,255,0.4)" />
        <Text className="text-white text-sm font-medium">{label}</Text>
      </View>
      {right}
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const {
    darkMode,
    homeSections,
    setDarkMode,
    toggleHomeSection,
    reorderHomeSections,
  } = useAppStore();
  const [taskReminders, setTaskReminders] = useState(true);
  const [habitReminders, setHabitReminders] = useState(true);
  const [autoSync, setAutoSync] = useState(false);

  function moveSection(idx: number, dir: -1 | 1) {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= homeSections.length) return;
    reorderHomeSections(idx, newIdx);
  }

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <SubScreenBar title="Settings" onBack={() => router.back()} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 24, paddingBottom: 40 }}
      >
        {/* Appearance */}
        <View className="gap-2">
          <SectionLabel label="Appearance" />
          <SettingRow
            icon={Moon}
            label="Dark Mode"
            right={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "rgba(255,255,255,0.1)", true: "#6C3FC5" }}
                thumbColor="white"
              />
            }
          />

          {/* Theme colors */}
          <View className="p-4 rounded-2xl bg-white/5 border border-white/10 gap-3">
            <View className="flex-row items-center gap-3">
              <Palette size={20} color="rgba(255,255,255,0.4)" />
              <Text className="text-white text-sm font-medium">
                Theme Color
              </Text>
            </View>
            <View className="flex-row gap-3">
              {THEME_COLORS.map((color) => (
                <TouchableOpacity
                  key={color.value}
                  className="w-9 h-9 rounded-full border-2 border-white/20"
                  style={{ backgroundColor: color.value }}
                  activeOpacity={0.8}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Customize Home */}
        <View className="gap-2">
          <SectionLabel label="Customize Home" />
          {homeSections.map((section, idx) => (
            <View
              key={section.id}
              className="flex-row items-center gap-3 h-14 px-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <GripVertical size={16} color="rgba(255,255,255,0.3)" />
              <Text className="text-white text-sm font-medium flex-1">
                {section.label}
              </Text>

              {/* Up/Down buttons */}
              <View className="flex-row items-center gap-1">
                <TouchableOpacity
                  onPress={() => moveSection(idx, -1)}
                  disabled={idx === 0}
                  className="w-7 h-7 rounded-lg items-center justify-center"
                >
                  <ChevronUp
                    size={16}
                    color={
                      idx === 0
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(255,255,255,0.4)"
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => moveSection(idx, 1)}
                  disabled={idx === homeSections.length - 1}
                  className="w-7 h-7 rounded-lg items-center justify-center"
                >
                  <ChevronDown
                    size={16}
                    color={
                      idx === homeSections.length - 1
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(255,255,255,0.4)"
                    }
                  />
                </TouchableOpacity>
              </View>

              {/* Visibility toggle */}
              <TouchableOpacity
                onPress={() => toggleHomeSection(section.id)}
                className="w-8 h-8 rounded-lg items-center justify-center"
              >
                {section.visible ? (
                  <Eye size={16} color="#6C3FC5" />
                ) : (
                  <EyeOff size={16} color="rgba(255,255,255,0.3)" />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Notifications */}
        <View className="gap-2">
          <SectionLabel label="Notifications" />
          <SettingRow
            icon={Bell}
            label="Task Reminders"
            right={
              <Switch
                value={taskReminders}
                onValueChange={setTaskReminders}
                trackColor={{ false: "rgba(255,255,255,0.1)", true: "#6C3FC5" }}
                thumbColor="white"
              />
            }
          />
          <SettingRow
            icon={Bell}
            label="Habit Reminders"
            right={
              <Switch
                value={habitReminders}
                onValueChange={setHabitReminders}
                trackColor={{ false: "rgba(255,255,255,0.1)", true: "#6C3FC5" }}
                thumbColor="white"
              />
            }
          />
        </View>

        {/* Sync */}
        <View className="gap-2">
          <SectionLabel label="Sync" />
          <SettingRow
            icon={RefreshCw}
            label="Auto Sync"
            right={
              <Switch
                value={autoSync}
                onValueChange={setAutoSync}
                trackColor={{ false: "rgba(255,255,255,0.1)", true: "#6C3FC5" }}
                thumbColor="white"
              />
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
