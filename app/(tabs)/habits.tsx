import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useAppStore } from "../../lib/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function HabitsScreen() {
  const { colors } = useTheme();
  const habits = useAppStore((s) => s.habits);
  const toggleHabitComplete = useAppStore((s) => s.toggleHabitComplete);
  const today = todayStr();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
          Todos los Hábitos ({habits.length})
        </Text>

        <View style={styles.grid}>
          {habits.map((habit) => {
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
                  <MaterialCommunityIcons
                    name="fire"
                    size={16}
                    color="#F59E0B"
                  />
                  <Text style={styles.streakText}>{habit.streak} racha</Text>
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
                    size={28}
                    color={completed ? colors.onPrimary : colors.outline}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    width: "48%", // Two columns
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 12,
  },
  habitName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
    minHeight: 40,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  streakText: {
    color: "#F59E0B",
    fontSize: 14,
    fontWeight: "bold",
  },
  circleBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
});
