/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { ContentData } from "@/components/content/types";


export type FilterPredicate = (item: ContentData) => boolean;

export type ActiveFilters = Record<string, FilterPredicate>;

export type FilterProps = {
  data: ContentData[];
};

export type FilterFn = (value: any) => boolean;

export const FilterBuilders = {
  filter: <K extends keyof ContentData>(field: K, test: FilterFn) => {
    return (item: ContentData) => test(item[field] ?? "");
  },
  isOneOf: (field: "type", allowed: string[]) => {
    return (item: ContentData) => allowed.length === 0 || allowed.includes(item[field]);
  },
  matches: (field: "mimeType", pattern: RegExp) => {
    return (item: ContentData) => pattern.test(String(item[field] ?? ""));
  },
  inDateRange: (field: "updatedAt" | "deletedAt", start?: Date, end?: Date) => {
    return (item: ContentData) => {
      const val = item[field];
      if (!(val instanceof Date)) return false;
      const time = val.getTime();
      if (start && time < start.getTime()) return false;
      if (end && time > end.getTime()) return false;
      return true;
    };
  },
  isBefore: (field: "updatedAt" | "deletedAt", date: Date) => {
    return (item: ContentData) => {
      const val = item[field];
      return val instanceof Date && val.getTime() < date.getTime();
    };
  },
  isAfter: (field: "updatedAt" | "deletedAt", date: Date) => {
    return (item: ContentData) => {
      const val = item[field];
      return val instanceof Date && val.getTime() > date.getTime();
    };
  },
  equals: <K extends keyof ContentData>(field: K, value: any) => {
    return (item: ContentData) => item[field] === value;
  },
};

export default function useFilter({ data }: Readonly<FilterProps>) {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return Object.values(activeFilters).every((predicate) => predicate(item));
    });
  }, [data, activeFilters]);

  const applyFilter = (key: string, predicate: FilterPredicate | null) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (predicate === null) {
        delete next[key];
      } else {
        next[key] = predicate;
      }
      return next;
    });
  };

  const clearFilters = () => setActiveFilters({});

  return {
    filteredData,
    activeFilters,
    applyFilter,
    clearFilters,
  };
}
