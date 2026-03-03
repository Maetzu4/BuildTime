import {
  CreateHabitSheet,
  CreateProjectSheet,
  CreateTaskSheet,
} from "@/components/create-sheets";
import { FAB } from "@/components/fab";
import { useAppStore } from "@/lib/store";
import { Tabs } from "expo-router";
import { CheckSquare, FolderKanban, Home, Repeat } from "lucide-react-native";
import { useState } from "react";

export default function TabsLayout() {
  const tasks = useAppStore((s) => s.tasks);
  const pendingTasks = tasks.filter((t) => t.status === "todo").length;
  const [taskSheet, setTaskSheet] = useState(false);
  const [habitSheet, setHabitSheet] = useState(false);
  const [projectSheet, setProjectSheet] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#1E1B26",
            borderTopColor: "#2C2838",
            height: 64,
          },
          tabBarActiveTintColor: "#6C3FC5",
          tabBarInactiveTintColor: "rgba(255,255,255,0.4)",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginBottom: 8,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <Home size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: "Tasks",
            tabBarIcon: ({ color }) => <CheckSquare size={20} color={color} />,
            tabBarBadge: pendingTasks > 0 ? pendingTasks : undefined,
            tabBarBadgeStyle: { backgroundColor: "#F87171", fontSize: 10 },
          }}
        />
        <Tabs.Screen
          name="habits"
          options={{
            title: "Habits",
            tabBarIcon: ({ color }) => <Repeat size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name="projects"
          options={{
            title: "Projects",
            tabBarIcon: ({ color }) => <FolderKanban size={20} color={color} />,
          }}
        />
      </Tabs>

      <FAB
        onCreateTask={() => setTaskSheet(true)}
        onCreateHabit={() => setHabitSheet(true)}
        onCreateProject={() => setProjectSheet(true)}
      />
      <CreateTaskSheet open={taskSheet} onClose={() => setTaskSheet(false)} />
      <CreateHabitSheet
        open={habitSheet}
        onClose={() => setHabitSheet(false)}
      />
      <CreateProjectSheet
        open={projectSheet}
        onClose={() => setProjectSheet(false)}
      />
    </>
  );
}
