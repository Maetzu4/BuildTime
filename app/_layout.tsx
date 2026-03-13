import { TopAppBar } from "@/components/home/TopAppBar";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { Stack } from "expo-router";
import { useMemo } from "react";
import { useColorScheme } from "react-native";
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  // Obtiene el esquema de color del sistema (claro u oscuro)
  const colorScheme = useColorScheme();
  
  // Obtiene los tokens de diseño de Material Design 3 generados automáticamente
  const { theme } = useMaterial3Theme();

  // Memoriza y construye el tema de react-native-paper basado en si es oscuro o claro
  const paperTheme = useMemo(
    () =>
      colorScheme === "dark"
        ? { ...MD3DarkTheme, colors: theme.dark }
        : { ...MD3LightTheme, colors: theme.light },
    [colorScheme, theme],
  );

  return (
    // Proveedor del área segura (muescas de pantalla y gestos)
    <SafeAreaProvider>
      {/* Proveedor principal del tema visual para toda la app */}
      <PaperProvider theme={paperTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: paperTheme.colors.background,
            },
            headerTitle: "",
            headerLeft: () => <TopAppBar greeting showAvatar />,
          }}
        />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
