"use client";

import useContentView from "@/hooks/useContentView";
import EmptyState, { EmptyStateProps } from "../emptyState";
import { GroupedContentData } from "./types";
import GroupedContentGridView from "./grid/groupedView";
import GroupedContentListView from "./list/groupedView";
import useShowContent from "@/hooks/useShowContent";
import { ListViewColumn, ViewContext } from "./list/types";


export type GroupedContentViewProps = {
  data: GroupedContentData,
  emptyStateProps: EmptyStateProps,
  cols: ListViewColumn[],
  viewCtx?: ViewContext,
};

export default function GroupedContentView({ data, cols, emptyStateProps, viewCtx }: Readonly<GroupedContentViewProps>) {
  const { showFolder, showFile } = useShowContent();
  const { gridView } = useContentView();
  const isEmpty = Object.keys(data).length === 0;

  return (
    <>
      {isEmpty && <EmptyState {...emptyStateProps} />}
      {!isEmpty && (
        gridView
          ? <GroupedContentGridView
              data={data}
              showFolder={showFolder}
              showFile={showFile}
              viewCtx={viewCtx}
            />
          : <GroupedContentListView
              data={data}
              cols={cols}
              showFolder={showFolder}
              showFile={showFile}
              viewCtx={viewCtx}
            />
      )}
    </>
  );
}