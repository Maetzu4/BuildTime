import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useAppStore } from "../../lib/store";

// Función auxiliar de fecha ISO simplificada
function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export function SummaryCard() {
  const { colors } = useTheme();
  // Obtiene datos crudos del store
  const { tasks, habits } = useAppStore();
  const today = todayStr();

  // Calcula tareas esperadas para hoy vs las ya realizadas
  const totalTasks = tasks.filter((t) => t.dueDate === today).length;
  const completedTasks = tasks.filter(
    (t) => t.dueDate === today && t.status === "completed",
  ).length;

  // Calcula hábitos a cumplir hoy vs los ya chequeados
  const totalHabits = habits.filter(
    (h) => h.frequency === "daily" || h.weeklyDays.includes(new Date().getDay()),
  ).length;
  const completedHabits = habits.filter(
    (h) =>
      (h.frequency === "daily" || h.weeklyDays.includes(new Date().getDay())) &&
      h.completedDates.includes(today),
  ).length;

  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceVariant }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.onSurface }]}>Resumen del Día</Text>
        <Text style={[styles.date, { color: colors.onSurfaceVariant }]}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <MaterialCommunityIcons name="check-circle-outline" size={24} color={colors.primary} />
          <View style={styles.statText}>
            <Text style={{ color: colors.onSurface, fontWeight: "bold", fontSize: 18 }}>
              {completedTasks}/{totalTasks}
            </Text>
            <Text style={{ color: colors.onSurfaceVariant, fontSize: 12 }}>Tareas</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statBox}>
          <MaterialCommunityIcons name="fire" size={24} color="#F59E0B" />
          <View style={styles.statText}>
            <Text style={{ color: colors.onSurface, fontWeight: "bold", fontSize: 18 }}>
              {completedHabits}/{totalHabits}
            </Text>
            <Text style={{ color: colors.onSurfaceVariant, fontSize: 12 }}>Hábitos</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  date: {
    fontSize: 12,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  statText: {
    justifyContent: "center",
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(150,150,150,0.2)",
    marginHorizontal: 16,
  },
});
