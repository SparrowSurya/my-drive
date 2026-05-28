"use client";

import Breadcrumbs from "@/components/breadcrumbs";
import ContentView from "../../../../../components/content/view";
import Icon from "@/components/icon";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { ContentData } from "@/components/content/types";
import { SegmentData } from "@/components/breadcrumbs/breadcrumbs";
import ContentViewToggleButton from "@/components/contentViewToggleButton";
import MenuButton from "@/components/menuButton";
import useFilter, { FilterPredicate, filters, mimeTypeByLabel } from "@/hooks/useFilter";
import FileIcon from "@/components/content/fileIcon";
import { Option } from "@/components/option";


export type FolderViewProps = {
  data: ContentData[],
  segments: SegmentData[],
};

export default function FolderView({ data, segments }: Readonly<FolderViewProps>) {
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

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-full">
      <div className="flex flex-row justify-between shrink-0 mb-4 ml-3">
        <Breadcrumbs
          className="cursor-pointer"
          data={segments}
        />
        <div className="flex flex-row gap-2 items-center">
          <ContentViewToggleButton visible={data.length > 0} />
          { (data.length > 0) && <Icon icon={faInfoCircle} hover={true} /> }
        </div>
      </div>
      <div className="flex flex-row gap-4 mb-4 ml-3">
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
      <div className="ml-3 flex-1 flex flex-col min-h-0">
        <ContentView data={filteredData} isFiltered={isFiltersApplied} />
      </div>
    </div>
  );
}
