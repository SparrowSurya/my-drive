"use client";

import React from "react";
import { ContentListView, ContentGridView } from "@/components/content";
import { ListViewColumn } from "@/components/content/list/types";
import { ContentData } from "@/components/content/types";
import ContentDropZone from "./dropzone";
import useShowContent from "@/hooks/useShowContent";
import useContentView from "@/hooks/useContentView";
import EmptyState from "../emptyState";


export type ContentViewProps = {
  data: ContentData[];
  isFiltered?: boolean;
};

export default function ContentView({ data, isFiltered }: Readonly<ContentViewProps>) {
  const { showFolder, showFile } = useShowContent();
  const { gridView } = useContentView();

  const headings: ListViewColumn[] = [
    "name",
    "owner",
    "updatedAt",
    "fileSize",
    "elipsis",
  ];

  return (
    <>
      <ContentDropZone>
        {(data === null || data.length == 0) && <EmptyState isFiltered={isFiltered} />}
        {
          data && data.length > 0 && (
            gridView
              ? <ContentGridView data={data} showFolder={showFolder} showFile={showFile} />
              : <ContentListView data={data} cols={headings} showFolder={showFolder} showFile={showFile} />
          )
        }
      </ContentDropZone>
    </>
  );
}
