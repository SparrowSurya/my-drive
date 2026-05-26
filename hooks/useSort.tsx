import { ContentData, GroupedContentData } from "@/components/content/types";
import utils from "@/lib/utils";
import { useMemo, useState } from "react";


export type SortKey = "name" | "updatedAt";
export type SortOrder = "asc" | "desc";

export type SortOption = {
  key: SortKey,
  order: SortOrder,
};

export type ContentDataCompareFn = (a: ContentData, b: ContentData, ord: SortOrder) => number;

function compareText(a: ContentData, b: ContentData, ord: SortOrder, field: Extract<keyof ContentData, string>): number {
  const textA = (a[field] as string) ?? "";
  const textB = (b[field] as string) ?? "";
  const result = textA.localeCompare(textB, undefined, { sensitivity: 'base', numeric: true });
  return ord === "asc" ? result : -result;
}


function compareDate(a: ContentData, b: ContentData, ord: SortOrder, field: Extract<keyof ContentData, string>): number {
  const dateA = utils.toDate(a[field] as Date)?.getTime() ?? 0;
  const dateB = utils.toDate(b[field] as Date)?.getTime() ?? 0;
  const result = dateA - dateB;
  return ord === "asc" ? result : -result;
}

const contentDataCompareFn: Record<SortKey, ContentDataCompareFn> = {
  name: (a, b, ord) => compareText(a, b, ord, "name"),
  updatedAt: (a, b, ord) => compareDate(a, b, ord, "updatedAt"),
};

export type SortProps<T extends ContentData[] | GroupedContentData> = {
  data: T;
};

export default function useSort<T extends ContentData[] | GroupedContentData>({ data }: Readonly<SortProps<T>>) {
  const [sortOption, setSortOption] = useState<SortOption | null>(null);

  const sortedData = useMemo(() => {
    const compareFn = sortOption === null
      ? null
      : contentDataCompareFn[sortOption.key];

    const sortFn = (items: ContentData[]) => {
      const copy = [...items];
      if (sortOption !== null && !!compareFn) {
        copy.sort((a, b) => compareFn(a, b, sortOption.order));
      }
      return copy;
    };

    if (Array.isArray(data)) {
      return sortFn(data) as T;
    } else {
      const result = {} as GroupedContentData;
      for (const [group, items] of Object.entries(data)) {
        result[group as keyof GroupedContentData] = sortFn(items as ContentData[]);
      }
      return result as T;
    }
  }, [data, sortOption]);

  const applySort = (opt: SortOption | null) => setSortOption(opt);
  const clearSort = () => setSortOption(null);

  return {
    sortedData,
    sortOption,
    applySort,
    clearSort,
  };
}
