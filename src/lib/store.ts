import { create } from "zustand";
import type { ThemeColorSource, ThemeMode } from "./theme";
import type {
  Achievement,
  Habit,
  HomeSection,
  NavTab,
  Project,
  Task,
  UserProfile,
} from "./types";

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

// ── Sample Data (igual que el original) ──────────────────────
const SAMPLE_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Mobile App Redesign",
    description: "Redesign the mobile app with Material Design 3",
    timeline: "mid",
    targetDate: "2026-05-15",
    status: "active",
    createdAt: "2026-01-10",
  },
  {
    id: "p2",
    name: "Learn TypeScript",
    description: "Complete TypeScript learning path",
    timeline: "long",
    targetDate: "2026-08-01",
    status: "active",
    createdAt: "2026-01-05",
  },
  {
    id: "p3",
    name: "Fitness Goals",
    description: "Q1 fitness objectives",
    timeline: "short",
    targetDate: "2026-03-31",
    status: "active",
    createdAt: "2026-01-01",
  },
];

const SAMPLE_TASKS: Task[] = [
  {
    id: "t1",
    name: "Design system tokens",
    description: "Define color tokens for M3",
    projectId: "p1",
    dueDate: todayStr(),
    dueTime: "10:00",
    priority: "high",
    status: "todo",
    createdAt: "2026-02-25",
  },
  {
    id: "t2",
    name: "TypeScript generics chapter",
    description: "Read and practice generics",
    projectId: "p2",
    dueDate: todayStr(),
    dueTime: "14:00",
    priority: "medium",
    status: "todo",
    createdAt: "2026-02-26",
  },
  {
    id: "t3",
    name: "Review pull requests",
    description: "Review 3 pending PRs",
    projectId: "p1",
    dueDate: todayStr(),
    dueTime: "11:30",
    priority: "high",
    status: "todo",
    createdAt: "2026-02-27",
  },
  {
    id: "t4",
    name: "Update API documentation",
    description: "",
    projectId: "p1",
    dueDate: "2026-03-02",
    dueTime: "16:00",
    priority: "low",
    status: "todo",
    createdAt: "2026-02-20",
  },
  {
    id: "t5",
    name: "Grocery shopping",
    description: "Weekly groceries",
    projectId: null,
    dueDate: todayStr(),
    dueTime: "18:00",
    priority: "low",
    status: "todo",
    createdAt: "2026-02-28",
  },
  {
    id: "t6",
    name: "Prepare presentation",
    description: "Sprint demo presentation",
    projectId: "p1",
    dueDate: "2026-03-03",
    dueTime: "09:00",
    priority: "high",
    status: "todo",
    createdAt: "2026-02-22",
  },
];

const SAMPLE_HABITS: Habit[] = [
  {
    id: "h1",
    name: "Morning Meditation",
    projectId: "p3",
    frequency: "daily",
    weeklyDays: [],
    reminderTime: "07:00",
    streak: 12,
    longestStreak: 18,
    completedDates: [],
    createdAt: "2026-01-01",
  },
  {
    id: "h2",
    name: "Read 30 minutes",
    projectId: "p2",
    frequency: "daily",
    weeklyDays: [],
    reminderTime: "21:00",
    streak: 7,
    longestStreak: 14,
    completedDates: [],
    createdAt: "2026-01-15",
  },
  {
    id: "h3",
    name: "Exercise",
    projectId: "p3",
    frequency: "daily",
    weeklyDays: [],
    reminderTime: "06:30",
    streak: 5,
    longestStreak: 21,
    completedDates: [],
    createdAt: "2026-01-01",
  },
  {
    id: "h4",
    name: "Code Review",
    projectId: "p1",
    frequency: "weekly",
    weeklyDays: [1, 3, 5],
    reminderTime: "10:00",
    streak: 3,
    longestStreak: 8,
    completedDates: [],
    createdAt: "2026-02-01",
  },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "a1",
    title: "First Step",
    description: "Complete your first task",
    icon: "check-circle",
    unlocked: true,
    unlockedAt: "2026-01-15",
    requirement: 1,
    type: "tasks",
  },
  {
    id: "a2",
    title: "Task Master",
    description: "Complete 10 tasks",
    icon: "trophy",
    unlocked: true,
    unlockedAt: "2026-02-10",
    requirement: 10,
    type: "tasks",
  },
  {
    id: "a3",
    title: "Centurion",
    description: "Complete 100 tasks",
    icon: "award",
    unlocked: false,
    unlockedAt: null,
    requirement: 100,
    type: "tasks",
  },
  {
    id: "a4",
    title: "Habit Starter",
    description: "Maintain a 3-day streak",
    icon: "flame",
    unlocked: true,
    unlockedAt: "2026-01-20",
    requirement: 3,
    type: "streak",
  },
  {
    id: "a5",
    title: "Streak Week",
    description: "Maintain a 7-day streak",
    icon: "zap",
    unlocked: true,
    unlockedAt: "2026-02-15",
    requirement: 7,
    type: "streak",
  },
  {
    id: "a6",
    title: "Streak Month",
    description: "Maintain a 30-day streak",
    icon: "star",
    unlocked: false,
    unlockedAt: null,
    requirement: 30,
    type: "streak",
  },
  {
    id: "a7",
    title: "Project Launcher",
    description: "Create your first project",
    icon: "rocket",
    unlocked: true,
    unlockedAt: "2026-01-05",
    requirement: 1,
    type: "projects",
  },
  {
    id: "a8",
    title: "Multi-tasker",
    description: "Have 5 active projects",
    icon: "layers",
    unlocked: false,
    unlockedAt: null,
    requirement: 5,
    type: "projects",
  },
  {
    id: "a9",
    title: "Habit Builder",
    description: "Create 5 habits",
    icon: "repeat",
    unlocked: false,
    unlockedAt: null,
    requirement: 5,
    type: "habits",
  },
  {
    id: "a10",
    title: "Perfectionist",
    description: "Complete all tasks in a day",
    icon: "sparkles",
    unlocked: false,
    unlockedAt: null,
    requirement: 1,
    type: "tasks",
  },
];

const DEFAULT_HOME_SECTIONS: HomeSection[] = [
  { id: "summary", label: "Summary Card", visible: true },
  { id: "projects-filter", label: "Project Filter", visible: true },
  { id: "tasks-today", label: "Tasks Today", visible: true },
  { id: "habits-today", label: "Habits Today", visible: true },
];

// ── Store ─────────────────────────────────────────────────────
interface AppState {
  navTab: NavTab;
  onboardingStep: number;
  onboardingComplete: boolean;
  darkMode: boolean;
  themeMode: ThemeMode;
  themeSource: ThemeColorSource;
  themeSeedColor: string;
  user: UserProfile;
  tasks: Task[];
  habits: Habit[];
  projects: Project[];
  achievements: Achievement[];
  homeSections: HomeSection[];
  selectedProjectFilter: string | null;
  selectedDate: string;

  // Actions
  setNavTab: (tab: NavTab) => void;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
  toggleDarkMode: () => void;
  setDarkMode: (v: boolean) => void;
  setThemeMode: (m: ThemeMode) => void;
  setThemeSource: (s: ThemeColorSource) => void;
  setThemeSeedColor: (c: string) => void;
  updateUser: (u: Partial<UserProfile>) => void;
  setProjectFilter: (id: string | null) => void;
  setSelectedDate: (d: string) => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addHabit: (
    habit: Omit<
      Habit,
      "id" | "createdAt" | "streak" | "longestStreak" | "completedDates"
    >,
  ) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitComplete: (id: string, date?: string) => void;
  addProject: (project: Omit<Project, "id" | "createdAt" | "status">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleHomeSection: (id: string) => void;
  reorderHomeSections: (from: number, to: number) => void;
  deleteAllData: () => void;
  signOut: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  navTab: "home",
  onboardingStep: 0,
  onboardingComplete: false,
  darkMode: true,
  themeMode: "system",
  themeSource: "dynamic",
  themeSeedColor: "#6C3FC5", // Default purple brand
  user: { name: "", email: "", avatar: "" },
  tasks: SAMPLE_TASKS,
  habits: SAMPLE_HABITS,
  projects: SAMPLE_PROJECTS,
  achievements: DEFAULT_ACHIEVEMENTS,
  homeSections: DEFAULT_HOME_SECTIONS,
  selectedProjectFilter: null,
  selectedDate: todayStr(),

  setNavTab: (tab) => set({ navTab: tab }),
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  completeOnboarding: () => set({ onboardingComplete: true, navTab: "home" }),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
  setDarkMode: (v) => set({ darkMode: v }),
  setThemeMode: (m) => set({ themeMode: m }),
  setThemeSource: (s) => set({ themeSource: s }),
  setThemeSeedColor: (c) => set({ themeSeedColor: c }),
  updateUser: (u) => set((s) => ({ user: { ...s.user, ...u } })),
  setProjectFilter: (id) => set({ selectedProjectFilter: id }),
  setSelectedDate: (d) => set({ selectedDate: d }),

  addTask: (task) =>
    set((s) => ({
      tasks: [
        ...s.tasks,
        { ...task, id: generateId(), createdAt: todayStr(), status: "todo" },
      ],
    })),
  updateTask: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  deleteTask: (id) =>
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
  toggleTask: (id) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "completed" ? "todo" : "completed" }
          : t,
      ),
    })),

  addHabit: (habit) =>
    set((s) => ({
      habits: [
        ...s.habits,
        {
          ...habit,
          id: generateId(),
          createdAt: todayStr(),
          streak: 0,
          longestStreak: 0,
          completedDates: [],
        },
      ],
    })),
  updateHabit: (id, updates) =>
    set((s) => ({
      habits: s.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    })),
  deleteHabit: (id) =>
    set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),
  toggleHabitComplete: (id, date) =>
    set((s) => {
      const d = date || todayStr();
      return {
        habits: s.habits.map((h) => {
          if (h.id !== id) return h;
          const completed = h.completedDates.includes(d);
          const newDates = completed
            ? h.completedDates.filter((dd) => dd !== d)
            : [...h.completedDates, d];
          const newStreak = completed
            ? Math.max(0, h.streak - 1)
            : h.streak + 1;
          return {
            ...h,
            completedDates: newDates,
            streak: newStreak,
            longestStreak: Math.max(h.longestStreak, newStreak),
          };
        }),
      };
    }),

  addProject: (project) =>
    set((s) => ({
      projects: [
        ...s.projects,
        {
          ...project,
          id: generateId(),
          createdAt: todayStr(),
          status: "active",
        },
      ],
    })),
  updateProject: (id, updates) =>
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  deleteProject: (id) =>
    set((s) => ({
      projects: s.projects.filter((p) => p.id !== id),
      tasks: s.tasks.map((t) =>
        t.projectId === id ? { ...t, projectId: null } : t,
      ),
      habits: s.habits.map((h) =>
        h.projectId === id ? { ...h, projectId: null } : h,
      ),
    })),

  toggleHomeSection: (id) =>
    set((s) => ({
      homeSections: s.homeSections.map((sec) =>
        sec.id === id ? { ...sec, visible: !sec.visible } : sec,
      ),
    })),
  reorderHomeSections: (from, to) =>
    set((s) => {
      const arr = [...s.homeSections];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { homeSections: arr };
    }),

  deleteAllData: () =>
    set({
      tasks: [],
      habits: [],
      projects: [],
      user: { name: "", email: "", avatar: "" },
      achievements: DEFAULT_ACHIEVEMENTS.map((a) => ({
        ...a,
        unlocked: false,
        unlockedAt: null,
      })),
    }),
  signOut: () =>
    set({
      onboardingComplete: false,
      onboardingStep: 0,
      navTab: "home",
      user: { name: "", email: "", avatar: "" },
    }),
}));
