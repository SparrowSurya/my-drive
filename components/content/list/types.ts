import { ReactNode } from "react";
import { ContentData } from "../types";
import { SortOption } from "@/hooks/useSort";


export type ListViewColumn = (
    "name"
  | "reason"
  | "owner"
  | "updatedAt"
  | "deletedAt"
  | "fileSize"
  | "location"
  | "elipsis"
);

export const listColumnTemplate: Record<ListViewColumn, string> = {
  "name": "minmax(0,4fr)",
  "reason": "minmax(0,2fr)",
  "owner": "minmax(0,2fr)",
  "updatedAt": "minmax(0,2fr)",
  "deletedAt": "minmax(0,2fr)",
  "fileSize": "120px",
  "location": "minmax(0,2fr)",
  "elipsis": "64px",
} as const;

export type ListColumnHeadingBuilderProps = {
  headings: Partial<Record<ListViewColumn, string>>;
  applySort?: (opt: SortOption | null) => void;
  sortOption?: SortOption | null,
};

export type ListColumnContentBuilderProps = {
  data: ContentData;
};

export type ListColumnHeadingBuilder = (key: string, props: Readonly<ListColumnHeadingBuilderProps>) => ReactNode;
export type ListColumnContentBuilder = (key: string, props: Readonly<ListColumnContentBuilderProps>) => ReactNode;

export type ListColumnBuilder = {
  heading: ListColumnHeadingBuilder;
  content: ListColumnContentBuilder;
};
