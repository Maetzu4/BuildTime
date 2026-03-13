import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useAppStore } from "../../lib/store";
import { Project, Task } from "../../lib/types";

export function TasksTodaySection({
  tasks,
  projects,
}: {
  tasks: Task[];
  projects: Project[];
}) {
  const { colors } = useTheme();
  // Acción del store para alternar el estado (completado/pendiente) de una tarea
  const toggleTask = useAppStore((s) => s.toggleTask);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.onBackground }]}>
          Tareas de Hoy
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/calendar" as any)}
          style={styles.calendarBtn}
        >
          <MaterialCommunityIcons
            name="calendar"
            size={14}
            color={colors.primary}
          />
          <Text style={[styles.calendarText, { color: colors.primary }]}>
            Calendario
          </Text>
        </TouchableOpacity>
      </View>

      {tasks.length === 0 ? (
        <View
          style={[
            styles.emptyState,
            {
              backgroundColor: colors.surfaceVariant,
              borderColor: colors.outlineVariant,
            },
          ]}
        >
          <Text style={styles.emptyEmoji}>🎉</Text>
          <Text
            style={[styles.emptyText, { color: colors.onSurfaceVariant }]}
          >
            No hay tareas para hoy
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {tasks.map((task) => {
            // Buscamos el proyecto al que pertenece esta tarea para mostrar su etiqueta
            const project = projects.find((p) => p.id === task.projectId);
            const isCompleted = task.status === "completed";

            return (
              <View
                key={task.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.surfaceVariant,
                    borderColor: colors.outlineVariant,
                  },
                ]}
              >
                <View style={styles.cardTop}>
                  <TouchableOpacity
                    onPress={() => toggleTask(task.id)}
                    style={[
                      styles.checkbox,
                      {
                        borderColor: isCompleted
                          ? colors.primary
                          : colors.outline,
                        backgroundColor: isCompleted
                          ? colors.primary
                          : "transparent",
                      },
                    ]}
                  >
                    {isCompleted && (
                      <MaterialCommunityIcons
                        name="check"
                        size={12}
                        color={colors.onPrimary}
                      />
                    )}
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.taskName,
                      {
                        color: isCompleted
                          ? colors.onSurfaceVariant
                          : colors.onSurface,
                        textDecorationLine: isCompleted
                          ? "line-through"
                          : "none",
                      },
                    ]}
                  >
                    {task.name}
                  </Text>
                </View>
                <View style={styles.cardBottom}>
                  {project && (
                    <View
                      style={[
                        styles.projectChip,
                        { backgroundColor: colors.primaryContainer },
                      ]}
                    >
                      <Text
                        style={[
                          styles.projectChipText,
                          { color: colors.onPrimaryContainer },
                        ]}
                        numberOfLines={1}
                      >
                        {project.name}
                      </Text>
                    </View>
                  )}
                  <Text
                    style={[
                      styles.dueTime,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    {task.dueTime}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  calendarBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  calendarText: {
    fontSize: 12,
    fontWeight: "500",
  },
  emptyState: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 220,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    minHeight: 100,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  taskName: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    lineHeight: 20,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: "auto",
  },
  projectChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  projectChipText: {
    fontSize: 10,
    fontWeight: "500",
    maxWidth: 100,
  },
  dueTime: {
    fontSize: 10,
    marginLeft: "auto",
  },
});
