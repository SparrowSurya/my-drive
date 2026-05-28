"use client";

import { FileData } from "@/components/content/types";
import MenuButton from "@/components/menuButton";
import useFilter, { FilterPredicate, filters, mimeTypeByLabel } from "@/hooks/useFilter";
import FileIcon from "@/components/content/fileIcon";
import { Option } from "@/components/option";
import { ContentListView } from "@/components/content";
import { ListViewColumn } from "@/components/content/list/types";
import useShowContent from "@/hooks/useShowContent";
import utils from "@/lib/utils";
import EmptyState from "@/components/emptyState";
import { faCloud } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";


export type StorageViewProps = {
  data: FileData[],
  storageUsed: number,
};

const headings: ListViewColumn[] = ["name", "fileSize"];

export default function StorageView({ data, storageUsed }: Readonly<StorageViewProps>) {
  const { showFolder, showFile } = useShowContent();
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
    <>
      <div className="flex flex-row gap-4 mb-4 ml-3 shrink-0">
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
      <div className="flex-1 overflow-y-auto min-h-0 ml-3">
        {!isEmpty && (
          <div className="mb-8 mt-4 flex flex-row gap-2 justify-items-center items-center">
            <Icon icon={faCloud} className="w-24" style={{ transform: "scale(3)" }} />
            <div className="">
              <div className="text-lavender">Total used</div>
              <div className="text-4xl text-text font-medium">
                {utils.formatBytes(storageUsed)}
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col h-full">
          {isEmpty ? (
            <EmptyState isFiltered={isFiltersApplied} />
          ) : (
            <ContentListView
              data={filteredData}
              cols={headings}
              showFolder={showFolder}
              showFile={showFile}
              scrollable={false}
              className="flex flex-col w-full select-none"
            />
          )}
        </div>
      </div>
    </>
  );
}
