import { CreateHabitSheet, CreateTaskSheet } from "@/components/create-sheets";
import { FAB } from "@/components/fab";
import { SubScreenBar } from "@/components/top-app-bar";
import { useAppStore } from "@/lib/store";
import { useRouter } from "expo-router";
import { Check, ChevronLeft, ChevronRight, Flame } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarScreen() {
  const router = useRouter();
  const { tasks, habits, toggleTask, toggleHabitComplete } = useAppStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [activeTab, setActiveTab] = useState<"tasks" | "habits">("tasks");
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCreateHabit, setShowCreateHabit] = useState(false);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleString("en", {
    month: "long",
    year: "numeric",
  });
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const todayStr = new Date().toISOString().split("T")[0];

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [offset, daysInMonth]);

  function dateStr(day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function hasDot(day: number) {
    const d = dateStr(day);
    return (
      tasks.some((t) => t.dueDate === d) ||
      habits.some((h) => h.completedDates.includes(d))
    );
  }

  const dayTasks = tasks.filter((t) => t.dueDate === selectedDate);
  const dayHabits = habits.filter(
    (h) =>
      h.frequency === "daily" ||
      h.weeklyDays.includes(new Date(selectedDate).getDay()),
  );

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <SubScreenBar title="Calendar" onBack={() => router.back()} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 100 }}
      >
        {/* Month nav */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => setCurrentMonth(new Date(year, month - 1, 1))}
            className="w-10 h-10 rounded-full items-center justify-center bg-white/5"
          >
            <ChevronLeft size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-base font-semibold">
            {monthName}
          </Text>
          <TouchableOpacity
            onPress={() => setCurrentMonth(new Date(year, month + 1, 1))}
            className="w-10 h-10 rounded-full items-center justify-center bg-white/5"
          >
            <ChevronRight size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Calendar grid */}
        <View>
          {/* Weekday headers */}
          <View className="flex-row mb-1">
            {WEEKDAYS.map((d) => (
              <View key={d} className="flex-1 items-center py-1">
                <Text className="text-white/40 text-[10px] font-medium">
                  {d}
                </Text>
              </View>
            ))}
          </View>

          {/* Days */}
          <View className="flex-row flex-wrap">
            {calendarDays.map((day, i) => {
              if (day === null) {
                return (
                  <View
                    key={`empty-${i}`}
                    style={{ width: "14.28%" }}
                    className="h-10"
                  />
                );
              }
              const ds = dateStr(day);
              const isSelected = ds === selectedDate;
              const isToday = ds === todayStr;
              const dot = hasDot(day);

              return (
                <TouchableOpacity
                  key={ds}
                  onPress={() => setSelectedDate(ds)}
                  style={{ width: "14.28%" }}
                  className={`h-10 rounded-xl items-center justify-center ${
                    isSelected ? "bg-primary" : isToday ? "bg-primary/15" : ""
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isSelected
                        ? "text-white"
                        : isToday
                          ? "text-primary"
                          : "text-white"
                    }`}
                  >
                    {day}
                  </Text>
                  {dot && (
                    <View
                      className={`absolute bottom-0.5 w-1 h-1 rounded-full ${
                        isSelected ? "bg-white" : "bg-primary"
                      }`}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Tabs */}
        <View className="bg-white/5 rounded-xl p-1 flex-row">
          {(["tasks", "habits"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                setActiveTab(tab);
              }}
              className={`flex-1 h-8 rounded-lg items-center justify-center ${
                activeTab === tab ? "bg-white/10" : ""
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  activeTab === tab ? "text-white" : "text-white/40"
                }`}
              >
                {tab === "tasks"
                  ? `Tasks (${dayTasks.length})`
                  : `Habits (${dayHabits.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab content */}
        {activeTab === "tasks" ? (
          dayTasks.length === 0 ? (
            <Text className="text-white/40 text-sm text-center py-6">
              No tasks for this day.
            </Text>
          ) : (
            <View className="gap-2">
              {dayTasks.map((task) => (
                <View
                  key={task.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 flex-row items-center gap-3"
                >
                  <TouchableOpacity
                    onPress={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-md border-2 items-center justify-center ${
                      task.status === "completed"
                        ? "bg-primary border-primary"
                        : "border-white/30"
                    }`}
                  >
                    {task.status === "completed" && (
                      <Check size={10} color="white" />
                    )}
                  </TouchableOpacity>
                  <Text
                    numberOfLines={1}
                    className={`text-sm flex-1 ${
                      task.status === "completed"
                        ? "line-through text-white/30"
                        : "text-white"
                    }`}
                  >
                    {task.name}
                  </Text>
                  <Text className="text-white/30 text-[10px]">
                    {task.dueTime}
                  </Text>
                </View>
              ))}
            </View>
          )
        ) : dayHabits.length === 0 ? (
          <Text className="text-white/40 text-sm text-center py-6">
            No habits for this day.
          </Text>
        ) : (
          <View className="gap-2">
            {dayHabits.map((habit) => {
              const completed = habit.completedDates.includes(selectedDate);
              return (
                <View
                  key={habit.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 flex-row items-center gap-3"
                >
                  <TouchableOpacity
                    onPress={() => toggleHabitComplete(habit.id, selectedDate)}
                    className={`w-8 h-8 rounded-full items-center justify-center ${
                      completed ? "bg-primary" : "border-2 border-white/30"
                    }`}
                  >
                    <Check
                      size={16}
                      color={completed ? "white" : "rgba(255,255,255,0.3)"}
                    />
                  </TouchableOpacity>
                  <Text numberOfLines={1} className="text-white text-sm flex-1">
                    {habit.name}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <Flame size={12} color="#F59E0B" />
                    <Text className="text-accent text-xs font-semibold">
                      {habit.streak}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <FAB
        label={activeTab === "tasks" ? "New Task" : "New Habit"}
        onPress={() =>
          activeTab === "tasks"
            ? setShowCreateTask(true)
            : setShowCreateHabit(true)
        }
      />
      <CreateTaskSheet
        open={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        defaultDate={selectedDate}
      />
      <CreateHabitSheet
        open={showCreateHabit}
        onClose={() => setShowCreateHabit(false)}
      />
    </SafeAreaView>
  );
}
