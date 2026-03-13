import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useAppStore } from "../../lib/store";
import { Habit } from "../../lib/types";

export function HabitsTodaySection({
  habits,
  today,
}: {
  habits: Habit[];
  today: string;
}) {
  const { colors } = useTheme();
  // Acción del store para marcar/desmarcar un hábito
  const toggleHabitComplete = useAppStore((s) => s.toggleHabitComplete);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.onBackground }]}>
          Hábitos para Hoy
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

      {habits.length === 0 ? (
        <View
          style={[
            styles.emptyState,
            {
              backgroundColor: colors.surfaceVariant,
              borderColor: colors.outlineVariant,
            },
          ]}
        >
          <Text style={styles.emptyEmoji}>✨</Text>
          <Text
            style={[styles.emptyText, { color: colors.onSurfaceVariant }]}
          >
            No hay hábitos programados
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {habits.map((habit) => {
            // Verifica si el hábito ya fue completado este día
            const completed = habit.completedDates.includes(today);

            return (
              <View
                key={habit.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.surfaceVariant,
                    borderColor: colors.outlineVariant,
                  },
                ]}
              >
                <Text
                  style={[styles.habitName, { color: colors.onSurface }]}
                  numberOfLines={2}
                >
                  {habit.name}
                </Text>

                <View style={styles.streakRow}>
                  <MaterialCommunityIcons name="fire" size={14} color="#F59E0B" />
                  <Text style={styles.streakText}>{habit.streak}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => toggleHabitComplete(habit.id)}
                  style={[
                    styles.circleBtn,
                    {
                      borderColor: completed ? colors.primary : colors.outline,
                      backgroundColor: completed
                        ? colors.primary
                        : "transparent",
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="check"
                    size={24}
                    color={completed ? colors.onPrimary : colors.outline}
                  />
                </TouchableOpacity>
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
    marginBottom: 20, // Add bottom margin since it's the last section usually
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
    width: 160,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 12,
  },
  habitName: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
    minHeight: 40,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  streakText: {
    color: "#F59E0B",
    fontSize: 12,
    fontWeight: "600",
  },
  circleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
});
