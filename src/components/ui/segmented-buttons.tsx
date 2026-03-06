import { Text, TouchableOpacity, View } from "react-native";

export interface SegmentedButtonOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedButtonsProps<T extends string> {
  options: SegmentedButtonOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedButtons<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: SegmentedButtonsProps<T>) {
  return (
    <View
      className={`flex-row border rounded-full overflow-hidden border-m3-outline ${className}`}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const isLast = index === options.length - 1;

        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            className={`flex-1 py-2.5 items-center justify-center border-m3-outline ${!isLast ? "border-r" : ""} ${
              isSelected ? "bg-m3-secondary-container" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                isSelected
                  ? "text-m3-on-secondary-container"
                  : "text-m3-on-surface"
              }`}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
