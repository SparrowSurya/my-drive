"use client";

import React from "react";
import useContentView from "@/hooks/useContentView";
import EmptyState, { EmptyStateProps } from "../emptyState";
import { GroupedContentData } from "./types";
import GroupedContentGridView from "./grid/groupedView";
import GroupedContentListView from "./list/groupedView";
import useShowContent from "@/hooks/useShowContent";
import { ListViewColumn, ViewContext } from "./list/types";
import useFilter, { FilterPredicate, filters, mimeTypeByLabel } from "@/hooks/useFilter";
import MenuButton from "../menuButton";
import { Option } from "../option";
import FileIcon from "./fileIcon";


export type GroupedContentViewProps = {
  data: GroupedContentData,
  emptyStateProps: EmptyStateProps,
  cols: ListViewColumn[],
  viewCtx?: ViewContext,
};

export default function GroupedContentView({ data, cols, emptyStateProps, viewCtx }: Readonly<GroupedContentViewProps>) {
  const { showFolder, showFile } = useShowContent();
  const { gridView } = useContentView();
  
  const { filteredData, activeFilters, applyFilter } = useFilter({ data });

  const selectedMimeOption = filters.mimeType.find(([label]) => activeFilters[label as string])?.[0] as string | undefined;
  const selectedModifiedOption = filters.updatedAt.find(([label]) => activeFilters[label as string])?.[0] as string | undefined;

  const mimeOptions = filters.mimeType.map(([label, fn]) => ({
    label,
    leading: <FileIcon mimeType={mimeTypeByLabel[label as string]} />,
    props: {
      className: `option-item ${selectedMimeOption === label ? "selected" : ""}`,
      onClick() {
        filters.mimeType.forEach(([l]) => {
          if (l !== label) applyFilter(l as string, null);
        });
        applyFilter(label as string, fn as FilterPredicate);
      },
    },
  } as Option));

  const modifiedOptions = filters.updatedAt.map(([label, fn]) => ({
    label,
    props: {
      className: `option-item ${selectedModifiedOption === label ? "selected" : ""}`,
      onClick() {
        filters.updatedAt.forEach(([l]) => {
          if (l !== label) applyFilter(l as string, null);
        });
        applyFilter(label as string, fn as FilterPredicate);
      },
    },
  } as Option));

  const filterEmptyState: EmptyStateProps = {
    image: "/assets/svg/empty_state_recent.svg",
    title: "No matching results",
    para: "Adjust your filters or try searching all of Drive",
  };

  const isFiltersApplied = Object.keys(activeFilters).length > 0;
  const isEmpty = Object.keys(filteredData).length === 0;

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      <div className="flex flex-row gap-4 mb-4">
        <MenuButton
          label="Type"
          selectedLabel={selectedMimeOption}
          options={mimeOptions}
          onClear={() => filters.mimeType.forEach(([label]) => applyFilter(label as string, null))}
        />
        <MenuButton
          label="Modified"
          selectedLabel={selectedModifiedOption}
          options={modifiedOptions}
          onClear={() => filters.updatedAt.forEach(([label]) => applyFilter(label as string, null))}
        />
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {(isEmpty && !isFiltersApplied) && <EmptyState {...emptyStateProps} />}
        {(isEmpty && isFiltersApplied) && <EmptyState {...filterEmptyState} />}
        
        {!isEmpty && (
          gridView
            ? <GroupedContentGridView
                data={filteredData}
                showFolder={showFolder}
                showFile={showFile}
                viewCtx={viewCtx}
              />
            : <GroupedContentListView
                data={filteredData}
                cols={cols}
                showFolder={showFolder}
                showFile={showFile}
                viewCtx={viewCtx}
              />
        )}
      </div>
    </div>
  );
}
