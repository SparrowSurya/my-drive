"use client";

import React from "react";
import useContentView from "@/hooks/useContentView";
import EmptyState from "../emptyState";
import { GroupedContentData } from "./types";
import GroupedContentGridView from "./grid/groupedView";
import GroupedContentListView from "./list/groupedView";
import useShowContent from "@/hooks/useShowContent";
import { ListViewColumn } from "./list/types";
import useFilter, { FilterType } from "@/hooks/useFilter";
import FilterButtons from "../filterButtons";


export type GroupedContentViewProps = {
  data: GroupedContentData;
  cols: ListViewColumn[];
};

export default function GroupedContentView({ data, cols }: Readonly<GroupedContentViewProps>) {
  const { showFolder, showFile } = useShowContent();
  const { gridView } = useContentView();
  const filter = useFilter({ data });

  const filterTypes: FilterType[] = ["mimeType", "updatedAt"];
  const isFiltersApplied = Object.keys(filter.activeFilters).length > 0;
  const isEmpty = Object.keys(filter.filteredData).length === 0;

  return (
    <div className="flex flex-col flex-1 gap-4 h-full min-h-0">
      <FilterButtons filter={filter} filterTypes={filterTypes} />
      <div className="flex-1 flex flex-col min-h-0 p-0.5">
        {(isEmpty && !isFiltersApplied) && <EmptyState isFiltered={isFiltersApplied} />}
        {(isEmpty && isFiltersApplied) && <EmptyState isFiltered={isFiltersApplied} />}
        {!isEmpty && (
          gridView
            ? <GroupedContentGridView
                data={filter.filteredData}
                showFolder={showFolder}
                showFile={showFile}
              />
            : <GroupedContentListView
                data={filter.filteredData}
                cols={cols}
                showFolder={showFolder}
                showFile={showFile}
              />
        )}
      </div>
    </div>
  );
}
