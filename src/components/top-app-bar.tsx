import { useAppStore } from "@/lib/store";
import { fadeDown, fadeUp } from "@/utils/animations";
import { useRouter } from "expo-router";
import { ArrowLeft, User } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";

interface TopAppBarProps {
  title?: string;
  showBack?: boolean;
  showAvatar?: boolean;
  greeting?: boolean;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function TopAppBar({
  title,
  showBack,
  showAvatar = true,
  greeting,
}: TopAppBarProps) {
  const router = useRouter();
  const user = useAppStore((s) => s.user);

  const displayTitle = greeting
    ? `${getGreeting()}${user.name ? ` ${user.name}` : ""} 👋`
    : title;

  return (
    <View className="flex-row items-center justify-between h-16 px-4">
      <View className="flex-row items-center gap-3 flex-1">
        {showBack && (
          <Animated.View entering={fadeUp}>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full items-center justify-center bg-white/5"
            >
              <ArrowLeft size={20} color="white" />
            </TouchableOpacity>
          </Animated.View>
        )}
        <Animated.View entering={fadeDown} className="flex-1">
          <Text className="text-white text-xl font-semibold" numberOfLines={1}>
            {displayTitle}
          </Text>
        </Animated.View>
      </View>

      {showAvatar && (
        <Animated.View entering={fadeUp}>
          <TouchableOpacity
            onPress={() => router.push("/profile" as any)}
            className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center"
          >
            {user.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <User size={20} color="#6C3FC5" />
            )}
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

export function SubScreenBar({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <View className="flex-row items-center gap-3 h-16 px-4">
      <Animated.View entering={fadeUp}>
        <TouchableOpacity
          onPress={onBack}
          className="w-10 h-10 rounded-full items-center justify-center bg-white/5"
        >
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View entering={fadeDown}>
        <Text className="text-white text-xl font-semibold">{title}</Text>
      </Animated.View>
    </View>
  );
}
