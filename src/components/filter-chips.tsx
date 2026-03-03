import { useAppStore } from "@/lib/store";
import { staggerFadeUp } from "@/utils/animations";
import { Plus } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";

export function ProjectFilterStrip({
  onNewProject,
}: {
  onNewProject?: () => void;
}) {
  const { projects, selectedProjectFilter, setProjectFilter } = useAppStore();
  const activeProjects = projects.filter((p) => p.status === "active");

  const allItems = [
    { id: null, name: "All" },
    ...activeProjects.map((p) => ({ id: p.id, name: p.name })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-4"
      contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
    >
      {allItems.map((item, i) => (
        <Animated.View key={item.id ?? "all"} entering={staggerFadeUp(i)}>
          <TouchableOpacity
            onPress={() => setProjectFilter(item.id)}
            className={`h-9 px-4 rounded-lg items-center justify-center ${
              selectedProjectFilter === item.id ? "bg-primary" : "bg-white/10"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedProjectFilter === item.id
                  ? "text-white"
                  : "text-white/50"
              }`}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ))}

      {onNewProject && (
        <Animated.View entering={staggerFadeUp(allItems.length)}>
          <TouchableOpacity
            onPress={onNewProject}
            className="h-9 px-3 rounded-lg bg-white/10 flex-row items-center gap-1"
          >
            <Plus size={16} color="rgba(255,255,255,0.5)" />
            <Text className="text-white/50 text-sm font-medium">New</Text>
          </TouchableOpacity>
        </Animated.View>
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
      {options.map((o, i) => (
        <Animated.View key={o.value} entering={staggerFadeUp(i)}>
          <TouchableOpacity
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
        </Animated.View>
      ))}
    </ScrollView>
  );
}
