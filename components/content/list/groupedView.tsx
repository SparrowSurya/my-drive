import React from "react";
import { GroupedContentData } from "../types";
import { TimelineGroupValues } from "@/lib/utils/date";
import { ListViewColumn, ViewContext } from "./types";
import ContentListView from "./view";


export type GroupedContentListViewProps = {
  data: GroupedContentData,
  cols: ListViewColumn[],
  showFolder: (id?: number) => void,
  showFile: (id?: number) => void,
  viewCtx?: ViewContext,
};

export default function GroupedContentListView({ data, cols, showFile, showFolder, viewCtx }: Readonly<GroupedContentListViewProps>) {
  const isEmpty = Object.keys(data).length === 0;
  if (isEmpty) return null;

  const groups = TimelineGroupValues.filter((group) => data[group] && data[group].length > 0);

  return (
    <>
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
              data={data[group]}
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
