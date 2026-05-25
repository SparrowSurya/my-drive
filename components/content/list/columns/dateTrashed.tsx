import utils from "@/lib/utils";
import { ListColumnContentBuilderProps, ListColumnHeadingBuilderProps } from "../types";


export function ListColumnDateTrashedHeading({ headings }: Readonly<ListColumnHeadingBuilderProps>) {
  const heading = headings["deletedAt"] ?? "Date trashed";

  return (
    <div className="flex items-center">
      { heading }
    </div>
  );
}


export function ListColumnDateTrashedContent({ data }: Readonly<ListColumnContentBuilderProps>) {
  const dateTrashed = data.deletedAt instanceof Date
    ? utils.formatDate(data.deletedAt)
    : "—";

  return (
    <div className="flex flex-row items-center">
      <span className="ml-2">{ dateTrashed }</span>
    </div>
  );
}
