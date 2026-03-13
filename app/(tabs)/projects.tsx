import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useAppStore } from "../../lib/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ProjectsScreen() {
  const { colors } = useTheme();
  const projects = useAppStore((s) => s.projects);
  const tasks = useAppStore((s) => s.tasks);
  const habits = useAppStore((s) => s.habits);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
          Mis Proyectos ({projects.length})
        </Text>

        <View style={styles.list}>
          {projects.map((project) => {
            const projectTasks = tasks.filter((t) => t.projectId === project.id);
            const projectHabits = habits.filter(
              (h) => h.projectId === project.id,
            );

            return (
              <View
                key={project.id}
                style={[
                  styles.previewCard,
                  { backgroundColor: project.color || colors.primaryContainer },
                ]}
              >
                <View style={styles.cardHeader}>
                  <MaterialCommunityIcons
                    name={
                      (project.icon as any) || "folder"
                    }
                    size={32}
                    color="#fff"
                  />
                  <Text
                    variant="titleLarge"
                    style={{ color: "#fff", marginLeft: 16, fontWeight: "bold" }}
                  >
                    {project.name}
                  </Text>
                </View>

                <View style={styles.statsRow}>
                  <Text style={styles.statText}>
                    {projectTasks.length} Tareas
                  </Text>
                  <Text style={styles.statDot}>•</Text>
                  <Text style={styles.statText}>
                    {projectHabits.length} Hábitos
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {projects.length === 0 && (
          <Text style={{ color: colors.onSurfaceVariant, marginTop: 16 }}>
            Aún no tienes proyectos creados.
          </Text>
        )}
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  list: {
    gap: 16,
  },
  previewCard: {
    borderRadius: 20,
    padding: 20,
    width: "100%",
    elevation: 2, // shadow for android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    opacity: 0.9,
  },
  statText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  statDot: {
    color: "#fff",
    marginHorizontal: 8,
    fontSize: 14,
  },
});
