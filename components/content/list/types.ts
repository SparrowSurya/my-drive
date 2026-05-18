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

export type ListViewRow = Record<ListViewColumns, {
  head: string,
  body: (data: ContentData, key: string) => ReactNode,
}>
