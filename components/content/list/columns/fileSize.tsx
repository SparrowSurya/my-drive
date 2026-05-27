import { ListColumnContentBuilderProps, ListColumnHeadingBuilderProps } from "../types";
import utils from "@/lib/utils";
import usePageView from "@/hooks/usePageView";
import { SortOption } from "@/hooks/useSort";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";


export function ListColumnFileSizeHeading({ headings, applySort, sortOption }: Readonly<ListColumnHeadingBuilderProps>) {
  const page = usePageView();
  const myKey = "fileSize";
  const order = sortOption?.order;
  const heading = headings[myKey] ?? "File Size";
  const icon = sortOption?.key == myKey
    ? (order === "asc" ? faArrowUp : order === "desc" ? faArrowDown : null)
    : null;

  const enable = page === "storage";
  const sort = (!!applySort && enable) ? () => {
    const nextOrder = order === "asc" ? "desc" : order === "desc" ? null : "asc";
    const opt = nextOrder === null ? null : {
      key: myKey,
      order: nextOrder,
    } as SortOption;
    applySort?.(opt);
  } : undefined;

  return (
    <div className={`flex items-center gap-1 ${sort && "hover:bg-overlay2/10 cursor-pointer"}`} onClick={sort}>
      { heading }
      {sort && icon && <Icon icon={icon} />}
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