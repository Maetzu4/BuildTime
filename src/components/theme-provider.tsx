import { useAppStore } from "@/lib/store";
import { generateM3Scheme, schemeToCssVariables } from "@/lib/theme";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { useColorScheme } from "nativewind";
import { useEffect, useMemo } from "react";
import { useColorScheme as useRNColorScheme, View } from "react-native";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useRNColorScheme();
  const { theme: androidTheme } = useMaterial3Theme();
  const { setColorScheme } = useColorScheme();
  const { darkMode, setDarkMode, themeMode, themeSource, themeSeedColor } =
    useAppStore();

  const isDark =
    themeMode === "system" ? systemScheme === "dark" : themeMode === "dark";

  // Sincroniza sistema → store al arrancar
  useEffect(() => {
    if (themeMode === "system") {
      setDarkMode(systemScheme === "dark");
    }
  }, [systemScheme, themeMode]);

  // Sincroniza store → NativeWind cuando darkMode cambia
  useEffect(() => {
    setColorScheme(isDark ? "dark" : "light");
    if (darkMode !== isDark) setDarkMode(isDark);
  }, [isDark]);

  const cssVars = useMemo(() => {
    let scheme;
    if (themeSource === "dynamic" && androidTheme) {
      scheme = isDark ? androidTheme.dark : androidTheme.light;
    } else {
      scheme = generateM3Scheme(themeSeedColor || "#6C3FC5", isDark);
    }
    return schemeToCssVariables(scheme);
  }, [isDark, themeSource, themeSeedColor, androidTheme]);

  return (
    <View style={cssVars as any} className="flex-1">
      {children}
    </View>
  );
}
