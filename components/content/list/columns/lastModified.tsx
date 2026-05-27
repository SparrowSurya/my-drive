import utils from "@/lib/utils";
import { ListColumnContentBuilderProps, ListColumnHeadingBuilderProps } from "../types";
import { SortOption } from "@/hooks/useSort";
import Icon from "@/components/icon";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import usePageView from "@/hooks/usePageView";


export function ListColumnLastModifiedHeading({ headings, applySort, sortOption }: Readonly<ListColumnHeadingBuilderProps>) {
  const page = usePageView();
  const myKey = "updatedAt";
  const order = sortOption?.order;
  const icon = sortOption?.key == myKey
  ? (order === "asc" ? faArrowUp : order === "desc" ? faArrowDown : null)
  : null;

  const enable = page !== "recent";
  const heading = enable ? (headings[myKey] ?? "Last modified") : "";
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