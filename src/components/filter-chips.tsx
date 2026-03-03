import { useAppStore } from "@/lib/store";
import { Plus } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity } from "react-native";

export function ProjectFilterStrip({
  onNewProject,
}: {
  onNewProject?: () => void;
}) {
  const { projects, selectedProjectFilter, setProjectFilter } = useAppStore();
  const activeProjects = projects.filter((p) => p.status === "active");

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-4"
      contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
    >
      <TouchableOpacity
        onPress={() => setProjectFilter(null)}
        className={`h-9 px-4 rounded-lg items-center justify-center ${
          selectedProjectFilter === null ? "bg-primary" : "bg-white/10"
        }`}
      >
        <Text
          className={`text-sm font-medium ${
            selectedProjectFilter === null ? "text-white" : "text-white/50"
          }`}
        >
          All
        </Text>
      </TouchableOpacity>

      {activeProjects.map((p) => (
        <TouchableOpacity
          key={p.id}
          onPress={() => setProjectFilter(p.id)}
          className={`h-9 px-4 rounded-lg items-center justify-center max-w-[140px] ${
            selectedProjectFilter === p.id ? "bg-primary" : "bg-white/10"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              selectedProjectFilter === p.id ? "text-white" : "text-white/50"
            }`}
            numberOfLines={1}
          >
            {p.name}
          </Text>
        </TouchableOpacity>
      ))}

      {onNewProject && (
        <TouchableOpacity
          onPress={onNewProject}
          className="h-9 px-3 rounded-lg bg-white/10 flex-row items-center gap-1"
        >
          <Plus size={16} color="rgba(255,255,255,0.5)" />
          <Text className="text-white/50 text-sm font-medium">New</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

export function ChipFilter({
  options,
  selected,
  onChange,
}: {
  options: { label: string; value: string }[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-4"
      contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
    >
      {options.map((o) => (
        <TouchableOpacity
          key={o.value}
          onPress={() => onChange(o.value)}
          className={`h-8 px-3 rounded-lg items-center justify-center ${
            selected === o.value ? "bg-secondary" : "bg-white/10"
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              selected === o.value ? "text-white" : "text-white/50"
            }`}
          >
            {o.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
