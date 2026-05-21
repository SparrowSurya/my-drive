import { ReactNode } from "react";
import { ContentData } from "../types";


export type ListViewColumns = (
    "name"
  | "reason"
  | "owner"
  | "lastModified"
  | "dateTrashed"
  | "fileSize"
  | "location"
  | "elipsis"
);

export const colDivisions: Record<ListViewColumns, string> = {
  "name": "minmax(0,4fr)",
  "reason": "minmax(0,2fr)",
  "owner": "minmax(0,2fr)",
  "lastModified": "minmax(0,2fr)",
  "dateTrashed": "minmax(0,2fr)",
  "fileSize": "minmax(0,1fr)",
  "location": "minmax(0,2fr)",
  "elipsis": "64px",
} as const;


export type ListViewRow = Record<ListViewColumns, {
  head: string,
  body: (data: ContentData, key: string) => ReactNode,
}>
