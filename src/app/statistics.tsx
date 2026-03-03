import { SubScreenBar } from "@/components/top-app-bar";
import { useAppStore } from "@/lib/store";
import { useRouter } from "expo-router";
import { CheckSquare, Flame, Repeat, TrendingUp } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function ProgressBar({
  value,
  color = "bg-primary",
}: {
  value: number;
  color?: string;
}) {
  return (
    <View className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
      <View
        className={`h-full rounded-full ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </View>
  );
}

function StatBox({
  icon,
  title,
  value,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <View className="p-5 rounded-2xl bg-white/5 border border-white/10">
      <View className="flex-row items-center gap-3 mb-3">
        {icon}
        <Text className="text-white text-xs font-semibold">{title}</Text>
      </View>
      <Text className="text-white text-3xl font-bold">{value}</Text>
      <Text className="text-white/40 text-xs mt-1 mb-3">{subtitle}</Text>
      {children}
    </View>
  );
}

function SmallStat({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <View className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 items-center">
      <Text className={`text-2xl font-bold ${color}`}>{value}</Text>
      <Text className="text-white/40 text-[10px] mt-1 text-center">
        {label}
      </Text>
    </View>
  );
}

const TABS = ["overview", "tasks", "habits", "projects"] as const;
type Tab = (typeof TABS)[number];

export default function StatisticsScreen() {
  const router = useRouter();
  const { tasks, habits, projects } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const today = todayStr();

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const totalTasks = tasks.length;
  const taskRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const todayTasksDone = tasks.filter(
    (t) => t.dueDate === today && t.status === "completed",
  ).length;
  const habitsCompletedToday = habits.filter((h) =>
    h.completedDates.includes(today),
  ).length;
  const bestStreak = habits.reduce((m, h) => Math.max(m, h.longestStreak), 0);
  const avgStreak =
    habits.length > 0
      ? Math.round(habits.reduce((s, h) => s + h.streak, 0) / habits.length)
      : 0;
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed",
  ).length;

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <SubScreenBar title="Statistics" onBack={() => router.back()} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}
      >
        {/* Tabs */}
        <View className="bg-white/5 rounded-xl p-1 flex-row">
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 h-8 rounded-lg items-center justify-center ${activeTab === tab ? "bg-white/10" : ""}`}
            >
              <Text
                className={`text-[10px] font-semibold capitalize ${activeTab === tab ? "text-white" : "text-white/40"}`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview */}
        {activeTab === "overview" && (
          <View className="gap-4">
            <StatBox
              icon={<TrendingUp size={20} color="#6C3FC5" />}
              title="Overall Completion"
              value={`${taskRate}%`}
              subtitle={`${completedTasks} of ${totalTasks} tasks completed`}
            >
              <ProgressBar value={taskRate} />
            </StatBox>
            <View className="flex-row gap-3">
              <SmallStat
                value={todayTasksDone}
                label="Tasks Done Today"
                color="text-secondary"
              />
              <SmallStat
                value={habitsCompletedToday}
                label="Habits Today"
                color="text-accent"
              />
              <SmallStat
                value={activeProjects}
                label="Active Projects"
                color="text-primary"
              />
            </View>
            <StatBox
              icon={<Flame size={20} color="#F59E0B" />}
              title="Streak Stats"
              value={`${bestStreak} days`}
              subtitle="Best streak across all habits"
            >
              <View className="flex-row gap-4 mt-2">
                <View className="items-center">
                  <Text className="text-white text-lg font-bold">
                    {avgStreak}
                  </Text>
                  <Text className="text-white/40 text-[10px]">Avg streak</Text>
                </View>
                <View className="items-center">
                  <Text className="text-white text-lg font-bold">
                    {habits.length}
                  </Text>
                  <Text className="text-white/40 text-[10px]">
                    Total habits
                  </Text>
                </View>
              </View>
            </StatBox>
          </View>
        )}

        {/* Tasks */}
        {activeTab === "tasks" && (
          <View className="gap-4">
            <StatBox
              icon={<CheckSquare size={20} color="#3B82F6" />}
              title="Task Completion Rate"
              value={`${taskRate}%`}
              subtitle={`${completedTasks} completed, ${totalTasks - completedTasks} remaining`}
            >
              <ProgressBar value={taskRate} color="bg-secondary" />
            </StatBox>
            <View className="flex-row gap-3">
              <SmallStat
                value={tasks.filter((t) => t.priority === "high").length}
                label="High Priority"
                color="text-red-400"
              />
              <SmallStat
                value={tasks.filter((t) => t.priority === "medium").length}
                label="Medium Priority"
                color="text-accent"
              />
            </View>
            <View className="p-4 rounded-2xl bg-white/5 border border-white/10 gap-2">
              <Text className="text-white text-xs font-semibold mb-1">
                By Priority
              </Text>
              {(["high", "medium", "low"] as const).map((p) => {
                const count = tasks.filter((t) => t.priority === p).length;
                const pct = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
                return (
                  <View key={p} className="flex-row items-center gap-3">
                    <Text className="text-white/40 text-xs w-16 capitalize">
                      {p}
                    </Text>
                    <ProgressBar
                      value={pct}
                      color={
                        p === "high"
                          ? "bg-red-400"
                          : p === "medium"
                            ? "bg-accent"
                            : "bg-white/30"
                      }
                    />
                    <Text className="text-white text-xs font-semibold w-6 text-right">
                      {count}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Habits */}
        {activeTab === "habits" && (
          <View className="gap-4">
            <StatBox
              icon={<Repeat size={20} color="#F59E0B" />}
              title="Habit Streaks"
              value={`${bestStreak} days`}
              subtitle="Longest streak achieved"
            >
              <View className="gap-2 mt-3">
                {habits.map((h) => (
                  <View key={h.id} className="flex-row items-center gap-3">
                    <Text
                      numberOfLines={1}
                      className="text-white text-xs flex-1"
                    >
                      {h.name}
                    </Text>
                    <View className="flex-row items-center gap-1.5">
                      <ProgressBar
                        value={
                          h.longestStreak > 0
                            ? (h.streak / h.longestStreak) * 100
                            : 0
                        }
                        color="bg-accent"
                      />
                      <Text className="text-white/40 text-[10px] w-10 text-right">
                        {h.streak}/{h.longestStreak}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </StatBox>
            <View className="flex-row gap-3">
              <SmallStat
                value={habits.filter((h) => h.frequency === "daily").length}
                label="Daily Habits"
                color="text-primary"
              />
              <SmallStat
                value={habits.filter((h) => h.frequency === "weekly").length}
                label="Weekly Habits"
                color="text-secondary"
              />
            </View>
          </View>
        )}

        {/* Projects */}
        {activeTab === "projects" && (
          <View className="gap-4">
            <View className="flex-row gap-3">
              <SmallStat
                value={activeProjects}
                label="Active"
                color="text-primary"
              />
              <SmallStat
                value={completedProjects}
                label="Completed"
                color="text-green-400"
              />
            </View>
            {projects.map((project) => {
              const pTasks = tasks.filter((t) => t.projectId === project.id);
              const pDone = pTasks.filter(
                (t) => t.status === "completed",
              ).length;
              const progress =
                pTasks.length > 0 ? (pDone / pTasks.length) * 100 : 0;
              return (
                <View
                  key={project.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 gap-2"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-white text-sm font-semibold">
                      {project.name}
                    </Text>
                    <Text className="text-primary text-xs font-semibold">
                      {Math.round(progress)}%
                    </Text>
                  </View>
                  <ProgressBar value={progress} />
                  <Text className="text-white/30 text-[10px]">
                    {pDone}/{pTasks.length} tasks completed
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
