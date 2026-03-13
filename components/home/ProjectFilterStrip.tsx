import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useAppStore } from "../../lib/store";

export function ProjectFilterStrip() {
  const { colors } = useTheme();
  const { projects, selectedProjectFilter, setProjectFilter } = useAppStore();

  if (projects.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          onPress={() => setProjectFilter(null)}
          style={[
            styles.chip,
            {
              backgroundColor:
                selectedProjectFilter === null ? colors.primary : colors.surface,
              borderColor:
                selectedProjectFilter === null ? colors.primary : colors.outlineVariant,
            },
          ]}
        >
          <Text
            style={[
              styles.chipText,
              {
                color:
                  selectedProjectFilter === null ? colors.onPrimary : colors.onSurface,
              },
            ]}
          >
            All Projects
          </Text>
        </TouchableOpacity>

        {projects.map((p) => {
          const isSelected = selectedProjectFilter === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              onPress={() => setProjectFilter(p.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? p.color : colors.surface,
                  borderColor: isSelected ? p.color : colors.outlineVariant,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={p.icon as any}
                size={14}
                color={isSelected ? "#fff" : colors.onSurface}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.chipText,
                  { color: isSelected ? "#fff" : colors.onSurface },
                ]}
              >
                {p.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
