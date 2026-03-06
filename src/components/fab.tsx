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
              <View className="bg-m3-surface-container-high px-3 py-1.5 rounded-lg shadow-sm">
                <Text className="text-m3-on-surface text-sm font-medium">
                  {act.label}
                </Text>
              </View>
              <View className="w-10 h-10 rounded-full bg-m3-secondary-container items-center justify-center shadow-sm">
                <act.icon
                  size={20}
                  className="text-m3-on-secondary-container"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Main FAB */}
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        className={`h-14 bg-m3-primary-container rounded-2xl flex-row items-center gap-2 px-4 shadow-sm ${
          isSingleAction ? "" : "min-w-14 justify-center"
        }`}
      >
        {expanded ? (
          <X size={24} className="text-m3-on-primary-container" />
        ) : (
          <Plus size={24} className="text-m3-on-primary-container" />
        )}
        {isSingleAction && (
          <Text className="text-m3-on-primary-container text-sm font-semibold">
            {actions[0].label}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
