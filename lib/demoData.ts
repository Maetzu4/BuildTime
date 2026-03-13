import { Habit, HomeSection, Project, Task } from "./types";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

const today = todayStr();

export const DEMO_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "House Renovation",
    color: "#6750A4",
    icon: "home",
    createdAt: today,
  },
  {
    id: "p2",
    name: "Client XYZ",
    color: "#1E88E5",
    icon: "briefcase",
    createdAt: today,
  },
];

export const DEMO_TASKS: Task[] = [
  {
    id: "t1",
    projectId: "p1",
    name: "Buy materials (Wood, Screws)",
    dueDate: today,
    dueTime: "10:00 AM",
    status: "pending",
    createdAt: today,
  },
  {
    id: "t2",
    projectId: "p1",
    name: "Call plumber for pipes",
    dueDate: today,
    dueTime: "02:00 PM",
    status: "completed",
    createdAt: today,
  },
  {
    id: "t3",
    projectId: "p2",
    name: "Send invoice #1024",
    dueDate: today,
    dueTime: "05:00 PM",
    status: "pending",
    createdAt: today,
  },
];

export const DEMO_HABITS: Habit[] = [
  {
    id: "h1",
    projectId: "p1",
    name: "Clean workspace",
    frequency: "daily",
    weeklyDays: [],
    streak: 5,
    completedDates: [],
    createdAt: today,
  },
  {
    id: "h2",
    projectId: "p2",
    name: "Review daily logs",
    frequency: "daily",
    weeklyDays: [],
    streak: 12,
    completedDates: [today],
    createdAt: today,
  },
];

export const DEFAULT_HOME_SECTIONS: HomeSection[] = [
  { id: "summary", visible: true, order: 0 },
  { id: "projects-filter", visible: true, order: 1 },
  { id: "tasks-today", visible: true, order: 2 },
  { id: "habits-today", visible: true, order: 3 },
];
