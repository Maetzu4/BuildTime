import { useAppStore } from "@/lib/store";
import { Tabs } from "expo-router";
import { CheckSquare, FolderKanban, Home, Repeat } from "lucide-react-native";
import { Text, View } from "react-native";

export default function TabsLayout() {
  const tasks = useAppStore((s) => s.tasks);
  const pendingTasks = tasks.filter((t) => t.status === "todo").length;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1E1E2E",
          borderTopColor: "rgba(255,255,255,0.1)",
          height: 64,
        },
        tabBarActiveTintColor: "#6C3FC5",
        tabBarInactiveTintColor: "rgba(255,255,255,0.4)",
        tabBarLabelStyle: { fontSize: 12, fontWeight: "500", marginBottom: 6 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color }) => (
            <View>
              <CheckSquare size={20} color={color} />
              {pendingTasks > 0 && (
                <View className="absolute -top-1 -right-2 min-w-[16px] h-4 bg-red-500 rounded-full items-center justify-center px-0.5">
                  <Text className="text-white text-[9px] font-bold">
                    {pendingTasks}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: "Habits",
          tabBarIcon: ({ color }) => <Repeat size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ({ color }) => <FolderKanban size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
