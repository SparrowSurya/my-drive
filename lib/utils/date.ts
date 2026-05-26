
export const Months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const formatDate = (d: Date): string => {
  if (!d) return '';
  const date = d.getDate();
  const month = Months[d.getMonth()];
  const year = d.getFullYear();
  return `${date} ${month}, ${year}`;
}

export enum TimelineGroup {
  today = "Today",
  yesterday = "Yesterday",
  earlierThisWeek = "Earlier this week",
  lastWeek = "Last week",
  earlierThisMonth = "Earlier this month",
  lastMonth = "Last month",
  earlierThisYear = "Earlier this year",
  older = "Older",
}
export const TimelineGroupValues = [
  TimelineGroup.today,
  TimelineGroup.yesterday,
  TimelineGroup.earlierThisWeek,
  TimelineGroup.lastWeek,
  TimelineGroup.earlierThisMonth,
  TimelineGroup.lastMonth,
  TimelineGroup.earlierThisYear,
  TimelineGroup.older,
];

export function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function startOfWeek(date: Date) {
  const d = startOfDay(date);

  // Monday as first day of week
  const day = d.getDay(); // 0=Sun, 1=Mon
  const diff = day === 0 ? -6 : 1 - day;

  d.setDate(d.getDate() + diff);
  return d;
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function startOfYear(date: Date) {
  return new Date(date.getFullYear(), 0, 1);
}


export function groupByTimeline<T extends object>(items: T[], getDate: (i: T) => Date): Record<TimelineGroup, T[]> {
  items.sort((a, b) => getDate(b).getSeconds() - getDate(a).getSeconds());

  const now = new Date();

  const todayStart = startOfDay(now);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const weekStart = startOfWeek(now);

  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const monthStart = startOfMonth(now);

  const lastMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1,
  );

  const yearStart = startOfYear(now);

  const groups = Object.fromEntries(
    TimelineGroupValues.map((item) => [item, [] as T[]]),
  ) as Record<TimelineGroup, T[]>;

  for (const item of items) {
    const date = getDate(item);
    if (date >= todayStart) {
      groups[TimelineGroup.today].push(item);
    } else if (date >= yesterdayStart) {
      groups[TimelineGroup.yesterday].push(item);
    } else if (date >= weekStart) {
      groups[TimelineGroup.earlierThisWeek].push(item);
    } else if (date >= lastWeekStart) {
      groups[TimelineGroup.lastWeek].push(item);
    } else if (date >= monthStart) {
      groups[TimelineGroup.earlierThisMonth].push(item);
    } else if (date >= lastMonthStart) {
      groups[TimelineGroup.lastMonth].push(item);
    } else if (date >= yearStart) {
      groups[TimelineGroup.earlierThisYear].push(item);
    } else {
      groups[TimelineGroup.older].push(item);
    }
  }

  return groups;
}
