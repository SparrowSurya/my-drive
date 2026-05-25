import { ContentData } from "@/components/content/types";
import { useEffect, useState } from "react";


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
  const dateA = (a[field] as Date | undefined)?.getTime() ?? 0;
  const dateB = (b[field] as Date | undefined)?.getTime() ?? 0;
  const result = dateA - dateB;
  return ord === "asc" ? result : -result;
}

const contentDataCompareFn: Record<SortKey, ContentDataCompareFn> = {
  name: (a, b, ord) => compareText(a, b, ord, "name"),
  updatedAt: (a, b, ord) => compareDate(a, b, ord, "updatedAt"),
};

export type SortProps = {
  data: ContentData[],
};

export default function useSort({ data }: Readonly<SortProps>) {
  const [updatedData, setUpdatedData] = useState<ContentData[]>(data);
  const [sortOption, setSortOption] = useState<SortOption | null>(null);

  useEffect(() => {
    const newData = [ ...data ];
    const compareFn = sortOption === null
      ? null
      : contentDataCompareFn[sortOption.key];

    if (sortOption !== null && !!compareFn) {
      newData.sort((a, b) => compareFn(a, b, sortOption.order));
    }

    setUpdatedData(newData);
  }, [data, sortOption]);

  const applySort = (opt: SortOption | null) => setSortOption(opt);
  const clearSort = () => setSortOption(null);

  return {
    updatedData,
    sortOption,
    applySort,
    clearSort,
  };
}
