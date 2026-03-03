import { ChipFilter, ProjectFilterStrip } from "@/components/filter-chips";
import { TopAppBar } from "@/components/top-app-bar";
import { useAppStore } from "@/lib/store";
import { Check, Flame } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

const HABIT_FILTERS = [
  { label: "All", value: "all" },
  { label: "By Streak", value: "streak" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "A-Z", value: "az" },
];

function MiniStatsCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: number;
  subtitle: string;
}) {
  return (
    <View className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 gap-1">
      <Text className="text-white/40 text-xs font-medium">{label}</Text>
      <Text className="text-white text-2xl font-bold">{value}</Text>
      <Text className="text-white/40 text-xs">{subtitle}</Text>
    </View>
  );
}

// ── Progress Bar ──────────────────────────────────────────────
function ProgressBar({ value }: { value: number }) {
  return (
    <View className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
      <View
        className="h-full bg-primary rounded-full"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </View>
  );
}

export default function HabitsScreen() {
  const { habits, projects, selectedProjectFilter, toggleHabitComplete } =
    useAppStore();
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);

  const today = todayStr();
  const todayDate = new Date();

  // Weekly calendar Mon → Sun
  const weekStart = new Date(todayDate);
  const dayOfWeek = todayDate.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  weekStart.setDate(todayDate.getDate() + mondayOffset);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  let filtered = habits.filter(
    (h) => !selectedProjectFilter || h.projectId === selectedProjectFilter,
  );
  if (filter === "daily")
    filtered = filtered.filter((h) => h.frequency === "daily");
  else if (filter === "weekly")
    filtered = filtered.filter((h) => h.frequency === "weekly");
  else if (filter === "streak")
    filtered = [...filtered].sort((a, b) => b.streak - a.streak);
  else if (filter === "az")
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  const bestStreak = habits.reduce(
    (max, h) => Math.max(max, h.longestStreak),
    0,
  );
  const todayCompleted = habits.filter((h) =>
    h.completedDates.includes(today),
  ).length;

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <TopAppBar title="Habits" showAvatar />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100, gap: 16, paddingTop: 8 }}
      >
        {/* Weekly Calendar */}
        <View className="flex-row justify-between px-4">
          {weekDays.map((day, i) => {
            const dateStr = day.toISOString().split("T")[0];
            const isToday = dateStr === today;
            const allDone =
              habits.length > 0 &&
              habits.every((h) => h.completedDates.includes(dateStr));
            const someDone = habits.some((h) =>
              h.completedDates.includes(dateStr),
            );

            return (
              <View key={i} className="items-center gap-1.5">
                <Text className="text-white/40 text-[10px] font-medium">
                  {DAYS[i]}
                </Text>
                <View
                  className={`w-9 h-9 rounded-full items-center justify-center ${
                    allDone
                      ? "bg-primary"
                      : someDone
                        ? "bg-primary/30"
                        : isToday
                          ? "border-2 border-primary"
                          : "bg-white/10"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      allDone
                        ? "text-white"
                        : someDone || isToday
                          ? "text-primary"
                          : "text-white/40"
                    }`}
                  >
                    {day.getDate()}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Stats */}
        <View className="flex-row gap-3 px-4">
          <MiniStatsCard
            label="Best Streak"
            value={bestStreak}
            subtitle="days"
          />
          <MiniStatsCard
            label="Today"
            value={todayCompleted}
            subtitle={`of ${habits.length} done`}
          />
        </View>

        <ProjectFilterStrip />
        <ChipFilter
          options={HABIT_FILTERS}
          selected={filter}
          onChange={setFilter}
        />

        {/* Habit list */}
        <View className="px-4 gap-2">
          {filtered.length === 0 ? (
            <Text className="text-white/40 text-sm text-center py-8">
              No habits match this filter.
            </Text>
          ) : (
            filtered.map((habit) => {
              const project = projects.find((p) => p.id === habit.projectId);
              const completed = habit.completedDates.includes(today);
              const progressPct =
                habit.longestStreak > 0
                  ? (habit.streak / habit.longestStreak) * 100
                  : 0;

              return (
                <View
                  key={habit.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center gap-3"
                >
                  <View className="flex-1 min-w-0">
                    {/* Name + frequency */}
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text
                        className="text-white text-sm font-medium flex-1"
                        numberOfLines={1}
                      >
                        {habit.name}
                      </Text>
                      <View className="bg-secondary/15 px-1.5 py-0.5 rounded">
                        <Text className="text-secondary text-[10px] font-medium">
                          {habit.frequency}
                        </Text>
                      </View>
                    </View>

                    {/* Project + streak */}
                    <View className="flex-row items-center gap-2 mb-2">
                      {project && (
                        <View className="bg-primary/10 px-1.5 py-0.5 rounded">
                          <Text
                            className="text-primary text-[10px] font-medium"
                            numberOfLines={1}
                          >
                            {project.name}
                          </Text>
                        </View>
                      )}
                      <View className="flex-row items-center gap-1">
                        <Flame size={12} color="#F59E0B" />
                        <Text className="text-accent text-xs font-semibold">
                          {habit.streak}
                        </Text>
                      </View>
                    </View>

                    {/* Progress bar */}
                    <View className="flex-row items-center gap-2">
                      <ProgressBar value={progressPct} />
                      <Text className="text-white/30 text-[10px]">
                        {habit.streak}/{habit.longestStreak}
                      </Text>
                    </View>
                  </View>

                  {/* Complete button */}
                  <TouchableOpacity
                    onPress={() => toggleHabitComplete(habit.id)}
                    className={`w-12 h-12 rounded-full items-center justify-center ${
                      completed ? "bg-primary" : "border-2 border-white/30"
                    }`}
                  >
                    <Check
                      size={24}
                      color={completed ? "white" : "rgba(255,255,255,0.3)"}
                    />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
