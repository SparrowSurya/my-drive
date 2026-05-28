"use client";

import Breadcrumbs from "@/components/breadcrumbs";
import ContentView from "../../../../../components/content/view";
import Icon from "@/components/icon";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { ContentData } from "@/components/content/types";
import { SegmentData } from "@/components/breadcrumbs/breadcrumbs";
import ContentViewToggleButton from "@/components/contentViewToggleButton";
import useFilter, { FilterType } from "@/hooks/useFilter";
import { ListViewColumn } from "@/components/content/list/types";


export type FolderViewProps = {
  data: ContentData[],
  segments: SegmentData[],
  filterTypes: FilterType[];
  headings: ListViewColumn[];
};

export default function FolderView({ data, segments, headings, filterTypes }: Readonly<FolderViewProps>) {
  const filter = useFilter({ data });

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
      <ContentView data={filter.filteredData} headings={headings} filterTypes={filterTypes} />
    </div>
  );
}
