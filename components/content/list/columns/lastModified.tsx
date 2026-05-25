import utils from "@/lib/utils";
import { ListColumnContentBuilderProps, ListColumnHeadingBuilderProps } from "../types";
import { SortOption } from "@/hooks/useSort";
import Icon from "@/components/icon";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";


export function ListColumnLastModifiedHeading({ headings, applySort, sortOption }: Readonly<ListColumnHeadingBuilderProps>) {
  const myKey = "updatedAt";
  const order = sortOption?.order;
  const heading = headings[myKey] ?? "Last modified";
  const icon = sortOption?.key == myKey
    ? (order === "asc" ? faArrowUp : order === "desc" ? faArrowDown : null)
    : null;
  const sort = () => {
    const nextOrder = order === "asc" ? "desc" : order === "desc" ? null : "asc";
    const opt = nextOrder === null ? null : {
      key: myKey,
      order: nextOrder,
    } as SortOption;
    applySort?.(opt);
  };

  return (
    <div className="flex items-center gap-1 hover:bg-overlay2/10" onClick={sort}>
      { heading }
      {icon && <Icon icon={icon} />}
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