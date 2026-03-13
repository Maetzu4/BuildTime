import React, { useCallback, useRef, useState } from "react";
import { FlatList, StyleSheet, View, ViewToken } from "react-native";
import { Button, useTheme } from "react-native-paper";

import { Stack } from "expo-router";
import AccountStep from "../components/onboarding/AccountStep";
import CreateProjectStep from "../components/onboarding/CreateProjectStep";
import WelcomeStep from "../components/onboarding/WelcomeStep";

interface OnboardingProps {
  onComplete: () => void;
}

const STEPS = [{ key: "welcome" }, { key: "project" }, { key: "account" }];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { colors } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Callback que se ejecuta cuando cambia el elemento visible en el FlatList (el "slide" actual)
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      // Actualizamos el índice actual para sincronizar los puntos indicadores (dots) y los botones
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [],
  );

  // Configuración para determinar cuándo un elemento se considera "visible" (50% en pantalla)
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  // Funciones para avanzar y retroceder entre los pasos del onboarding
  const goNext = () => {
    if (currentIndex < STEPS.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const renderItem = ({ item }: { item: { key: string } }) => {
    // Renderiza el componente de paso correspondiente según la clave de la lista STEPS
    switch (item.key) {
      case "welcome":
        return <WelcomeStep colors={colors} />;
      case "project":
        return <CreateProjectStep colors={colors} />;
      case "account":
        return <AccountStep colors={colors} onComplete={onComplete} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Oculta el header de la navegación para la pantalla de Onboarding */}
      <Stack.Screen options={{ headerShown: false }} />
      {/* Contenido paginado (slides) usando FlatList horizontal */}
      <FlatList
        ref={flatListRef}
        data={STEPS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Controles de la parte inferior (Botones y Puntos) */}
      <View style={styles.bottomBar}>
        {/* Botón de retroceso: se muestra si no estamos en el primer paso */}
        {currentIndex > 0 ? (
          <Button
            mode="contained"
            onPress={goBack}
            textColor={colors.inversePrimary}
          >
            Back
          </Button>
        ) : (
          <View style={{ width: 80 }} />
        )}

        {/* Dots */}
        <View style={styles.dotsRow}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === currentIndex ? colors.primary : colors.outlineVariant,
                  width: i === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Next button */}
        {currentIndex < STEPS.length - 1 ? (
          <Button
            mode="contained"
            onPress={goNext}
            textColor={colors.inversePrimary}
          >
            Next
          </Button>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 12,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
