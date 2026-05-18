"use client";

import Breadcrumbs from "@/components/breadcrumbs";
import ContentView from "../../../../components/content/view";
import Icon from "@/components/icon";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { ContentData } from "@/components/content/types";
import { SegmentData } from "@/components/breadcrumbs/breadcrumbs";
import ContentViewToggleButton from "@/components/contentViewToggleButton";


export type FolderViewProps = {
  data: ContentData[],
  segments: SegmentData[],
};

export default function FolderView({ data, segments }: Readonly<FolderViewProps>) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
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
      <div className="ml-3">
        <ContentView data={data} />
      </div>
    </div>
  );
}
