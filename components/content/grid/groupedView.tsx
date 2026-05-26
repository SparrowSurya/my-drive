import { GroupedContentData } from "../types";
import { TimelineGroupValues } from "@/lib/utils/date";
import ContentGridView from "./view";
import { ViewContext } from "../list/types";


export type GroupedContentGridViewProps = {
  data: GroupedContentData,
  showFolder: (id?: number) => void,
  showFile: (id?: number) => void,
  viewCtx?: ViewContext,
};

export default function GroupedContentGridView({ data, showFile, showFolder, viewCtx }: Readonly<GroupedContentGridViewProps>) {
  const isEmpty = Object.keys(data).length === 0;
  if (isEmpty) return null;

  const groups = TimelineGroupValues.filter((group) => (data[group]?.length ?? 0) > 0);

  return (
    <div className="flex flex-col gap-6 overflow-y-auto">
      {groups.map((group) => (
        data[group].length === 0 ? null :
        <div key={`GridGroup-${group}`}>
          <div className="sticky top-0 bg-mantle z-10 pt-1 pb-2 mb-2">
            <div className="text-md font-medium tracking-wide text-subtext0">
              {group}
            </div>
          </div>
          <ContentGridView
            data={data[group]}
            showFile={showFile}
            showFolder={showFolder}
            viewCtx={viewCtx}
          />
        </div>
      ))}
    </div>
  );
}