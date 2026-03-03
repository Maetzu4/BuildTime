import { Plus } from "lucide-react-native";
import { Text, TouchableOpacity } from "react-native";

export function FAB({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="absolute bottom-6 right-4 flex-row items-center gap-2 h-14 pl-4 pr-5 rounded-2xl bg-primary"
      style={{ elevation: 6 }}
    >
      <Plus size={24} color="white" />
      <Text className="text-white text-sm font-semibold">{label}</Text>
    </TouchableOpacity>
  );
}
