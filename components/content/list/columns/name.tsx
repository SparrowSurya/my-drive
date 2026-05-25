import FileIcon from "../../fileIcon";
import { ListColumnContentBuilderProps, ListColumnHeadingBuilderProps } from "../types";


export function ListColumnNameHeading({ headings }: Readonly<ListColumnHeadingBuilderProps>) {
  const heading = headings["name"] ?? "Name";

  return (
    <div className="flex items-center">
      { heading }
    </div>
  );
}


export function ListColumnNameContent({ data }: Readonly<ListColumnContentBuilderProps>) {
  const mimeType = data.type === "file" ? data.mimeType : undefined;

  return (
    <div className="flex flex-row items-center truncate">
      <FileIcon mimeType={mimeType} />
      <span className="truncate overflow-hidden whitespace-nowrap">{ data.name }</span>
    </div>
  );
}