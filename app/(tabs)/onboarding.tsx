import React, { useCallback, useRef, useState } from "react";
import { FlatList, StyleSheet, View, ViewToken } from "react-native";
import { Button, useTheme } from "react-native-paper";

import AccountStep from "../../components/onboarding/AccountStep";
import CreateProjectStep from "../../components/onboarding/CreateProjectStep";
import WelcomeStep from "../../components/onboarding/WelcomeStep";

interface OnboardingProps {
  onComplete: () => void;
}

const STEPS = [{ key: "welcome" }, { key: "project" }, { key: "account" }];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { colors } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

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
      {/* Paginated content */}
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

      {/* Bottom controls */}
      <View style={styles.bottomBar}>
        {/* Back button */}
        {currentIndex > 0 ? (
          <Button mode="text" onPress={goBack} textColor={colors.primary}>
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
          <Button mode="text" onPress={goNext} textColor={colors.primary}>
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
