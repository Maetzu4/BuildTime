import { usePathname } from "expo-router";
import { CheckSquare, FolderOpen, Plus, Repeat, X } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const HIDDEN_ON = ["/profile", "/settings", "/achievements", "/statistics"];

interface FABProps {
  onCreateTask: () => void;
  onCreateHabit: () => void;
  onCreateProject: () => void;
}

interface Action {
  icon: any;
  label: string;
  action: () => void;
}

export function FAB({
  onCreateTask,
  onCreateHabit,
  onCreateProject,
}: FABProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  if (HIDDEN_ON.includes(pathname)) return null;

  function getContextActions(): Action[] {
    switch (pathname) {
      case "/tasks":
        return [{ icon: CheckSquare, label: "New Task", action: onCreateTask }];
      case "/habits":
        return [{ icon: Repeat, label: "New Habit", action: onCreateHabit }];
      case "/projects":
        return [
          { icon: FolderOpen, label: "New Project", action: onCreateProject },
        ];
      case "/calendar":
        return [
          { icon: CheckSquare, label: "New Task", action: onCreateTask },
          { icon: Repeat, label: "New Habit", action: onCreateHabit },
        ];

      default:
        return [
          { icon: CheckSquare, label: "New Task", action: onCreateTask },
          { icon: Repeat, label: "New Habit", action: onCreateHabit },
          { icon: FolderOpen, label: "New Project", action: onCreateProject },
        ];
    }
  }

  const actions = getContextActions();
  const isSingleAction = actions.length === 1;

  function handlePress() {
    if (isSingleAction) {
      actions[0].action();
    } else {
      setExpanded((v) => !v);
    }
  }

  return (
    <View className="absolute bottom-24 right-4 z-50 items-end gap-3">
      {/* Sub-actions */}
      {expanded && !isSingleAction && (
        <View className="items-end gap-3 mb-1">
          {actions.map((act) => (
            <TouchableOpacity
              key={act.label}
              onPress={() => {
                act.action();
                setExpanded(false);
              }}
              activeOpacity={0.8}
              className="flex-row items-center gap-3"
            >
              <View className="bg-white/10 px-3 py-1.5 rounded-lg">
                <Text className="text-white text-sm font-medium">
                  {act.label}
                </Text>
              </View>
              <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
                <act.icon size={20} color="#6C3FC5" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Main FAB */}
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        className={`h-14 bg-primary rounded-2xl flex-row items-center gap-2 px-4 ${
          isSingleAction ? "" : "min-w-14 justify-center"
        }`}
      >
        {expanded ? (
          <X size={24} color="white" />
        ) : (
          <Plus size={24} color="white" />
        )}
        {isSingleAction && (
          <Text className="text-white text-sm font-semibold">
            {actions[0].label}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
