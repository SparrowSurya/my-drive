import { ListColumnContentBuilderProps, ListColumnHeadingBuilderProps } from "../types";
import utils from "@/lib/utils";


export function ListColumnFileSizeHeading({ headings }: Readonly<ListColumnHeadingBuilderProps>) {
  const heading = headings["fileSize"] ?? "File Size";

  return (
    <div className="flex items-center">
      { heading }
    </div>
  );
}


export function ListColumnFileSizeContent({ data }: Readonly<ListColumnContentBuilderProps>) {
  const size = typeof data.size === "number"
    ? utils.formatBytes(data.size)
    : "—";

  return (
    <div className="flex flex-row items-center">
      <span className="ml-2">{ size }</span>
    </div>
  );
}