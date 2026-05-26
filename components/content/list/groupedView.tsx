import React from "react";
import { GroupedContentData } from "../types";
import { ListViewColumn } from "./types";
import ContentListView from "./view";
import useSort from "@/hooks/useSort";


export type GroupedContentListViewProps = {
  data: GroupedContentData,
  cols: ListViewColumn[],
  showFolder: (id?: number) => void,
  showFile: (id?: number) => void,
};

export default function GroupedContentListView({ data, cols, showFile, showFolder }: Readonly<GroupedContentListViewProps>) {
  const { sortedData, applySort, sortOption } = useSort({ data });
  const isEmpty = Object.keys(data).length === 0;

  if (isEmpty) return null;

  return (
    <>
      <div className="pb-2">
        <ContentListView
          showHeading={true}
          data={[]}
          cols={cols}
          showFile={showFile}
          showFolder={showFolder}
          internalSort={false}
          applySortProp={applySort}
          sortOptionProp={sortOption}
        />
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto">
        {Object.entries(sortedData).map(([group, data]) => (
          <div key={`ListGroup-${group}`}>
            <div className="sticky top-0 bg-mantle z-10 pb-1">
              <div className="text-md font-medium tracking-wide text-subtext0">
                {group}
              </div>
            </div>
            <ContentListView
              showHeading={false}
              data={data}
              cols={cols}
              showFile={showFile}
              showFolder={showFolder}
              internalSort={false}
            />
          </div>
        ))}
      </div>
    </>
  );
}
