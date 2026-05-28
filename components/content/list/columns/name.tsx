import { SortOption } from "@/hooks/useSort";
import FileIcon from "../../fileIcon";
import { ListColumnContentBuilderProps, ListColumnHeadingBuilderProps } from "../types";
import Icon from "@/components/icon";
import { faArrowDown, faArrowUp, faStar } from "@fortawesome/free-solid-svg-icons";
import usePageView from "@/hooks/usePageView";


export function ListColumnNameHeading({ headings, applySort, sortOption }: Readonly<ListColumnHeadingBuilderProps>) {
  const page = usePageView();
  const myKey = "name";
  const order = sortOption?.order;
  const heading = headings[myKey] ?? "Name";
  const icon = sortOption?.key == myKey
    ? (order === "asc" ? faArrowUp : order === "desc" ? faArrowDown : null)
    : null;

  const enable = page !== "recent" && page !== "storage";
  const sort = (!!applySort && enable) ? () => {
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
    <div className="flex flex-row items-center gap-0 overflow-hidden">
      <FileIcon mimeType={mimeType} className="shrink-0" />
      <span className="truncate whitespace-nowrap overflow-hidden">{ data.name }</span>
      {data.starred && <Icon icon={faStar} className="text-text shrink-0 size-3" style={{ transform: "scale(0.75)" }} />}
    </div>
  );
}