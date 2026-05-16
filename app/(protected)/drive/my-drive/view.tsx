"use client";

import Breadcrumbs from "@/components/breadcrumbs";
import ContentView from "../../../../components/content/view";
import Icon from "@/components/icon";
import { faBars, faInfoCircle, faThLarge } from "@fortawesome/free-solid-svg-icons";
import { ContentData } from "@/components/content/types";
import { useState } from "react";
import { SegmentData } from "@/components/breadcrumbs/breadcrumbs";


export type FolderViewProps = {
  data: ContentData[],
  segments: SegmentData[],
};


export default function FolderView({ data, segments }: Readonly<FolderViewProps>) {
  const [gridView, setGridView] = useState(false);

  return (
    <>
      <div className="flex flex-row justify-between">
        <Breadcrumbs
          className="text-2xl cursor-pointer"
          style={{ transform: "translateX(-12px)" }}
          data={segments}
        />
        <div className="flex flex-row gap-2 items-center">
          <div className="inline-flex items-center rounded-full border shadow-sm overflow-hidden">
            <button
              className={`flex items-center justify-center transition px-3 gap-0 ${ gridView ? "" : "bg-surface1"}`}
              onClick={() => setGridView(false)}
            >
              <Icon icon={faBars} />
            </button>
            <button
              className={`flex items-center justify-center transition px-3 gap-0 border-l ${ gridView ? "bg-surface1" : ""}`}
              onClick={() => setGridView(true)}
            >
              <Icon icon={faThLarge} />
            </button>
          </div>
          <Icon icon={faInfoCircle} hover={true} />
        </div>
      </div>
      <ContentView data={data} gridView={gridView} />
    </>
  );
}
