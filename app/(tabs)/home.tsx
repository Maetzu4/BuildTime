import { Text, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function Home() {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          backgroundColor: theme.colors.primary,
          padding: 20,
          borderRadius: 10,
          margin: 10,
        }}
      >
        <Text style={{ color: theme.colors.onPrimary }}>primary</Text>
      </View>
      <View
        style={{
          backgroundColor: theme.colors.secondary,
          padding: 20,
          borderRadius: 10,
          margin: 10,
        }}
      >
        <Text style={{ color: theme.colors.onSecondary }}>secondary</Text>
      </View>
      <View
        style={{
          backgroundColor: theme.colors.tertiary,
          padding: 20,
          borderRadius: 10,
          margin: 10,
        }}
      >
        <Text style={{ color: theme.colors.onTertiary }}>tertiary</Text>
      </View>
      <View
        style={{
          backgroundColor: theme.colors.error,
          padding: 20,
          borderRadius: 10,
          margin: 10,
        }}
      >
        <Text style={{ color: theme.colors.onError }}>error</Text>
      </View>
      <View
        style={{
          backgroundColor: theme.colors.background,
          padding: 20,
          borderRadius: 10,
          margin: 10,
        }}
      >
        <Text style={{ color: theme.colors.onBackground }}>background</Text>
      </View>
      <View
        style={{
          backgroundColor: theme.colors.surface,
          padding: 20,
          borderRadius: 10,
          margin: 10,
        }}
      >
        <Text style={{ color: theme.colors.onSurface }}>surface</Text>
      </View>
      <View
        style={{
          backgroundColor: theme.colors.outline,
          padding: 20,
          borderRadius: 10,
          margin: 10,
        }}
      >
        <Text style={{ color: theme.colors.outlineVariant }}>outline</Text>
      </View>
    </View>
  );
}
