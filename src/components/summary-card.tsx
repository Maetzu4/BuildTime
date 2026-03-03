import { useAppStore } from "@/lib/store";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { Circle, Svg } from "react-native-svg";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export function SummaryCard() {
  const router = useRouter();
  const { tasks, habits, projects } = useAppStore();

  const today = todayStr();
  const todayTasks = tasks.filter((t) => t.dueDate === today);
  const completedToday = todayTasks.filter(
    (t) => t.status === "completed",
  ).length;
  const pendingTasks = todayTasks.filter((t) => t.status === "todo").length;
  const todayHabits = habits.filter(
    (h) =>
      h.frequency === "daily" || h.weeklyDays.includes(new Date().getDay()),
  );
  const completedHabits = todayHabits.filter((h) =>
    h.completedDates.includes(today),
  ).length;
  const pendingHabits = todayHabits.length - completedHabits;
  const activeProjects = projects.filter((p) => p.status === "active").length;

  const totalItems = todayTasks.length + todayHabits.length;
  const completedItems = completedToday + completedHabits;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const size = 80;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <TouchableOpacity
      onPress={() => router.push("/statistics" as any)}
      className="mx-4 p-5 rounded-3xl bg-white/5 border border-white/10 flex-row items-center gap-5"
      activeOpacity={0.8}
    >
      {/* Circular progress */}
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox="0 0 80 80">
          <Circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="5"
          />
          <Circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="#6C3FC5"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            rotation="-90"
            origin="40, 40"
          />
        </Svg>
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-white text-sm font-bold">
            {Math.round(progress)}%
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View className="flex-1 gap-1.5">
        <Text className="text-white text-sm font-semibold">Daily Progress</Text>
        <Text className="text-white/50 text-xs">
          <Text className="text-white font-semibold">{pendingTasks}</Text> tasks
          pending
        </Text>
        <Text className="text-white/50 text-xs">
          <Text className="text-white font-semibold">{pendingHabits}</Text>{" "}
          habits left
        </Text>
        <Text className="text-white/50 text-xs">
          <Text className="text-white font-semibold">{activeProjects}</Text>{" "}
          active projects
        </Text>
      </View>
    </TouchableOpacity>
  );
}
