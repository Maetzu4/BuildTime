import { CreateTaskSheet } from "@/components/create-sheets";
import { FAB } from "@/components/fab";
import { ChipFilter, ProjectFilterStrip } from "@/components/filter-chips";
import { TopAppBar } from "@/components/top-app-bar";
import { useAppStore } from "@/lib/store";
import type { Project, Task } from "@/lib/types";
import { useRouter } from "expo-router";
import { Calendar, Check, Trash2 } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

const TASK_FILTERS = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "To do", value: "todo" },
  { label: "Completed", value: "completed" },
  { label: "Overdue", value: "overdue" },
];

function priorityColor(p: string) {
  if (p === "high") return { bg: "bg-red-500/15", text: "text-red-400" };
  if (p === "medium") return { bg: "bg-accent/15", text: "text-accent" };
  return { bg: "bg-white/10", text: "text-white/40" };
}

function statusColor(s: string) {
  if (s === "completed")
    return { bg: "bg-green-500/15", text: "text-green-400" };
  if (s === "overdue") return { bg: "bg-red-500/15", text: "text-red-400" };
  return { bg: "bg-secondary/15", text: "text-secondary" };
}

// ── Swipeable Task Row ────────────────────────────────────────
function SwipeableTask({
  task,
  projects,
}: {
  task: Task;
  projects: Project[];
}) {
  const { toggleTask, deleteTask } = useAppStore();
  const translateX = useRef(new Animated.Value(0)).current;
  const today = todayStr();
  const project = projects.find((p) => p.id === task.projectId);
  const isOverdue = task.status === "todo" && task.dueDate < today;
  const displayStatus = isOverdue ? "overdue" : task.status;
  const pc = priorityColor(task.priority);
  const sc = statusColor(displayStatus);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10,
      onPanResponderMove: (_, g) => translateX.setValue(g.dx),
      onPanResponderRelease: (_, g) => {
        if (g.dx < -80) {
          Animated.timing(translateX, {
            toValue: -400,
            duration: 200,
            useNativeDriver: true,
          }).start(() => deleteTask(task.id));
        } else if (g.dx > 80) {
          toggleTask(task.id);
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <View className="rounded-2xl overflow-hidden mb-2">
      {/* Swipe backgrounds */}
      <View className="absolute inset-0 flex-row">
        <View
          className="flex-1 bg-green-500/20 items-center justify-center"
          style={{ alignItems: "flex-start", paddingLeft: 20 }}
        >
          <Check size={20} color="#4ade80" />
        </View>
        <View
          className="flex-1 bg-red-500/20 items-center justify-center"
          style={{ alignItems: "flex-end", paddingRight: 20 }}
        >
          <Trash2 size={20} color="#f87171" />
        </View>
      </View>

      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...panResponder.panHandlers}
        className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center gap-3"
      >
        <TouchableOpacity
          onPress={() => toggleTask(task.id)}
          className={`w-6 h-6 rounded-lg border-2 items-center justify-center ${
            task.status === "completed"
              ? "bg-primary border-primary"
              : "border-white/30"
          }`}
        >
          {task.status === "completed" && <Check size={14} color="white" />}
        </TouchableOpacity>

        <View className="flex-1 min-w-0">
          <Text
            className={`text-sm font-medium ${
              task.status === "completed"
                ? "line-through text-white/30"
                : "text-white"
            }`}
            numberOfLines={1}
          >
            {task.name}
          </Text>
          <View className="flex-row items-center gap-2 mt-1">
            <Text className="text-white/30 text-[10px]">
              {task.dueDate === today ? task.dueTime : task.dueDate}
            </Text>
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
          </View>
        </View>

        <View className="items-end gap-1">
          <View className={`px-2 py-0.5 rounded-md ${sc.bg}`}>
            <Text className={`text-[10px] font-semibold ${sc.text}`}>
              {displayStatus}
            </Text>
          </View>
          <View className={`px-2 py-0.5 rounded-md ${pc.bg}`}>
            <Text className={`text-[10px] font-medium ${pc.text}`}>
              {task.priority}
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

// ── MiniStatsCard ─────────────────────────────────────────────
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

// ── Screen ────────────────────────────────────────────────────
export default function TasksScreen() {
  const { tasks, projects, selectedProjectFilter } = useAppStore();
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const router = useRouter();
  const today = todayStr();

  const completedCount = tasks.filter((t) => t.status === "completed").length;

  let filtered = tasks.filter(
    (t) => !selectedProjectFilter || t.projectId === selectedProjectFilter,
  );
  if (filter === "today")
    filtered = filtered.filter((t) => t.dueDate === today);
  else if (filter === "todo")
    filtered = filtered.filter((t) => t.status === "todo");
  else if (filter === "completed")
    filtered = filtered.filter((t) => t.status === "completed");
  else if (filter === "overdue")
    filtered = filtered.filter((t) => t.status === "todo" && t.dueDate < today);

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <TopAppBar title="Tasks" showAvatar />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Stats */}
        <View className="flex-row gap-3 px-4 mb-4 mt-2">
          <MiniStatsCard
            label="Completed"
            value={completedCount}
            subtitle={`of ${tasks.length} tasks`}
          />
          <MiniStatsCard
            label="Today"
            value={
              tasks.filter((t) => t.dueDate === today && t.status === "todo")
                .length
            }
            subtitle="tasks remaining"
          />
        </View>

        <ProjectFilterStrip />

        {/* Filters + Calendar */}
        <View className="flex-row items-center gap-2 px-4 mt-4 mb-2">
          <View className="flex-1">
            <ChipFilter
              options={TASK_FILTERS}
              selected={filter}
              onChange={setFilter}
            />
          </View>
          <TouchableOpacity
            onPress={() => router.push("/calendar" as any)}
            className="w-9 h-9 rounded-lg bg-white/10 items-center justify-center ml-2"
          >
            <Calendar size={16} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>
        </View>

        {/* Task list */}
        <View className="px-4 mt-2">
          {filtered.length === 0 ? (
            <Text className="text-white/40 text-sm text-center py-8">
              No tasks match this filter.
            </Text>
          ) : (
            filtered.map((task) => (
              <SwipeableTask key={task.id} task={task} projects={projects} />
            ))
          )}
        </View>
      </ScrollView>

      <FAB label="New Task" onPress={() => setShowCreate(true)} />
      <CreateTaskSheet open={showCreate} onClose={() => setShowCreate(false)} />
    </SafeAreaView>
  );
}
