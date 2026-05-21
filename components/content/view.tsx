"use client";

import React from "react";
import { ContentListView, ContentGridView } from "@/components/content";
import { ListViewColumns } from "@/components/content/list/types";
import { ContentData } from "@/components/content/types";
import ContentDropZone from "./dropzone";
import useShowContent from "@/hooks/useShowContent";
import useContentView from "@/hooks/useContentView";
import EmptyState, { EmptyStateProps } from "../emptyState";


const columns: ListViewColumns[] = ["name", "owner", "lastModified", "fileSize", "elipsis"];

export type ContentViewProps = {
  emptyStateProps: EmptyStateProps,
  data: ContentData[],
};

export default function ContentView({ data, emptyStateProps }: Readonly<ContentViewProps>) {
  const { showFolder, showFile } = useShowContent();
  const { gridView } = useContentView();

  return (
    <>
      <ContentDropZone>
        {(data === null || data.length == 0) && <EmptyState {...emptyStateProps} />}
        {
          data && data.length > 0 && (
            gridView
              ? <ContentGridView data={data} showFolder={showFolder} showFile={showFile} />
              : <ContentListView data={data} cols={columns} showFolder={showFolder} showFile={showFile} />
          )
        }
      </ContentDropZone>
      {
      }
    </>
  );
}
