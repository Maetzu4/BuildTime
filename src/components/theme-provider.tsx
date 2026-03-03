import { useAppStore } from "@/lib/store";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useRNColorScheme();
  const { setColorScheme } = useColorScheme();
  const { darkMode, setDarkMode } = useAppStore();

  // Sincroniza sistema → store al arrancar
  useEffect(() => {
    setDarkMode(systemScheme === "dark");
  }, []);

  // Sincroniza store → NativeWind cuando darkMode cambia
  useEffect(() => {
    setColorScheme(darkMode ? "dark" : "light");
  }, [darkMode]);

  return <>{children}</>;
}
