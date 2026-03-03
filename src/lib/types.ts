export type Priority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "completed" | "overdue";
export type HabitFrequency = "daily" | "weekly";
export type ProjectTimeline = "short" | "mid" | "long";
export type ProjectStatus = "active" | "completed" | "overdue";

export interface Task {
  id: string;
  name: string;
  description: string;
  projectId: string | null;
  dueDate: string;
  dueTime: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  projectId: string | null;
  frequency: HabitFrequency;
  weeklyDays: number[];
  reminderTime: string;
  streak: number;
  longestStreak: number;
  completedDates: string[];
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  timeline: ProjectTimeline;
  targetDate: string;
  status: ProjectStatus;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
  requirement: number;
  type: "tasks" | "habits" | "streak" | "projects";
}

export type AppScreen =
  | "onboarding"
  | "home"
  | "tasks"
  | "habits"
  | "projects"
  | "profile"
  | "settings"
  | "calendar"
  | "statistics"
  | "achievements";

export type NavTab = "home" | "tasks" | "habits" | "projects";

export interface HomeSection {
  id: string;
  label: string;
  visible: boolean;
}
