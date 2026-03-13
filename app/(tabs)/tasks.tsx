import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useAppStore } from "../../lib/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TasksScreen() {
  const { colors } = useTheme();
  const tasks = useAppStore((s) => s.tasks);
  const projects = useAppStore((s) => s.projects);
  const toggleTask = useAppStore((s) => s.toggleTask);

  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const renderTask = (task: any) => {
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
                borderColor: isCompleted ? colors.primary : colors.outline,
                backgroundColor: isCompleted ? colors.primary : "transparent",
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
                color: isCompleted ? colors.onSurfaceVariant : colors.onSurface,
                textDecorationLine: isCompleted ? "line-through" : "none",
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
                { backgroundColor: project.color || colors.primaryContainer },
              ]}
            >
              <Text
                style={[
                  styles.projectChipText,
                  { color: "#fff" }, // Assuming dark project colors
                ]}
                numberOfLines={1}
              >
                {project.name}
              </Text>
            </View>
          )}
          <Text style={[styles.dueTime, { color: colors.onSurfaceVariant }]}>
            {task.dueDate} • {task.dueTime}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
          Pendientes ({pendingTasks.length})
        </Text>
        {pendingTasks.map(renderTask)}
        {pendingTasks.length === 0 && (
          <Text style={{ color: colors.onSurfaceVariant, marginVertical: 16 }}>
            ¡Todo al día! 🎉
          </Text>
        )}

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.onBackground, marginTop: 24 },
          ]}
        >
          Completadas ({completedTasks.length})
        </Text>
        {completedTasks.map(renderTask)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  card: {
    width: "100%",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
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
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
    lineHeight: 22,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  projectChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  projectChipText: {
    fontSize: 10,
    fontWeight: "600",
  },
  dueTime: {
    fontSize: 12,
    marginLeft: "auto",
  },
});
