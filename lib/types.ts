export type AccountMode = "demo" | "local" | "cloud";

export interface Project {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
}

export type TaskStatus = "pending" | "completed";

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  dueDate: string;
  dueTime: string;
  status: TaskStatus;
  createdAt: string;
}

export interface Habit {
  id: string;
  projectId: string;
  name: string;
  frequency: "daily" | "weekly";
  weeklyDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  streak: number;
  completedDates: string[]; // YYYY-MM-DD
  createdAt: string;
}

export interface HomeSection {
  id: string;
  visible: boolean;
  order: number;
}
