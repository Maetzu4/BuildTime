import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useTheme } from "react-native-paper";
import { Redirect } from "expo-router";
import { useAppStore } from "../lib/store"; // <-- Import store

export default function Index() {
  const { colors } = useTheme();
  const accountMode = useAppStore((state) => state.accountMode);
  
  // Zustand persist hydration necesita un instante para cargar, 
  // así que simulamos una pequeña espera con este estado
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    // Escucha cuando la hidratación de datos persistentes del store (Zustand) ha terminado
    useAppStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    // Verifica si la hidratación ya ocurrió en este momento
    setHasHydrated(useAppStore.persist.hasHydrated());
  }, []);

  // Muestra un indicador de carga mientras se recuperan los datos locales
  if (!hasHydrated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Si no hay un modo de cuenta seleccionado, muestra la pantalla de onboarding (bienvenida)
  if (!accountMode) {
    return <Redirect href="/onboarding" />;
  }

  // Si ya hay un modo seleccionado (local, demo o cloud), va directamente al Home principal
  return <Redirect href="/(tabs)/home" />;
}
