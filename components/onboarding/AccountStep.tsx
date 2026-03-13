import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAppStore } from "../../lib/store";

const { width } = Dimensions.get("window");

interface AccountStepProps {
  colors: any;
  onComplete: () => void;
}

export default function AccountStep({ colors, onComplete }: AccountStepProps) {
  // Acciones en el store de Zustand para manejar el estado
  const setAccountMode = useAppStore((state) => state.setAccountMode);
  const seedDemoData = useAppStore((state) => state.seedDemoData);

  // Lógica para definir el tipo de cuenta y la data a usar
  const handleModeSelection = (mode: "demo" | "local" | "cloud") => {
    setAccountMode(mode);
    // Si selecciona demo, carga los datos de prueba
    if (mode === "demo") {
      seedDemoData();
    }
    // Próximamente integración en nube ("cloud")
    onComplete();
  };

  return (
    <View style={[styles.slide, { backgroundColor: colors.background }]}>
      <MaterialCommunityIcons
        name="account-circle-outline"
        size={72}
        color={colors.primary}
      />

      <Text
        variant="headlineSmall"
        style={[styles.title, { color: colors.onBackground }]}
      >
        How do you want to continue?
      </Text>

      <Text
        variant="bodyMedium"
        style={[styles.subtitle, { color: colors.onSurfaceVariant }]}
      >
        Puedes iniciar sesión, ver el proyecto de demostración, o avanzar sin cuenta alguna.
      </Text>

      <View style={styles.accountButtons}>
        <Button
          mode="contained"
          icon="login"
          onPress={() => handleModeSelection("cloud")}
          style={styles.accountBtn}
          contentStyle={styles.accountBtnContent}
        >
          Iniciar Sesión
        </Button>

        <Button
          mode="outlined"
          icon="eye-outline"
          onPress={() => handleModeSelection("demo")}
          style={styles.accountBtn}
          contentStyle={styles.accountBtnContent}
        >
          Explorar App de Ejemplo
        </Button>

        <Button
          mode="text"
          icon="arrow-right"
          onPress={() => handleModeSelection("local")}
          style={styles.accountBtn}
          contentStyle={styles.accountBtnContent}
        >
          Continuar sin Cuenta
        </Button>
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
  accountButtons: {
    width: "100%",
    gap: 12,
  },
  accountBtn: {
    borderRadius: 12,
  },
  accountBtnContent: {
    paddingVertical: 6,
  },
});
