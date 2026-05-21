"use client";

import Breadcrumbs from "@/components/breadcrumbs";
import ContentView from "../../../../components/content/view";
import Icon from "@/components/icon";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { ContentData } from "@/components/content/types";
import { SegmentData } from "@/components/breadcrumbs/breadcrumbs";
import ContentViewToggleButton from "@/components/contentViewToggleButton";
import { EmptyStateProps } from "@/components/emptyState";


export type FolderViewProps = {
  data: ContentData[],
  segments: SegmentData[],
  emptyStateProps: EmptyStateProps,
};

export default function FolderView({ data, segments, emptyStateProps }: Readonly<FolderViewProps>) {
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
      <div className="ml-3 flex-1 flex flex-col min-h-0">
        <ContentView data={data} emptyStateProps={emptyStateProps} />
      </div>
    </div>
  );
}
