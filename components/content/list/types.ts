import { ReactNode } from "react";
import { ContentData } from "../types";


export type ListViewColumns = (
    "name"
  | "lastModified"
  | "fileSize"
  | "elipsis"
  | "reason"
  | "owner"
);

export const colDivisions: Record<ListViewColumns, string> = {
  "name": "minmax(0,3fr)",
  "lastModified": "minmax(0,2fr)",
  "fileSize": "minmax(0,2fr)",
  "reason": "minmax(0,2fr)",
  "owner": "minmax(0,2fr)",
  "elipsis": "64px",
} as const;


export type ListViewRow = Record<ListViewColumns, {
  head: string,
  body: (data: ContentData, key: string) => ReactNode,
}>
