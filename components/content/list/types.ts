import { ReactNode } from "react";
import { ContentData } from "../types";


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
  "fileSize": "minmax(0,1fr)",
  "location": "minmax(0,2fr)",
  "elipsis": "64px",
} as const;

export type ViewContext = "home" | "my-drive" | "recent" | "trash";

type ListColumnBuilderProps = {
  viewCtx?: ViewContext;
};

export type ListColumnHeadingBuilderProps = {
  headings: Partial<Record<ListViewColumn, string>>;
} & ListColumnBuilderProps;

export type ListColumnContentBuilderProps = {
  data: ContentData;
} & ListColumnBuilderProps;

export type ListColumnHeadingBuilder = (key: string, props: Readonly<ListColumnHeadingBuilderProps>) => ReactNode;
export type ListColumnContentBuilder = (key: string, props: Readonly<ListColumnContentBuilderProps>) => ReactNode;

export type ListColumnBuilder = {
  heading: ListColumnHeadingBuilder;
  content: ListColumnContentBuilder;
};
