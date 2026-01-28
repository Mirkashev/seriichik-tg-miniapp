import dayjs from "dayjs";

export type StreakState = "normal" | "sad" | "cold" | "burn";

export function getStreakState(lastIncrementAt: Date, todayStart: Date, count: number): StreakState {
  if (!lastIncrementAt) {
    return "normal";
  }

  const todStart = dayjs(todayStart);
  const lastIncrementDate = dayjs(lastIncrementAt);

  if (count < 3) {
    if (todStart.diff(lastIncrementDate, "hour") >= 24) {
      return "burn";
    }

    if (lastIncrementDate.isBefore(todayStart)) {
      return "sad";
    }

    return "normal";
  }

  if (todStart.diff(lastIncrementDate, "hour") >= 72) {
    return "burn";
  }

  if (todStart.diff(lastIncrementDate, "hour") >= 24) {
    return "cold";
  }

  if (lastIncrementDate.isBefore(todayStart)) {
    return "sad";
  }

  return "normal";
}
