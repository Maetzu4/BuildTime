import React from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "react-native-paper";
import { HabitsTodaySection } from "../../components/home/HabitsTodaySection";
import { ProjectFilterStrip } from "../../components/home/ProjectFilterStrip";
import { SummaryCard } from "../../components/home/SummaryCard";
import { TasksTodaySection } from "../../components/home/TasksTodaySection";
import { useAppStore } from "../../lib/store";

// Función auxiliar para obtener la fecha de hoy en formato YYYY-MM-DD
function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function Home() {
  const { colors } = useTheme();
  const { tasks, habits, projects, homeSections, selectedProjectFilter } =
    useAppStore();

  const today = todayStr();

  // Filtramos las tareas para mostrar solo las de hoy,
  // y aplicamos también el filtro de proyecto seleccionado (si lo hay)
  const filteredTasks = tasks
    .filter((t) => t.dueDate === today)
    .filter(
      (t) => !selectedProjectFilter || t.projectId === selectedProjectFilter,
    );

  // Filtramos los hábitos para mostrar los diarios o los que tocan hoy (según día de la semana),
  // y aplicamos también el filtro de proyecto
  const filteredHabits = habits
    .filter(
      (h) =>
        h.frequency === "daily" || h.weeklyDays.includes(new Date().getDay()),
    )
    .filter(
      (h) => !selectedProjectFilter || h.projectId === selectedProjectFilter,
    );

  // sectionMap centraliza qué componente dibujar según su ID
  const sectionMap: Record<string, React.ReactNode> = {
    summary: <SummaryCard key="summary" />,
    "projects-filter": <ProjectFilterStrip key="filter" />,
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Scroll global para permitir navegar todas las secciones de una vez */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ gap: 24, paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Renderiza las secciones del Home dinámicamente basadas en el Store.
            Se filtran las visibles y se ordenan según la propiedad 'order' */}
        {homeSections
          .filter((s) => s.visible)
          .sort((a, b) => a.order - b.order)
          .map((s) => (
            <View key={s.id}>{sectionMap[s.id]}</View>
          ))}
      </ScrollView>
    </View>
  );
}
