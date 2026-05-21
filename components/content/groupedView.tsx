"use client";

import useContentView from "@/hooks/useContentView";
import EmptyState, { EmptyStateProps } from "../emptyState";
import { ContentGroupData } from "./types";
import { TimelineGroupValues } from "@/lib/utils/date";

export type ContentGroupedViewProps = {
  data: ContentGroupData,
  emptyStateProps: EmptyStateProps,
};

// TODO
export default function ContentGroupedView({ data, emptyStateProps }: Readonly<ContentGroupedViewProps>) {
  const { gridView } = useContentView();
  const isEmpty = Object.keys(data).length === 0;

  return (
    <>
      {isEmpty && <EmptyState {...emptyStateProps} />}
      {!isEmpty && !gridView && (
        TimelineGroupValues.map((group) => {
          return (
            <div key={`GridGroup-${group}`} className="">
              {data[group].map((content) => (
                <div key={`GridItem-${content.id}`}>{ content.name }</div>
              ))}
            </div>
          );
        })
      )}
    </>
  );
}