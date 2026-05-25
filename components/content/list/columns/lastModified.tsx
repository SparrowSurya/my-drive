import utils from "@/lib/utils";
import { ListColumnContentBuilderProps, ListColumnHeadingBuilderProps } from "../types";


export function ListColumnLastModifiedHeading({ headings }: Readonly<ListColumnHeadingBuilderProps>) {
  const heading = headings["updatedAt"] ?? "Last modified";

  return (
    <div className="flex items-center">
      { heading }
    </div>
  );
}


export function ListColumnLastModifiedContent({ data }: Readonly<ListColumnContentBuilderProps>) {
  const lastModified = data.updatedAt instanceof Date
    ? utils.formatDate(data.updatedAt)
    : "—";

  return (
    <div className="flex flex-row items-center">
      <span className="ml-2">{ lastModified }</span>
    </div>
  );
}