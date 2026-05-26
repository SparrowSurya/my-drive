"use client";

import Breadcrumbs from "@/components/breadcrumbs";
import ContentView from "../../../../components/content/view";
import Icon from "@/components/icon";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { ContentData } from "@/components/content/types";
import { SegmentData } from "@/components/breadcrumbs/breadcrumbs";
import ContentViewToggleButton from "@/components/contentViewToggleButton";
import { EmptyStateProps } from "@/components/emptyState";
import MenuButton from "@/components/menuButton";
import useFilter, { FilterBuilders, FilterPredicate } from "@/hooks/useFilter";
import { isArchive, isAudio, isDocument, isImage, isPdf, isPresentation, isSpreadsheet, isVideo } from "@/lib/mime/utils";
import utils from "@/lib/utils";
import FileIcon from "@/components/content/fileIcon";
import { Option } from "@/components/option";


export type FolderViewProps = {
  data: ContentData[],
  segments: SegmentData[],
  emptyStateProps: EmptyStateProps,
};

const filters = {
  mimeType: [
    ["Documents", FilterBuilders.filter("mimeType", (v) => isDocument(v))],
    ["Images", FilterBuilders.filter("mimeType", (v) => isImage(v))],
    ["Videos", FilterBuilders.filter("mimeType", (v) => isVideo(v))],
    ["Audio", FilterBuilders.filter("mimeType", (v) => isAudio(v))],
    ["PDFs", FilterBuilders.filter("mimeType", (v) => isPdf(v))],
    ["Spreadsheets", FilterBuilders.filter("mimeType", (v) => isSpreadsheet(v))],
    ["Presentations", FilterBuilders.filter("mimeType", (v) => isPresentation(v))],
    ["Archives", FilterBuilders.filter("mimeType", (v) => isArchive(v))],
    ["Files", FilterBuilders.filter("type", (v) => v === "file")],
    ["Folders", FilterBuilders.filter("type", (v) => v === "folder")],
  ],
  updatedAt: [
    ["Today", FilterBuilders.isAfter("updatedAt", utils.startOfDay(new Date()))],
    ["This week", FilterBuilders.isAfter("updatedAt", utils.startOfWeek(new Date()))],
    ["This month", FilterBuilders.isAfter("updatedAt", utils.startOfMonth(new Date()))],
    ["This year", FilterBuilders.isAfter("updatedAt", utils.startOfYear(new Date()))],
    ["Last year", FilterBuilders.inDateRange(
      "updatedAt",
      utils.startOfYear(new Date(new Date().getFullYear() - 1, 0, 1)),
      utils.startOfYear(new Date())
    )],
  ],
};

const mimeTypeByLabel: Record<string, string | undefined> = {
  "Documents": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "Images": "image/png",
  "Videos": "video/mp4",
  "Audio": "audio/wav",
  "PDFs": "application/pdf",
  "Spreadsheets": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "Presentations": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "Archives": "application/zip",
  "Files": "",
  "Folders": undefined,
};

export default function FolderView({ data, segments, emptyStateProps }: Readonly<FolderViewProps>) {
  const { filteredData, activeFilters, applyFilter } = useFilter({ data });
  console.log("FileteredData:", filteredData);

  const selectedMimeOption = filters.mimeType.find(([label]) => activeFilters[label as string])?.[0] as string | undefined;
  const selectedModifiedOption = filters.updatedAt.find(([label]) => activeFilters[label as string])?.[0] as string | undefined;

  const mimeOptions = filters.mimeType.map(([label, fn]) => ({
    label,
    leading: <FileIcon mimeType={mimeTypeByLabel[label as string]} />,
    props: {
      className: `option-item ${selectedMimeOption === label ? "selected" : ""}`,
      onClick() {
        console.log("Label:", label, mimeTypeByLabel[label as string]);
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
    image: '/assets/svg/empty_state_recent.svg',
    title: 'No matching results',
    para: 'Adjust your filters or try searching all of Drive',
  };

  const isFiltersApplied = Object.keys(activeFilters).length > 0;

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-full">
      <div className="flex flex-row justify-between shrink-0 mb-4">
        <Breadcrumbs
          className="text-2xl cursor-pointer"
          style={{ transform: "translateX(-12px)" }}
          data={segments}
        />
        <div className="flex flex-row gap-2 items-center">
          <ContentViewToggleButton visible={data.length > 0} />
          { (data.length > 0) && <Icon icon={faInfoCircle} hover={true} /> }
        </div>
      </div>
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
      <div className="ml-3 flex-1 flex flex-col min-h-0">
        <ContentView data={filteredData} emptyStateProps={isFiltersApplied ? filterEmptyState : emptyStateProps} />
      </div>
    </div>
  );
}
