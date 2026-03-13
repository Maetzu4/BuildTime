import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const { width } = Dimensions.get("window");

interface WelcomeStepProps {
  colors: any;
}

export default function WelcomeStep({ colors }: WelcomeStepProps) {
  return (
    // Contenedor principal del slide, ocupa todo el ancho de la pantalla
    <View style={[styles.slide, { backgroundColor: colors.background }]}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons
          name="timer-outline"
          size={72}
          color={colors.primary}
        />
      </View>

      <Text
        variant="headlineLarge"
        style={[styles.title, { color: colors.onBackground }]}
      >
        Welcome to BuildTime!
      </Text>

      <Text
        variant="bodyLarge"
        style={[styles.subtitle, { color: colors.onSurfaceVariant }]}
      >
        Organiza tus proyectos, administra tu tiempo y mantén un registro de cada
        tarea de construcción.
      </Text>
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
  iconCircle: {
    marginBottom: 24,
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
});
