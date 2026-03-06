import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from "@material/material-color-utilities";
import { Material3Scheme } from "@pchmn/expo-material3-theme";

export type ThemeMode = "system" | "light" | "dark";
export type ThemeColorSource = "dynamic" | "custom";

/**
 * Generates a full M3 scheme from a seed hex color.
 */
export function generateM3Scheme(
  seedHex: string,
  isDark: boolean,
): Material3Scheme {
  const argb = argbFromHex(seedHex);
  const theme = themeFromSourceColor(argb);
  const scheme = isDark ? theme.schemes.dark : theme.schemes.light;

  return {
    primary: hexFromArgb(scheme.primary),
    onPrimary: hexFromArgb(scheme.onPrimary),
    primaryContainer: hexFromArgb(scheme.primaryContainer),
    onPrimaryContainer: hexFromArgb(scheme.onPrimaryContainer),
    secondary: hexFromArgb(scheme.secondary),
    onSecondary: hexFromArgb(scheme.onSecondary),
    secondaryContainer: hexFromArgb(scheme.secondaryContainer),
    onSecondaryContainer: hexFromArgb(scheme.onSecondaryContainer),
    tertiary: hexFromArgb(scheme.tertiary),
    onTertiary: hexFromArgb(scheme.onTertiary),
    tertiaryContainer: hexFromArgb(scheme.tertiaryContainer),
    onTertiaryContainer: hexFromArgb(scheme.onTertiaryContainer),
    error: hexFromArgb(scheme.error),
    onError: hexFromArgb(scheme.onError),
    errorContainer: hexFromArgb(scheme.errorContainer),
    onErrorContainer: hexFromArgb(scheme.onErrorContainer),
    background: hexFromArgb(scheme.background),
    onBackground: hexFromArgb(scheme.onBackground),
    surface: hexFromArgb(scheme.surface),
    onSurface: hexFromArgb(scheme.onSurface),
    surfaceVariant: hexFromArgb(scheme.surfaceVariant),
    onSurfaceVariant: hexFromArgb(scheme.onSurfaceVariant),
    outline: hexFromArgb(scheme.outline),
    outlineVariant: hexFromArgb(scheme.outlineVariant),
    shadow: hexFromArgb(scheme.shadow),
    scrim: hexFromArgb(scheme.scrim),
    inverseSurface: hexFromArgb(scheme.inverseSurface),
    inverseOnSurface: hexFromArgb(scheme.inverseOnSurface),
    inversePrimary: hexFromArgb(scheme.inversePrimary),
    surfaceTint: hexFromArgb(scheme.primary),
    surfaceDim: hexFromArgb(
      isDark ? theme.palettes.neutral.tone(6) : theme.palettes.neutral.tone(87),
    ),
    surfaceBright: hexFromArgb(
      isDark
        ? theme.palettes.neutral.tone(24)
        : theme.palettes.neutral.tone(98),
    ),
    surfaceContainerLowest: hexFromArgb(
      isDark
        ? theme.palettes.neutral.tone(4)
        : theme.palettes.neutral.tone(100),
    ),
    surfaceContainerLow: hexFromArgb(
      isDark
        ? theme.palettes.neutral.tone(10)
        : theme.palettes.neutral.tone(96),
    ),
    surfaceContainer: hexFromArgb(
      isDark
        ? theme.palettes.neutral.tone(12)
        : theme.palettes.neutral.tone(94),
    ),
    surfaceContainerHigh: hexFromArgb(
      isDark
        ? theme.palettes.neutral.tone(17)
        : theme.palettes.neutral.tone(92),
    ),
    surfaceContainerHighest: hexFromArgb(
      isDark
        ? theme.palettes.neutral.tone(22)
        : theme.palettes.neutral.tone(90),
    ),
    elevation: {
      level0: "transparent",
      level1: hexFromArgb(
        isDark
          ? theme.palettes.neutral.tone(10)
          : theme.palettes.neutral.tone(96),
      ),
      level2: hexFromArgb(
        isDark
          ? theme.palettes.neutral.tone(12)
          : theme.palettes.neutral.tone(94),
      ),
      level3: hexFromArgb(
        isDark
          ? theme.palettes.neutral.tone(14)
          : theme.palettes.neutral.tone(92),
      ),
      level4: hexFromArgb(
        isDark
          ? theme.palettes.neutral.tone(15)
          : theme.palettes.neutral.tone(90),
      ),
      level5: hexFromArgb(
        isDark
          ? theme.palettes.neutral.tone(17)
          : theme.palettes.neutral.tone(88),
      ),
    },
    surfaceDisabled: hexFromArgb(scheme.onSurface) + "1F",
    onSurfaceDisabled: hexFromArgb(scheme.onSurface) + "61",
    backdrop: hexFromArgb(scheme.scrim) + "66",
  };
}

/**
 * Returns NativeWind CSS variables for a given scheme.
 * Additional "surfaceContainer" is added for convenience mapping to surface elevation 2.
 */
export function schemeToCssVariables(scheme: Material3Scheme) {
  const vars: Record<string, string> = {
    "--m3-primary": scheme.primary,
    "--m3-on-primary": scheme.onPrimary,
    "--m3-primary-container": scheme.primaryContainer,
    "--m3-on-primary-container": scheme.onPrimaryContainer,
    "--m3-secondary": scheme.secondary,
    "--m3-on-secondary": scheme.onSecondary,
    "--m3-secondary-container": scheme.secondaryContainer,
    "--m3-on-secondary-container": scheme.onSecondaryContainer,
    "--m3-tertiary": scheme.tertiary,
    "--m3-on-tertiary": scheme.onTertiary,
    "--m3-tertiary-container": scheme.tertiaryContainer,
    "--m3-on-tertiary-container": scheme.onTertiaryContainer,
    "--m3-error": scheme.error,
    "--m3-on-error": scheme.onError,
    "--m3-error-container": scheme.errorContainer,
    "--m3-on-error-container": scheme.onErrorContainer,
    "--m3-background": scheme.background,
    "--m3-on-background": scheme.onBackground,
    "--m3-surface": scheme.surface,
    "--m3-on-surface": scheme.onSurface,
    "--m3-surface-variant": scheme.surfaceVariant,
    "--m3-on-surface-variant": scheme.onSurfaceVariant,
    "--m3-outline": scheme.outline,
    "--m3-outline-variant": scheme.outlineVariant,
    "--m3-shadow": scheme.shadow,
    "--m3-scrim": scheme.scrim,
    "--m3-inverse-surface": scheme.inverseSurface,
    "--m3-inverse-on-surface": scheme.inverseOnSurface,
    "--m3-inverse-primary": scheme.inversePrimary,

    // Custom mappings commonly used in material apps
    "--m3-surface-container": scheme.elevation.level2,
    "--m3-surface-container-high": scheme.elevation.level3,
    "--m3-surface-container-highest": scheme.elevation.level5,
  };
  return vars;
}
