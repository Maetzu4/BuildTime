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
  // MEJORA 1: Rendimiento en Zustand.
  // En lugar de traer todo el array de `tasks` y filtrarlo en cada render,
  // hacemos que el selector devuelva directamente el número de tareas pendientes.
  // Así el Layout solo se re-renderiza cuando el número cambia, no cada vez que editas una tarea.
  const pendingTasks = useAppStore(
    (s) => s.tasks.filter((t) => t.status === "todo").length,
  );

  // Estados locales (Se mantienen igual, están perfectos)
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
        {/* MEJORA 2: Orden y limpieza de las opciones de cada Screen */}
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

      {/* Overlays globales (Mantenemos la misma estructura, es ideal para FABs y Modales) */}
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
