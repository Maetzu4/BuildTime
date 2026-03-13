import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

const { width } = Dimensions.get("window");

interface AccountStepProps {
  colors: any;
  onComplete: () => void;
}

export default function AccountStep({ colors, onComplete }: AccountStepProps) {
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
