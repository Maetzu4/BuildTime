import { ChipFilter } from "@/components/filter-chips";
import { TopAppBar } from "@/components/top-app-bar";
import { useAppStore } from "@/lib/store";
import {
  ArrowLeft,
  CheckSquare,
  ChevronRight,
  Repeat,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PROJECT_FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Short term", value: "short" },
  { label: "Mid term", value: "mid" },
  { label: "Long term", value: "long" },
];

function timelineLabel(t: string) {
  if (t === "short") return "Short term";
  if (t === "mid") return "Mid term";
  return "Long term";
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

export default function ProjectsScreen() {
  const { projects, tasks, habits } = useAppStore();
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  const activeCount = projects.filter((p) => p.status === "active").length;
  const completedCount = projects.filter(
    (p) => p.status === "completed",
  ).length;

  let filtered = [...projects];
  if (filter === "active")
    filtered = filtered.filter((p) => p.status === "active");
  else if (filter === "completed")
    filtered = filtered.filter((p) => p.status === "completed");
  else if (filter === "short" || filter === "mid" || filter === "long")
    filtered = filtered.filter((p) => p.timeline === filter);

  // ── Detail View ─────────────────────────────────────────────
  if (detailId) {
    const project = projects.find((p) => p.id === detailId);
    if (!project) return null;
    const projectTasks = tasks.filter((t) => t.projectId === project.id);
    const projectHabits = habits.filter((h) => h.projectId === project.id);
    const completedTasks = projectTasks.filter(
      (t) => t.status === "completed",
    ).length;
    const progress =
      projectTasks.length > 0
        ? (completedTasks / projectTasks.length) * 100
        : 0;
    const ss = statusStyle(project.status);

    return (
      <SafeAreaView className="flex-1 bg-dark">
        {/* Header */}
        <View className="flex-row items-center gap-3 h-16 px-4">
          <TouchableOpacity
            onPress={() => setDetailId(null)}
            className="w-10 h-10 rounded-full items-center justify-center bg-white/5"
          >
            <ArrowLeft size={20} color="white" />
          </TouchableOpacity>
          <Text
            className="text-white text-xl font-semibold flex-1"
            numberOfLines={1}
          >
            {project.name}
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 100 }}
        >
          {/* Project info card */}
          <View className="p-5 rounded-2xl bg-white/5 border border-white/10 gap-3">
            <View className="flex-row items-center justify-between">
              <View className={`px-2 py-0.5 rounded-md ${ss.bg}`}>
                <Text className={`text-xs font-semibold ${ss.text}`}>
                  {project.status}
                </Text>
              </View>
              <View className="bg-white/10 px-2 py-0.5 rounded-md">
                <Text className="text-white/40 text-xs font-medium">
                  {timelineLabel(project.timeline)}
                </Text>
              </View>
            </View>
            {project.description ? (
              <Text className="text-white/50 text-sm leading-relaxed">
                {project.description}
              </Text>
            ) : null}
            <View className="flex-row items-center gap-2">
              <ProgressBar value={progress} />
              <Text className="text-white text-xs font-semibold">
                {Math.round(progress)}%
              </Text>
            </View>
            <Text className="text-white/30 text-[10px]">
              Due: {project.targetDate}
            </Text>
          </View>

          {/* Tasks */}
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <CheckSquare size={16} color="#3B82F6" />
              <Text className="text-white text-sm font-semibold">
                Tasks ({projectTasks.length})
              </Text>
            </View>
            {projectTasks.length === 0 ? (
              <Text className="text-white/30 text-xs">
                No tasks linked to this project.
              </Text>
            ) : (
              <View className="gap-2">
                {projectTasks.map((t) => (
                  <View
                    key={t.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex-row items-center gap-3"
                  >
                    <View
                      className={`w-2 h-2 rounded-full ${t.status === "completed" ? "bg-green-400" : "bg-secondary"}`}
                    />
                    <Text
                      numberOfLines={1}
                      className={`text-sm flex-1 ${t.status === "completed" ? "line-through text-white/30" : "text-white"}`}
                    >
                      {t.name}
                    </Text>
                    <Text className="text-white/30 text-[10px]">
                      {t.dueDate}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Habits */}
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <Repeat size={16} color="#F59E0B" />
              <Text className="text-white text-sm font-semibold">
                Habits ({projectHabits.length})
              </Text>
            </View>
            {projectHabits.length === 0 ? (
              <Text className="text-white/30 text-xs">
                No habits linked to this project.
              </Text>
            ) : (
              <View className="gap-2">
                {projectHabits.map((h) => (
                  <View
                    key={h.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex-row items-center gap-3"
                  >
                    <Text
                      numberOfLines={1}
                      className="text-white text-sm flex-1"
                    >
                      {h.name}
                    </Text>
                    <Text className="text-accent text-xs font-semibold">
                      {h.streak} streak
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── List View ────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-dark">
      <TopAppBar title="Projects" showAvatar />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100, gap: 16, paddingTop: 8 }}
      >
        {/* Stats */}
        <View className="flex-row gap-3 px-4">
          <MiniStatsCard
            label="Active"
            value={activeCount}
            subtitle="projects"
          />
          <MiniStatsCard
            label="Completed"
            value={completedCount}
            subtitle="projects"
          />
        </View>

        <ChipFilter
          options={PROJECT_FILTERS}
          selected={filter}
          onChange={setFilter}
        />

        {/* Project cards */}
        <View className="px-4 gap-3">
          {filtered.length === 0 ? (
            <Text className="text-white/40 text-sm text-center py-8">
              No projects match this filter.
            </Text>
          ) : (
            filtered.map((project) => {
              const projectTasks = tasks.filter(
                (t) => t.projectId === project.id,
              );
              const projectHabits = habits.filter(
                (h) => h.projectId === project.id,
              );
              const completedTasks = projectTasks.filter(
                (t) => t.status === "completed",
              ).length;
              const progress =
                projectTasks.length > 0
                  ? (completedTasks / projectTasks.length) * 100
                  : 0;
              const ss = statusStyle(project.status);

              return (
                <TouchableOpacity
                  key={project.id}
                  onPress={() => setDetailId(project.id)}
                  activeOpacity={0.8}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 gap-3"
                >
                  <View className="flex-row items-center justify-between">
                    <Text
                      className="text-white text-sm font-semibold flex-1"
                      numberOfLines={1}
                    >
                      {project.name}
                    </Text>
                    <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                  </View>

                  <View className="flex-row items-center gap-2 flex-wrap">
                    <View className="bg-white/10 px-2 py-0.5 rounded">
                      <Text className="text-white/40 text-[10px] font-medium">
                        {timelineLabel(project.timeline)}
                      </Text>
                    </View>
                    <Text className="text-white/30 text-[10px]">
                      Due: {project.targetDate}
                    </Text>
                    <View className={`px-2 py-0.5 rounded ${ss.bg}`}>
                      <Text className={`text-[10px] font-semibold ${ss.text}`}>
                        {project.status}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <ProgressBar value={progress} />
                    <Text className="text-white text-[10px] font-semibold">
                      {Math.round(progress)}%
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <View className="flex-row items-center gap-1">
                      <CheckSquare size={12} color="rgba(255,255,255,0.3)" />
                      <Text className="text-white/30 text-[10px]">
                        {projectTasks.length} tasks
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Repeat size={12} color="rgba(255,255,255,0.3)" />
                      <Text className="text-white/30 text-[10px]">
                        {projectHabits.length} habits
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
