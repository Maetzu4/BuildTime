import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  DEFAULT_HOME_SECTIONS,
  DEMO_HABITS,
  DEMO_PROJECTS,
  DEMO_TASKS,
} from "./demoData";
import { AccountMode, Habit, HomeSection, Project, Task } from "./types";

interface AppState {
  accountMode: AccountMode | null;
  setAccountMode: (mode: AccountMode) => void;

  projects: Project[];
  tasks: Task[];
  habits: Habit[];
  homeSections: HomeSection[];
  selectedProjectFilter: string | null;

  setProjects: (projects: Project[]) => void;
  setTasks: (tasks: Task[]) => void;
  setHabits: (habits: Habit[]) => void;
  setHomeSections: (sections: HomeSection[]) => void;
  setProjectFilter: (projectId: string | null) => void;

  toggleTask: (taskId: string) => void;
  toggleHabitComplete: (habitId: string) => void;

  seedDemoData: () => void;
  clearData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      accountMode: null,
      setAccountMode: (mode) => set({ accountMode: mode }),

      projects: [],
      tasks: [],
      habits: [],
      homeSections: DEFAULT_HOME_SECTIONS,
      selectedProjectFilter: null,

      setProjects: (projects) => set({ projects }),
      setTasks: (tasks) => set({ tasks }),
      setHabits: (habits) => set({ habits }),
      setHomeSections: (homeSections) => set({ homeSections }),
      setProjectFilter: (selectedProjectFilter) =>
        set({ selectedProjectFilter }),

      toggleTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: t.status === "completed" ? "pending" : "completed",
                }
              : t,
          ),
        })),

      toggleHabitComplete: (habitId) => {
        const todayStr = new Date().toISOString().split("T")[0];
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id === habitId) {
              const completed = h.completedDates.includes(todayStr);
              let newCompletedDates = h.completedDates;
              let newStreak = h.streak;

              if (completed) {
                newCompletedDates = h.completedDates.filter(
                  (d) => d !== todayStr,
                );
                newStreak = Math.max(0, h.streak - 1);
              } else {
                newCompletedDates = [...h.completedDates, todayStr];
                newStreak = h.streak + 1;
              }

              return {
                ...h,
                streak: newStreak,
                completedDates: newCompletedDates,
              };
            }
            return h;
          }),
        }));
      },

      seedDemoData: () =>
        set({
          projects: DEMO_PROJECTS,
          tasks: DEMO_TASKS,
          habits: DEMO_HABITS,
          homeSections: DEFAULT_HOME_SECTIONS,
          selectedProjectFilter: null,
        }),

      clearData: () =>
        set({
          accountMode: null,
          projects: [],
          tasks: [],
          habits: [],
          selectedProjectFilter: null,
        }),
    }),
    {
      name: "buildtime-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
