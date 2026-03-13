import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TextInput,
  View,
  ViewToken,
} from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";

const { width } = Dimensions.get("window");

//Color options for the "create project" step
const PROJECT_COLORS = [
  "#6750A4",
  "#E8175D",
  "#1E88E5",
  "#43A047",
  "#FB8C00",
  "#8E24AA",
];

//Icon options for the "create project" step
const PROJECT_ICONS: (keyof typeof MaterialCommunityIcons.glyphMap)[] = [
  "home",
  "briefcase",
  "school",
  "palette",
  "heart",
  "star",
];

interface OnboardingProps {
  onComplete: () => void;
}

// Step 1 – Welcome
function WelcomeStep({ colors }: { colors: any }) {
  return (
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
        Organize your projects, manage your time and keep track of every
        construction task.
      </Text>
    </View>
  );
}

// Step 2 – Create Project (visual only)
function CreateProjectStep({ colors }: { colors: any }) {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedIcon, setSelectedIcon] = useState(0);

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

      {/* Project name input */}
      <TextInput
        placeholder="Project name"
        placeholderTextColor={colors.onSurfaceVariant}
        style={[
          styles.input,
          {
            borderColor: colors.outline,
            color: colors.onBackground,
            backgroundColor: colors.surfaceVariant,
          },
        ]}
      />

      {/* Color picker */}
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

      {/* Icon picker */}
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

      {/* Preview card */}
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
          My Project
        </Text>
      </View>
    </View>
  );
}

// Step 3 – Account / Continue
function AccountStep({
  colors,
  onComplete,
}: {
  colors: any;
  onComplete: () => void;
}) {
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
        You can sign in, explore the example app, or continue without an
        account.
      </Text>

      <View style={styles.accountButtons}>
        <Button
          mode="contained"
          icon="login"
          onPress={onComplete}
          style={styles.accountBtn}
          contentStyle={styles.accountBtnContent}
        >
          Sign in
        </Button>

        <Button
          mode="outlined"
          icon="eye-outline"
          onPress={onComplete}
          style={styles.accountBtn}
          contentStyle={styles.accountBtnContent}
        >
          Explore example app
        </Button>

        <Button
          mode="text"
          icon="arrow-right"
          onPress={onComplete}
          style={styles.accountBtn}
          contentStyle={styles.accountBtnContent}
        >
          Continue without account
        </Button>
      </View>
    </View>
  );
}

// Main Onboarding component
export default function Onboarding({ onComplete }: OnboardingProps) {
  const { colors } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const STEPS = [{ key: "welcome" }, { key: "project" }, { key: "account" }];

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

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
