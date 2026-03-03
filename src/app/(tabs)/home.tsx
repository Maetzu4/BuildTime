import { ProjectFilterStrip } from "@/components/filter-chips";
import { SummaryCard } from "@/components/summary-card";
import { TopAppBar } from "@/components/top-app-bar";
import { useAppStore } from "@/lib/store";
import type { Habit, Project, Task } from "@/lib/types";
import { useRouter } from "expo-router";
import { Calendar, Check, Flame } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function HomeScreen() {
  const { tasks, habits, projects, homeSections, selectedProjectFilter } =
    useAppStore();
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCreateHabit, setShowCreateHabit] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);

  const today = todayStr();
  const filteredTasks = tasks
    .filter((t) => t.dueDate === today)
    .filter(
      (t) => !selectedProjectFilter || t.projectId === selectedProjectFilter,
    );

  const filteredHabits = habits
    .filter(
      (h) =>
        h.frequency === "daily" || h.weeklyDays.includes(new Date().getDay()),
    )
    .filter(
      (h) => !selectedProjectFilter || h.projectId === selectedProjectFilter,
    );

  const sectionMap: Record<string, React.ReactNode> = {
    summary: <SummaryCard key="summary" />,
    "projects-filter": (
      <ProjectFilterStrip
        key="filter"
        onNewProject={() => setShowCreateProject(true)}
      />
    ),
    "tasks-today": (
      <TasksTodaySection
        key="tasks"
        tasks={filteredTasks}
        projects={projects}
      />
    ),
    "habits-today": (
      <HabitsTodaySection key="habits" habits={filteredHabits} today={today} />
    ),
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <TopAppBar greeting showAvatar />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ gap: 20, paddingTop: 8, paddingBottom: 100 }}
      >
        {homeSections.filter((s) => s.visible).map((s) => sectionMap[s.id])}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Tasks Today ───────────────────────────────────────────────
function TasksTodaySection({
  tasks,
  projects,
}: {
  tasks: Task[];
  projects: Project[];
}) {
  const toggleTask = useAppStore((s) => s.toggleTask);
  const router = useRouter();

  return (
    <View className="px-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-white text-base font-semibold">Tasks Today</Text>
        <TouchableOpacity
          onPress={() => router.push("/calendar" as any)}
          className="flex-row items-center gap-1.5"
        >
          <Calendar size={14} color="#6C3FC5" />
          <Text className="text-primary text-xs font-medium">Calendar</Text>
        </TouchableOpacity>
      </View>
      {tasks.length === 0 ? (
        <Text className="text-white/40 text-sm py-4">
          No tasks for today. Create one!
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          {tasks.map((task) => {
            const project = projects.find((p) => p.id === task.projectId);
            return (
              <View
                key={task.id}
                className="w-56 p-4 rounded-2xl bg-white/5 border border-white/10 gap-2"
              >
                <View className="flex-row items-start gap-3">
                  <TouchableOpacity
                    onPress={() => toggleTask(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md border-2 items-center justify-center ${
                      task.status === "completed"
                        ? "bg-primary border-primary"
                        : "border-white/30"
                    }`}
                  >
                    {task.status === "completed" && (
                      <Check size={10} color="white" />
                    )}
                  </TouchableOpacity>
                  <Text
                    className={`text-sm font-medium flex-1 leading-snug ${
                      task.status === "completed"
                        ? "line-through text-white/30"
                        : "text-white"
                    }`}
                  >
                    {task.name}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2 mt-auto">
                  {project && (
                    <View className="bg-primary/10 px-2 py-0.5 rounded-md">
                      <Text
                        className="text-primary text-[10px] font-medium"
                        numberOfLines={1}
                      >
                        {project.name}
                      </Text>
                    </View>
                  )}
                  <Text className="text-white/30 text-[10px] ml-auto">
                    {task.dueTime}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

// ── Habits Today ──────────────────────────────────────────────
function HabitsTodaySection({
  habits,
  today,
}: {
  habits: Habit[];
  today: string;
}) {
  const toggleHabitComplete = useAppStore((s) => s.toggleHabitComplete);
  const router = useRouter();

  return (
    <View className="px-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-white text-base font-semibold">Habits Today</Text>
        <TouchableOpacity
          onPress={() => router.push("/calendar" as any)}
          className="flex-row items-center gap-1.5"
        >
          <Calendar size={14} color="#6C3FC5" />
          <Text className="text-primary text-xs font-medium">Calendar</Text>
        </TouchableOpacity>
      </View>
      {habits.length === 0 ? (
        <Text className="text-white/40 text-sm py-4">No habits for today.</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          {habits.map((habit) => {
            const completed = habit.completedDates.includes(today);
            return (
              <View
                key={habit.id}
                className="w-44 p-4 rounded-2xl bg-white/5 border border-white/10 items-center gap-3"
              >
                <Text className="text-white text-sm font-medium text-center leading-snug">
                  {habit.name}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Flame size={14} color="#F59E0B" />
                  <Text className="text-accent text-xs font-semibold">
                    {habit.streak}
                  </Text>
                </View>
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
          })}
        </ScrollView>
      )}
    </View>
  );
}
