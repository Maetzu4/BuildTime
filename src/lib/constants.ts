import { ProjectTimeline } from "./types";

export const PROJECT_TIMELINES: ProjectTimeline[] = ["short", "mid", "long"];

export const PROJECT_TIMELINE_LABELS: Record<ProjectTimeline, string> = {
  short: "Short term",
  mid: "Mid term",
  long: "Long term",
};
