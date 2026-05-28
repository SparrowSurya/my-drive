/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { ContentData, GroupedContentData } from "@/components/content/types";
import { isArchive, isAudio, isDocument, isImage, isPdf, isPresentation, isSpreadsheet, isVideo } from "@/lib/mime/utils";
import utils from "@/lib/utils";


export type FilterPredicate = (item: ContentData) => boolean;

export type ActiveFilters = Record<string, FilterPredicate>;

export type FilterProps<T extends ContentData[] | GroupedContentData> = {
  data: T;
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

export default function useFilter<T extends ContentData[] | GroupedContentData>({ data }: Readonly<FilterProps<T>>) {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  const filteredData = useMemo(() => {
    const filterItem = (item: ContentData) => {
      return Object.values(activeFilters).every((predicate) => predicate(item));
    };

    if (Array.isArray(data)) {
      return data.filter(filterItem) as T;
    } else {
      const result = {} as GroupedContentData;
      for (const [group, items] of Object.entries(data)) {
        const filteredItems = (items as ContentData[]).filter(filterItem);
        if (filteredItems.length > 0) {
          result[group as keyof GroupedContentData] = filteredItems;
        }
      }
      return result as T;
    }
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

const filters = {
  mimeType: [
    ["Documents", FilterBuilders.filter("mimeType", (v) => isDocument(v))],
    ["Images", FilterBuilders.filter("mimeType", (v) => isImage(v))],
    ["Videos", FilterBuilders.filter("mimeType", (v) => isVideo(v))],
    ["Audio", FilterBuilders.filter("mimeType", (v) => isAudio(v))],
    ["PDFs", FilterBuilders.filter("mimeType", (v) => isPdf(v))],
    ["Spreadsheets", FilterBuilders.filter("mimeType", (v) => isSpreadsheet(v))],
    ["Presentations", FilterBuilders.filter("mimeType", (v) => isPresentation(v))],
    ["Archives", FilterBuilders.filter("mimeType", (v) => isArchive(v))],
    ["Files", FilterBuilders.filter("type", (v) => v === "file")],
    ["Folders", FilterBuilders.filter("type", (v) => v === "folder")],
  ],
  updatedAt: [
    ["Today", FilterBuilders.isAfter("updatedAt", utils.startOfDay(new Date()))],
    ["This week", FilterBuilders.isAfter("updatedAt", utils.startOfWeek(new Date()))],
    ["This month", FilterBuilders.isAfter("updatedAt", utils.startOfMonth(new Date()))],
    ["This year", FilterBuilders.isAfter("updatedAt", utils.startOfYear(new Date()))],
    ["Last year", FilterBuilders.inDateRange(
      "updatedAt",
      utils.startOfYear(new Date(new Date().getFullYear() - 1, 0, 1)),
      utils.startOfYear(new Date())
    )],
  ],
};

export type FilterType = keyof typeof filters;

const mimeTypeByLabel: Record<string, string | undefined> = {
  "Documents": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "Images": "image/png",
  "Videos": "video/mp4",
  "Audio": "audio/wav",
  "PDFs": "application/pdf",
  "Spreadsheets": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "Presentations": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "Archives": "application/zip",
  "Files": "",
  "Folders": undefined,
};

export { filters, mimeTypeByLabel };
