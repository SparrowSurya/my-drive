import { ReactNode } from "react";
import { RowData } from "../types";


export type ListViewColumns = "name" | "lastModified" | "fileSize" | "elipsis";

export type ListViewRow = Record<ListViewColumns, {
  head: string,
  body: (data: RowData, key: string) => ReactNode,
}>
