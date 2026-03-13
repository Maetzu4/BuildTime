import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Avatar, IconButton, Menu, Text, useTheme } from "react-native-paper";
import { exportData, importData } from "../../lib/dataTransfer";
import { useAppStore } from "../../lib/store";

export function TopAppBar({
  greeting,
  showAvatar,
}: {
  greeting?: boolean;
  showAvatar?: boolean;
}) {
  const router = useRouter();
  const { colors } = useTheme();
  // Conectamos estado global
  const accountMode = useAppStore((s) => s.accountMode);
  const setAccountMode = useAppStore((s) => s.setAccountMode);
  const clearData = useAppStore((s) => s.clearData);

  // Visibilidad del menú secundario
  const [menuVisible, setMenuVisible] = useState(false);

  // Funciones para abrir y cerrar menú de opciones adicionales
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  // Función para exportar la data local (Zustand -> archivo JSON)
  const handleExport = async () => {
    closeMenu();
    await exportData();
  };

  // Función para importar un respaldo JSON
  const handleImport = async () => {
    closeMenu();
    await importData();
  };

  // Simulación de inicio de sesión con Google (por ahora un mock/nube)
  const handleSignIn = () => {
    closeMenu();
    Alert.alert(
      "Iniciar Sesión",
      "Próximamente esto te permitirá iniciar sesión con Google para respaldo en la nube.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Login Falso (Mock)",
          onPress: () => setAccountMode("cloud"),
        },
      ],
    );
  };

  // Botón peligroso: Limpia la base de datos entera
  const handleReset = () => {
    closeMenu();
    Alert.alert(
      "Reiniciar App",
      "¿Estás seguro de querer borrar todos los datos locales y regresar al inicio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Reiniciar",
          style: "destructive",
          onPress: () => {
            clearData();
            router.replace("/onboarding");
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {greeting && (
          <View>
            <Text
              style={[styles.greeting, { color: colors.onSurfaceVariant }]}
              variant="labelMedium"
            >
              Buenos días,
            </Text>
            <Text
              style={[styles.name, { color: colors.onSurface }]}
              variant="titleLarge"
            >
              Constructor 👋
            </Text>
          </View>
        )}
      </View>

      <View style={styles.right}>
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <IconButton
              icon="dots-vertical"
              iconColor={colors.onSurfaceVariant}
              size={24}
              onPress={openMenu}
            />
          }
        >
          {accountMode !== "cloud" && (
            <Menu.Item
              onPress={handleSignIn}
              title="Iniciar & Sincronizar"
              leadingIcon="cloud-upload"
            />
          )}
          <Menu.Item
            onPress={handleExport}
            title="Exportar Datos"
            leadingIcon="export"
          />
          <Menu.Item
            onPress={handleImport}
            title="Importar Respaldo"
            leadingIcon="import"
          />
          <Menu.Item
            onPress={handleReset}
            title="Reiniciar App"
            leadingIcon="delete-outline"
            titleStyle={{ color: colors.error }}
          />
        </Menu>

        {showAvatar && (
          <Avatar.Icon
            size={36}
            icon={accountMode === "demo" ? "test-tube" : "account"}
            style={{ backgroundColor: colors.primaryContainer }}
            color={colors.onPrimaryContainer}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  left: {
    flex: 1,
  },
  greeting: {
    marginBottom: 2,
  },
  name: {
    fontWeight: "bold",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
