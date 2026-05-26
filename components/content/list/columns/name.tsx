import { SortOption } from "@/hooks/useSort";
import FileIcon from "../../fileIcon";
import { ListColumnContentBuilderProps, ListColumnHeadingBuilderProps } from "../types";
import Icon from "@/components/icon";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";


export function ListColumnNameHeading({ headings, applySort, sortOption }: Readonly<ListColumnHeadingBuilderProps>) {
  const myKey = "name";
  const order = sortOption?.order;
  const heading = headings[myKey] ?? "Name";
  const icon = sortOption?.key == myKey
    ? (order === "asc" ? faArrowUp : order === "desc" ? faArrowDown : null)
    : null;

  const sort = !!applySort ? () => {
    const nextOrder = order === "asc" ? "desc" : order === "desc" ? null : "asc";
    const opt = nextOrder === null ? null : {
      key: myKey,
      order: nextOrder,
    } as SortOption;
    applySort?.(opt);
  } : undefined;

  return (
    <div className={`flex items-center gap-1 ${sort && "hover:bg-overlay2/10"}`} onClick={sort}>
      { heading }
      {sort && icon && <Icon icon={icon} />}
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