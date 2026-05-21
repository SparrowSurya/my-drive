import { GroupedContentData } from "../types";
import { TimelineGroupValues } from "@/lib/utils/date";
import { ListViewColumns } from "./types";
import ContentListView from "./view";


export type GroupedContentListViewProps = {
  data: GroupedContentData,
  cols: ListViewColumns[],
  showFolder: (id: number) => void,
  showFile: (id: number) => void,
};

export default function GroupedContentListView({ data, cols, showFile, showFolder }: Readonly<GroupedContentListViewProps>) {
  const isEmpty = Object.keys(data).length === 0;
  if (isEmpty) return null;

  const groups = TimelineGroupValues.filter((group) => data[group].length > 0);

  return (
    <>
      <div className="pb-2">
        <ContentListView showHeading={true} data={[]} cols={cols} showFile={showFile} showFolder={showFolder} />
      </div>
      <div className="flex flex-col gap-6 overflow-y-auto">
        {groups.map((group) => (
          <>
            <div className="sticky top-0 bg-mantle z-10">
              <div className="text-md font-medium tracking-wide text-subtext0">
                {group}
              </div>
            </div>
            <div key={`ListGroup-${group}`} className="">
              <ContentListView showHeading={false} data={data[group]} cols={cols} showFile={showFile} showFolder={showFolder} />
            </div>
          </>
        ))}
      </div>
    </>
  );
}