import { useAppStore } from "@/lib/store";
import type { HabitFrequency, Priority, ProjectTimeline } from "@/lib/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { X } from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ── Helpers ───────────────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().split("T")[0];
}

// ── Sheet base ────────────────────────────────────────────────
function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/50"
        activeOpacity={1}
        onPress={onClose}
      />
      <View className="bg-dark rounded-t-3xl border-t border-white/10 max-h-[85%]">
        {/* Handle */}
        <View className="items-center pt-3 pb-1">
          <View className="w-10 h-1 rounded-full bg-white/20" />
        </View>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3">
          <Text className="text-white text-lg font-semibold">{title}</Text>
          <TouchableOpacity
            onPress={onClose}
            className="w-8 h-8 rounded-full bg-white/10 items-center justify-center"
          >
            <X size={16} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>
        <ScrollView
          className="px-5"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </View>
    </Modal>
  );
}

// ── Segmented Button ──────────────────────────────────────────
function SegmentedButton<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View className="flex-row bg-white/5 rounded-xl p-1 gap-1">
      {options.map((o) => (
        <TouchableOpacity
          key={o.value}
          onPress={() => onChange(o.value)}
          className={`flex-1 h-9 rounded-lg items-center justify-center ${
            value === o.value ? "bg-primary" : ""
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              value === o.value ? "text-white" : "text-white/40"
            }`}
          >
            {o.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Field Label ───────────────────────────────────────────────
function FieldLabel({ label }: { label: string }) {
  return (
    <Text className="text-white/40 text-xs font-medium mb-2">{label}</Text>
  );
}

// ── StyledInput ───────────────────────────────────────────────
function StyledInput({
  placeholder,
  value,
  onChangeText,
  multiline,
}: {
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="rgba(255,255,255,0.25)"
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm ${
        multiline ? "min-h-[80px] py-3" : "h-12"
      }`}
    />
  );
}

// ── Project Picker ────────────────────────────────────────────
function ProjectPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const projects = useAppStore((s) => s.projects).filter(
    (p) => p.status === "active",
  );
  const options = [{ id: "none", name: "No project" }, ...projects];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-2">
        {options.map((p) => (
          <TouchableOpacity
            key={p.id}
            onPress={() => onChange(p.id)}
            className={`h-9 px-4 rounded-lg items-center justify-center ${
              value === p.id ? "bg-primary" : "bg-white/10"
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                value === p.id ? "text-white" : "text-white/50"
              }`}
            >
              {p.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

// ── SaveButton ────────────────────────────────────────────────
function SaveButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-full h-12 bg-primary rounded-xl items-center justify-center mt-2"
    >
      <Text className="text-white font-semibold text-base">{label}</Text>
    </TouchableOpacity>
  );
}

// ── Create Task Sheet ─────────────────────────────────────────
export function CreateTaskSheet({
  open,
  onClose,
  defaultDate,
}: {
  open: boolean;
  onClose: () => void;
  defaultDate?: string;
}) {
  const addTask = useAppStore((s) => s.addTask);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("none");
  const [dueDate, setDueDate] = useState(defaultDate || todayStr());
  const [dueTime, setDueTime] = useState("12:00");
  const [priority, setPriority] = useState<Priority>("medium");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  function handleSave() {
    if (!name.trim()) return;
    addTask({
      name: name.trim(),
      description,
      projectId: projectId === "none" ? null : projectId,
      dueDate,
      dueTime,
      priority,
    });
    reset();
  }

  function reset() {
    setName("");
    setDescription("");
    setProjectId("none");
    setDueDate(todayStr());
    setDueTime("12:00");
    setPriority("medium");
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={reset} title="New Task">
      <View className="gap-4">
        <StyledInput
          placeholder="Task name *"
          value={name}
          onChangeText={setName}
        />
        <StyledInput
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <View>
          <FieldLabel label="Project" />
          <ProjectPicker value={projectId} onChange={setProjectId} />
        </View>

        {/* Date & Time */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <FieldLabel label="Due Date" />
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="h-12 bg-white/5 border border-white/10 rounded-xl px-4 justify-center"
            >
              <Text className="text-white text-sm">{dueDate}</Text>
            </TouchableOpacity>
          </View>
          <View>
            <FieldLabel label="Time" />
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              className="h-12 w-24 bg-white/5 border border-white/10 rounded-xl px-4 justify-center"
            >
              <Text className="text-white text-sm">{dueTime}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={new Date(dueDate)}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, date) => {
              setShowDatePicker(false);
              if (date) setDueDate(date.toISOString().split("T")[0]);
            }}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={(() => {
              const d = new Date();
              const [h, m] = dueTime.split(":");
              d.setHours(+h, +m);
              return d;
            })()}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, date) => {
              setShowTimePicker(false);
              if (date)
                setDueTime(
                  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
                );
            }}
          />
        )}

        <View>
          <FieldLabel label="Priority" />
          <SegmentedButton
            options={[
              { label: "High", value: "high" },
              { label: "Medium", value: "medium" },
              { label: "Low", value: "low" },
            ]}
            value={priority}
            onChange={setPriority}
          />
        </View>

        <SaveButton label="Create Task" onPress={handleSave} />
      </View>
    </BottomSheet>
  );
}

// ── Create Habit Sheet ────────────────────────────────────────
export function CreateHabitSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const addHabit = useAppStore((s) => s.addHabit);
  const [name, setName] = useState("");
  const [projectId, setProjectId] = useState("none");
  const [frequency, setFrequency] = useState<HabitFrequency>("daily");
  const [weeklyDays, setWeeklyDays] = useState<number[]>([1, 3, 5]);
  const [reminderTime, setReminderTime] = useState("08:00");
  const [showTimePicker, setShowTimePicker] = useState(false);

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function toggleDay(d: number) {
    setWeeklyDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  }

  function handleSave() {
    if (!name.trim()) return;
    addHabit({
      name: name.trim(),
      projectId: projectId === "none" ? null : projectId,
      frequency,
      weeklyDays: frequency === "weekly" ? weeklyDays : [],
      reminderTime,
    });
    reset();
  }

  function reset() {
    setName("");
    setProjectId("none");
    setFrequency("daily");
    setWeeklyDays([1, 3, 5]);
    setReminderTime("08:00");
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={reset} title="New Habit">
      <View className="gap-4">
        <StyledInput
          placeholder="Habit name *"
          value={name}
          onChangeText={setName}
        />

        <View>
          <FieldLabel label="Project" />
          <ProjectPicker value={projectId} onChange={setProjectId} />
        </View>

        <View>
          <FieldLabel label="Frequency" />
          <SegmentedButton
            options={[
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
            ]}
            value={frequency}
            onChange={setFrequency}
          />
        </View>

        {frequency === "weekly" && (
          <View className="flex-row gap-1.5">
            {DAYS.map((label, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => toggleDay(i)}
                className={`flex-1 h-10 rounded-lg items-center justify-center ${
                  weeklyDays.includes(i) ? "bg-secondary" : "bg-white/10"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    weeklyDays.includes(i) ? "text-white" : "text-white/40"
                  }`}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View>
          <FieldLabel label="Reminder Time" />
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            className="h-12 bg-white/5 border border-white/10 rounded-xl px-4 justify-center"
          >
            <Text className="text-white text-sm">{reminderTime}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={(() => {
                const d = new Date();
                const [h, m] = reminderTime.split(":");
                d.setHours(+h, +m);
                return d;
              })()}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, date) => {
                setShowTimePicker(false);
                if (date)
                  setReminderTime(
                    `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
                  );
              }}
            />
          )}
        </View>

        <SaveButton label="Create Habit" onPress={handleSave} />
      </View>
    </BottomSheet>
  );
}

// ── Create Project Sheet ──────────────────────────────────────
export function CreateProjectSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const addProject = useAppStore((s) => s.addProject);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [timeline, setTimeline] = useState<ProjectTimeline>("mid");
  const [targetDate, setTargetDate] = useState("2026-06-01");
  const [showDatePicker, setShowDatePicker] = useState(false);

  function handleSave() {
    if (!name.trim()) return;
    addProject({ name: name.trim(), description, timeline, targetDate });
    reset();
  }

  function reset() {
    setName("");
    setDescription("");
    setTimeline("mid");
    setTargetDate("2026-06-01");
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={reset} title="New Project">
      <View className="gap-4">
        <StyledInput
          placeholder="Project name *"
          value={name}
          onChangeText={setName}
        />
        <StyledInput
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <View>
          <FieldLabel label="Timeline" />
          <SegmentedButton
            options={[
              { label: "Short", value: "short" },
              { label: "Mid", value: "mid" },
              { label: "Long", value: "long" },
            ]}
            value={timeline}
            onChange={setTimeline}
          />
        </View>

        <View>
          <FieldLabel label="Target Date" />
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="h-12 bg-white/5 border border-white/10 rounded-xl px-4 justify-center"
          >
            <Text className="text-white text-sm">{targetDate}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(targetDate)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, date) => {
                setShowDatePicker(false);
                if (date) setTargetDate(date.toISOString().split("T")[0]);
              }}
            />
          )}
        </View>

        <SaveButton label="Create Project" onPress={handleSave} />
      </View>
    </BottomSheet>
  );
}
