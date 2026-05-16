"use client";

import Breadcrumbs from "@/components/breadcrumbs";
import ContentView from "../../../../components/content/view";
import Icon from "@/components/icon";
import { faBars, faInfoCircle, faThLarge } from "@fortawesome/free-solid-svg-icons";
import { ContentData } from "@/components/content/types";
import { SegmentData } from "@/components/breadcrumbs/breadcrumbs";
import useContentView from "@/hooks/useContentView";
import { useRouter } from "next/navigation";


export type FolderViewProps = {
  data: ContentData[],
  segments: SegmentData[],
};


export default function FolderView({ data, segments }: Readonly<FolderViewProps>) {
  const router = useRouter();
  const { view, updateView } = useContentView();
  const gridView = view == 'grid';

  const openFolder = (id: number): void => {
    router.push(`/drive/folder/${id}`);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex flex-row justify-between shrink-0 mb-4">
        <Breadcrumbs
          className="text-2xl cursor-pointer"
          style={{ transform: "translateX(-12px)" }}
          data={segments}
        />
        <div className="flex flex-row gap-2 items-center">
          <div className="inline-flex items-center rounded-full border shadow-sm overflow-hidden">
            <button
              className={`flex items-center justify-center transition px-3 gap-0 ${ gridView ? "" : "bg-surface1"}`}
              onClick={() => updateView('list')}
            >
              <Icon icon={faBars} />
            </button>
            <button
              className={`flex items-center justify-center transition px-3 gap-0 border-l ${ gridView ? "bg-surface1" : ""}`}
              onClick={() => updateView('grid')}
            >
              <Icon icon={faThLarge} />
            </button>
          </div>
          <Icon icon={faInfoCircle} hover={true} />
        </div>
      </div>
      <ContentView
        data={data}
        gridView={gridView}
        openFolder={openFolder}
      />
    </div>
  );
}
