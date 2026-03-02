// index.tsx - test con colores built-in de tailwind
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-blue-500">
      <View className="bg-purple-600 px-6 py-4 rounded-2xl">
        <Text className="text-white text-xl font-bold">NativeWind test</Text>
      </View>
    </View>
  );
}
