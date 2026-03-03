import { ChipFilter, ProjectFilterStrip } from "@/components/filter-chips";
import { TopAppBar } from "@/components/top-app-bar";
import { useAppStore } from "@/lib/store";
import type { Project, Task } from "@/lib/types";
import { fadeUp, staggerFadeUp } from "@/utils/animations";
import { useRouter } from "expo-router";
import { Calendar, Check, Trash2 } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ReAnimated from "react-native-reanimated";
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

function priorityStyle(p: string) {
  if (p === "high") return { bg: "bg-red-500/15", text: "text-red-400" };
  if (p === "medium") return { bg: "bg-accent/15", text: "text-accent" };
  return { bg: "bg-white/10", text: "text-white/40" };
}

function statusStyle(s: string) {
  if (s === "completed")
    return { bg: "bg-green-500/15", text: "text-green-400" };
  if (s === "overdue") return { bg: "bg-red-500/15", text: "text-red-400" };
  return { bg: "bg-secondary/15", text: "text-secondary" };
}

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

// ── Task Row ──────────────────────────────────────────────────
function TaskRow({
  task,
  projects,
  swipeX,
  isSwiping,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  index,
}: {
  task: Task;
  projects: Project[];
  swipeX: number;
  isSwiping: boolean;
  onTouchStart: () => void;
  onTouchMove: (dx: number) => void;
  onTouchEnd: () => void;
  index: number;
}) {
  const toggleTask = useAppStore((s) => s.toggleTask);
  const today = todayStr();
  const project = projects.find((p) => p.id === task.projectId);
  const isOverdue = task.status === "todo" && task.dueDate < today;
  const displayStatus = isOverdue ? "overdue" : task.status;
  const ps = priorityStyle(task.priority);
  const ss = statusStyle(displayStatus);
  const touchStartX = useRef(0);

  return (
    <ReAnimated.View entering={staggerFadeUp(index)}>
      <View
        className="relative rounded-2xl overflow-hidden mb-2"
        style={{ height: 72 }}
      >
        {/* Swipe backgrounds */}
        <View className="absolute inset-0 flex-row">
          <View className="flex-1 bg-green-500/20 justify-center pl-5">
            <Check size={20} color="#4ade80" />
          </View>
          <View className="flex-1 bg-red-500/20 items-end justify-center pr-5">
            <Trash2 size={20} color="#f87171" />
          </View>
        </View>

        {/* Card */}
        <Animated.View
          style={{ transform: [{ translateX: isSwiping ? swipeX : 0 }] }}
          onStartShouldSetResponder={() => true}
          onResponderGrant={(e) => {
            touchStartX.current = e.nativeEvent.pageX;
            onTouchStart();
          }}
          onResponderMove={(e) => {
            onTouchMove(e.nativeEvent.pageX - touchStartX.current);
          }}
          onResponderRelease={onTouchEnd}
          className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center gap-3"
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
              numberOfLines={1}
              className={`text-sm font-medium ${
                task.status === "completed"
                  ? "line-through text-white/30"
                  : "text-white"
              }`}
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
            <View className={`px-2 py-0.5 rounded-md ${ss.bg}`}>
              <Text className={`text-[10px] font-semibold ${ss.text}`}>
                {displayStatus}
              </Text>
            </View>
            <View className={`px-2 py-0.5 rounded-md ${ps.bg}`}>
              <Text className={`text-[10px] font-medium ${ps.text}`}>
                {task.priority}
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </ReAnimated.View>
  );
}

// ── Screen ────────────────────────────────────────────────────
export default function TasksScreen() {
  const { tasks, projects, selectedProjectFilter, deleteTask, toggleTask } =
    useAppStore();
  const [filter, setFilter] = useState("all");
  const [swipingId, setSwipingId] = useState<string | null>(null);
  const [swipeX, setSwipeX] = useState(0);
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

  function handleTouchStart(id: string) {
    setSwipingId(id);
    setSwipeX(0);
  }

  function handleTouchMove(dx: number) {
    if (!swipingId) return;
    setSwipeX(dx);
  }

  function handleTouchEnd() {
    if (!swipingId) return;
    if (swipeX < -80) deleteTask(swipingId);
    else if (swipeX > 80) toggleTask(swipingId);
    setSwipingId(null);
    setSwipeX(0);
  }

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <TopAppBar title="Tasks" showAvatar />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100, gap: 16, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <ReAnimated.View
          entering={staggerFadeUp(0)}
          className="flex-row gap-3 px-4"
        >
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
        </ReAnimated.View>

        <ReAnimated.View entering={staggerFadeUp(1)}>
          <ProjectFilterStrip />
        </ReAnimated.View>

        {/* Filters + Calendar */}
        <ReAnimated.View
          entering={staggerFadeUp(2)}
          className="flex-row items-center gap-2 px-4"
        >
          <View className="flex-1">
            <ChipFilter
              options={TASK_FILTERS}
              selected={filter}
              onChange={setFilter}
            />
          </View>
          <TouchableOpacity
            onPress={() => router.push("/calendar" as any)}
            className="w-9 h-9 rounded-lg bg-white/10 items-center justify-center"
          >
            <Calendar size={16} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>
        </ReAnimated.View>

        {/* Task list */}
        <View className="px-4">
          {filtered.length === 0 ? (
            <ReAnimated.View entering={fadeUp} className="items-center py-8">
              <Text className="text-3xl mb-2">📋</Text>
              <Text className="text-white/40 text-sm">
                No tasks match this filter
              </Text>
            </ReAnimated.View>
          ) : (
            filtered.map((task, i) => (
              <TaskRow
                key={task.id}
                task={task}
                projects={projects}
                swipeX={swipeX}
                isSwiping={swipingId === task.id}
                onTouchStart={() => handleTouchStart(task.id)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                index={i + 3}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
