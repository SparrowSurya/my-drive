import React from "react";
import { GroupedContentData } from "../types";
import { TimelineGroupValues } from "@/lib/utils/date";
import { ListViewColumn, ViewContext } from "./types";
import ContentListView from "./view";
import useFilter, { FilterPredicate, filters, mimeTypeByLabel } from "@/hooks/useFilter";
import FileIcon from "../fileIcon";
import { Option } from "@/components/option";
import MenuButton from "@/components/menuButton";
import EmptyState, { EmptyStateProps } from "../../emptyState";


export type GroupedContentListViewProps = {
  data: GroupedContentData,
  cols: ListViewColumn[],
  showFolder: (id?: number) => void,
  showFile: (id?: number) => void,
  viewCtx?: ViewContext,
};

export default function GroupedContentListView({ data, cols, showFile, showFolder, viewCtx }: Readonly<GroupedContentListViewProps>) {
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
  const groups = TimelineGroupValues.filter((group) => filteredData[group] && filteredData[group].length > 0);

  if (groups.length === 0 && isFiltersApplied) {
    return (
      <div className="flex flex-col flex-1 h-full">
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
        <div className="flex-1 flex flex-col items-center justify-center">
          <EmptyState {...filterEmptyState} />
        </div>
      </div>
    );
  }

  if (groups.length === 0) return null;

  return (
    <>
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
      <div className="pb-2">
        <ContentListView
          showHeading={true}
          data={[]}
          cols={cols}
          showFile={showFile}
          showFolder={showFolder}
          viewCtx={viewCtx}
        />
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto">
        {groups.map((group) => (
          <div key={`ListGroup-${group}`}>
            <div className="sticky top-0 bg-mantle z-10 pb-1">
              <div className="text-md font-medium tracking-wide text-subtext0">
                {group}
              </div>
            </div>
            <ContentListView
              showHeading={false}
              data={filteredData[group]}
              cols={cols}
              showFile={showFile}
              showFolder={showFolder}
              viewCtx={viewCtx}
            />
          </div>
        ))}
      </div>
    </>
  );
}