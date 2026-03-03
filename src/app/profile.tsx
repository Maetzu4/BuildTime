import { SubScreenBar } from "@/components/top-app-bar";
import { useAppStore } from "@/lib/store";
import { useRouter } from "expo-router";
import {
  Award,
  BarChart3,
  Calendar,
  Edit3,
  LogOut,
  Settings,
  Trash2,
  User,
} from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, navTab, updateUser, signOut, deleteAllData } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  function handleSave() {
    updateUser({ name: name.trim(), email: email.trim() });
    setEditing(false);
  }

  function handleSignOut() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          signOut();
          router.replace("/onboarding" as any);
        },
      },
    ]);
  }

  function handleDeleteAll() {
    Alert.alert(
      "Delete all data?",
      "This will permanently delete all your tasks, habits, and projects. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: () => deleteAllData(),
        },
      ],
    );
  }

  const menuItems = [
    {
      icon: Settings,
      label: "Settings",
      action: () => router.push("/settings" as any),
    },
    {
      icon: Calendar,
      label: "Calendar",
      action: () => router.push("/calendar" as any),
    },
    {
      icon: BarChart3,
      label: "Statistics",
      action: () => router.push("/statistics" as any),
    },
    {
      icon: Award,
      label: "Achievements",
      action: () => router.push("/achievements" as any),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <SubScreenBar title="Profile" onBack={() => router.back()} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-4 gap-6 pt-4">
          {/* Avatar + Info */}
          <View className="items-center gap-4 py-6">
            <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center">
              {user.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <User size={48} color="#6C3FC5" />
              )}
            </View>

            {editing ? (
              <View className="gap-3 w-full max-w-xs">
                <TextInput
                  placeholder="Your name"
                  placeholderTextColor="rgba(255,255,255,0.25)"
                  value={name}
                  onChangeText={setName}
                  className="h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm text-center"
                />
                <TextInput
                  placeholder="Email address"
                  placeholderTextColor="rgba(255,255,255,0.25)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  className="h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm text-center"
                />
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => setEditing(false)}
                    className="flex-1 h-10 rounded-xl border border-white/10 items-center justify-center"
                  >
                    <Text className="text-white text-sm">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSave}
                    className="flex-1 h-10 rounded-xl bg-primary items-center justify-center"
                  >
                    <Text className="text-white text-sm font-semibold">
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <View className="items-center">
                  <Text className="text-white text-lg font-semibold">
                    {user.name || "Anonymous User"}
                  </Text>
                  <Text className="text-white/40 text-sm">
                    {user.email || "No email set"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setEditing(true)}
                  className="flex-row items-center gap-2 h-9 px-4 rounded-xl border border-white/10"
                >
                  <Edit3 size={16} color="rgba(255,255,255,0.7)" />
                  <Text className="text-white/70 text-sm">Edit Profile</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Menu */}
          <View className="gap-1">
            {menuItems.map(({ icon: Icon, label, action }) => (
              <TouchableOpacity
                key={label}
                onPress={action}
                className="flex-row items-center gap-4 h-14 px-4 rounded-2xl"
                activeOpacity={0.7}
              >
                <Icon size={20} color="rgba(255,255,255,0.4)" />
                <Text className="text-white text-sm font-medium">{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Danger Zone */}
          <View className="pt-4 border-t border-white/10 gap-2">
            <Text className="text-red-400 text-xs font-semibold px-4 mb-1">
              Danger Zone
            </Text>

            <TouchableOpacity
              onPress={handleSignOut}
              className="flex-row items-center gap-4 h-14 px-4 rounded-2xl"
              activeOpacity={0.7}
            >
              <LogOut size={20} color="#f87171" />
              <Text className="text-red-400 text-sm font-medium">Sign Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDeleteAll}
              className="flex-row items-center gap-4 h-14 px-4 rounded-2xl"
              activeOpacity={0.7}
            >
              <Trash2 size={20} color="#f87171" />
              <Text className="text-red-400 text-sm font-medium">
                Delete All Data
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
