"use client";

import React from "react";
import { ContentListView, ContentGridView } from "@/components/content";
import { ListViewColumn } from "@/components/content/list/types";
import { ContentData } from "@/components/content/types";
import ContentDropZone from "./dropzone";
import useShowContent from "@/hooks/useShowContent";
import useContentView from "@/hooks/useContentView";
import EmptyState from "../emptyState";
import useFilter, { FilterType } from "@/hooks/useFilter";
import FilterButtons from "../filterButtons";


export type ContentViewProps = {
  data: ContentData[];
  filterTypes: FilterType[];
  headings: ListViewColumn[];
};

export default function ContentView({ data, headings, filterTypes }: Readonly<ContentViewProps>) {
  const filter = useFilter({ data });
  const { showFolder, showFile } = useShowContent();
  const { gridView } = useContentView();
  const isFiltersApplied = Object.keys(filter.activeFilters).length > 0;

  return (
    <div className="flex flex-col flex-1 gap-4 ml-3 min-h-0">
      <FilterButtons filter={filter} filterTypes={filterTypes} />
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <ContentDropZone>
          {(data === null || data.length == 0) && <EmptyState isFiltered={isFiltersApplied} />}
          {
            data && data.length > 0 && (
              gridView
                ? <ContentGridView data={filter.filteredData} showFolder={showFolder} showFile={showFile} />
                : <ContentListView data={filter.filteredData} cols={headings} showFolder={showFolder} showFile={showFile} />
            )
          }
        </ContentDropZone>
      </div>
    </div>
  );
}
