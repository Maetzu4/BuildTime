import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Dimensions, StyleSheet, TextInput, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

const { width } = Dimensions.get("window");

// Opciones de colores predefinidos para la creación de proyectos
const PROJECT_COLORS = [
  "#6750A4",
  "#E8175D",
  "#1E88E5",
  "#43A047",
  "#FB8C00",
  "#8E24AA",
];

// Opciones de íconos predefinidos para la creación de proyectos
const PROJECT_ICONS: (keyof typeof MaterialCommunityIcons.glyphMap)[] = [
  "home",
  "briefcase",
  "school",
  "palette",
  "heart",
  "star",
];

interface CreateProjectStepProps {
  colors: any;
}

export default function CreateProjectStep({ colors }: CreateProjectStepProps) {
  // Estado local para almacenar qué color e ícono han sido seleccionados
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [projectName, setProjectName] = useState("");

  return (
    <View style={[styles.slide, { backgroundColor: colors.background }]}>
      <Text
        variant="headlineSmall"
        style={[styles.title, { color: colors.onBackground }]}
      >
        Create your first project
      </Text>

      <Text
        variant="bodyMedium"
        style={[styles.subtitle, { color: colors.onSurfaceVariant }]}
      >
        Give it a name, choose a color and an icon.
      </Text>

      {/* Input para el nombre del proyecto */}
      <TextInput
        placeholder="Project name"
        placeholderTextColor={colors.onSurfaceVariant}
        value={projectName}
        onChangeText={setProjectName}
        style={[
          styles.input,
          {
            borderColor: colors.outline,
            color: colors.onBackground,
            backgroundColor: colors.surfaceVariant,
          },
        ]}
      />

      {/* Selector de Color (Color picker) */}
      <Text
        variant="labelLarge"
        style={{ color: colors.onBackground, marginBottom: 8 }}
      >
        Color
      </Text>
      <View style={styles.optionRow}>
        {PROJECT_COLORS.map((c, i) => (
          <IconButton
            key={c}
            icon={selectedColor === i ? "check-circle" : "circle"}
            iconColor={c}
            size={32}
            onPress={() => setSelectedColor(i)}
          />
        ))}
      </View>

      {/* Selector de Ícono (Icon picker) */}
      <Text
        variant="labelLarge"
        style={{ color: colors.onBackground, marginTop: 12, marginBottom: 8 }}
      >
        Icon
      </Text>
      <View style={styles.optionRow}>
        {PROJECT_ICONS.map((icon, i) => (
          <IconButton
            key={icon}
            icon={icon}
            iconColor={
              selectedIcon === i ? colors.primary : colors.onSurfaceVariant
            }
            size={32}
            style={
              selectedIcon === i
                ? {
                    backgroundColor: colors.primaryContainer,
                    borderRadius: 16,
                  }
                : undefined
            }
            onPress={() => setSelectedIcon(i)}
          />
        ))}
      </View>

      {/* Tarjeta de vista previa (Preview card) 
          Muestra cómo se verá el componente de proyecto con el color e ícono elegidos */}
      <View
        style={[
          styles.previewCard,
          { backgroundColor: PROJECT_COLORS[selectedColor] },
        ]}
      >
        <MaterialCommunityIcons
          name={PROJECT_ICONS[selectedIcon]}
          size={28}
          color="#fff"
        />
        <Text variant="titleMedium" style={{ color: "#fff", marginLeft: 12 }}>
          {projectName || "Project Name"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    textAlign: "center",
    marginTop: 16,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 22,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    width: "100%",
  },
});
