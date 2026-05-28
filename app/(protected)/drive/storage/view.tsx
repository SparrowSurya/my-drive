"use client";

import { FileData } from "@/components/content/types";
import useFilter, { FilterType } from "@/hooks/useFilter";
import { ContentListView } from "@/components/content";
import { ListViewColumn } from "@/components/content/list/types";
import useShowContent from "@/hooks/useShowContent";
import utils from "@/lib/utils";
import EmptyState from "@/components/emptyState";
import { faCloud } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import FilterButtons from "@/components/filterButtons";


export type StorageViewProps = {
  data: FileData[],
  storageUsed: number,
};

export default function StorageView({ data, storageUsed }: Readonly<StorageViewProps>) {
  const { showFolder, showFile } = useShowContent();
  const filter = useFilter({ data });

  const headings: ListViewColumn[] = ["name", "fileSize"];
  const filterTypes: FilterType[] = ["mimeType", "updatedAt"];
  const isFiltersApplied = Object.keys(filter.activeFilters).length > 0;
  const isEmpty = filter.filteredData.length === 0;

  return (
    <>
      <FilterButtons filter={filter} filterTypes={filterTypes} />
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
              data={filter.filteredData}
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
