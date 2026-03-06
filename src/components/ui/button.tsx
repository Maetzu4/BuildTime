import { ReactNode } from "react";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

export type ButtonVariant =
  | "filled"
  | "tonal"
  | "outlined"
  | "ghost"
  | "elevated";

interface ButtonProps extends TouchableOpacityProps {
  children: ReactNode;
  variant?: ButtonVariant;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "filled",
  icon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  let bgClass = "";
  let textClass = "";
  let borderClass = "";

  switch (variant) {
    case "filled":
      bgClass = disabled ? "bg-m3-surface-container-high" : "bg-m3-primary";
      textClass = disabled ? "text-m3-outline" : "text-m3-on-primary";
      break;
    case "tonal":
      bgClass = disabled
        ? "bg-m3-surface-container-high"
        : "bg-m3-secondary-container";
      textClass = disabled
        ? "text-m3-outline"
        : "text-m3-on-secondary-container";
      break;
    case "outlined":
      bgClass = "bg-transparent";
      textClass = disabled ? "text-m3-outline-variant" : "text-m3-primary";
      borderClass = disabled
        ? "border border-m3-outline-variant"
        : "border border-m3-outline";
      break;
    case "ghost":
      bgClass = "bg-transparent";
      textClass = disabled ? "text-m3-outline-variant" : "text-m3-primary";
      break;
    case "elevated":
      bgClass = disabled
        ? "bg-m3-surface-container-high"
        : "bg-m3-surface-container-low shadow-sm";
      textClass = disabled ? "text-m3-outline" : "text-m3-primary";
      break;
  }

  return (
    <TouchableOpacity
      className={`h-10 px-6 rounded-full flex-row items-center justify-center gap-2 transition-all ${bgClass} ${borderClass} ${fullWidth ? "w-full" : "self-start"} ${className}`}
      activeOpacity={0.8}
      disabled={disabled}
      {...props}
    >
      {icon && <View>{icon}</View>}
      <Text className={`${textClass} text-sm font-semibold`}>{children}</Text>
    </TouchableOpacity>
  );
}
