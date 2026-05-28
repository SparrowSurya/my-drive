"use client";

import React from "react";
import useContentView from "@/hooks/useContentView";
import EmptyState from "@/components/emptyState";
import { ContentData } from "@/components/content/types";
import useShowContent from "@/hooks/useShowContent";
import { ListViewColumn } from "@/components/content/list/types";
import useFilter, { FilterPredicate, filters, mimeTypeByLabel } from "@/hooks/useFilter";
import MenuButton from "@/components/menuButton";
import { Option } from "@/components/option";
import FileIcon from "@/components/content/fileIcon";
import { ContentGridView, ContentListView } from "@/components/content";
import ContentDropZone from "@/components/content/dropzone";


export type CustomViewProps = {
  data: ContentData[];
  cols: ListViewColumn[];
};

export default function StarredCustomView({ data, cols }: Readonly<CustomViewProps>) {
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

  const isFiltersApplied = Object.keys(activeFilters).length > 0;
  const isEmpty = filteredData.length === 0;

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
        <ContentDropZone>
          {(isEmpty && !isFiltersApplied) && <EmptyState isFiltered={isFiltersApplied} />}
          {(isEmpty && isFiltersApplied) && <EmptyState isFiltered={isFiltersApplied} />}

          {!isEmpty && (
            gridView
              ? <ContentGridView
                  data={filteredData}
                  showFolder={showFolder}
                  showFile={showFile}
                />
              : <ContentListView
                  data={filteredData}
                  cols={cols}
                  showFolder={showFolder}
                  showFile={showFile}
                />
          )}
        </ContentDropZone>
      </div>
    </div>
  );
}
