import { Avatar } from "@/components/avatar";
import { ListColumnContentBuilderProps, ListColumnHeadingBuilderProps } from "../types";


export function ListColumnOwnerHeading({ headings }: Readonly<ListColumnHeadingBuilderProps>) {
  const heading = headings["owner"] ?? "Owner";

  return (
    <div className="flex items-center">
      { heading }
    </div>
  );
}


export function ListColumnOwnerContent({ data }: Readonly<ListColumnContentBuilderProps>) {
  const owner = data.isMe ? 'me' : data.owner;

  return (
    <div className="flex flex-row items-center gap-2">
      <Avatar
        text={data.owner}
        className={`bg-lavender text-base`}
        size="small"
      />
      <div className="max-w-30 truncate">{ owner }</div>
    </div>
  );
}