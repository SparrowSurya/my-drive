"use client";

import React from "react";
import useFilter, { FilterPredicate, filters, FilterType, mimeTypeByLabel } from "@/hooks/useFilter";
import MenuButton from "@/components/menuButton";
import { Option } from "@/components/option";
import FileIcon from "@/components/content/fileIcon";


export type FilterButtonsProps = {
  filter: ReturnType<typeof useFilter>;
  filterTypes: FilterType[];
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

const FilterLabel: Record<FilterType, string> = {
  mimeType: "Type",
  updatedAt: "Modified",
};

export default function FilterButtons({ filter, filterTypes, className, ...restProps }: Readonly<FilterButtonsProps>) {
  const { activeFilters, applyFilter } = filter;

  if (filterTypes.length === 0) return null;

  return (
    <div className={className ?? "flex flex-row gap-4"} {...restProps}>
      {filterTypes.map((type) => {
        const filterGroup = filters[type];
        const selectedOption = filterGroup.find(([label]) => activeFilters[label as string])?.[0] as string | undefined;

        const options = filterGroup.map(([label, fn]) => ({
          label,
          leading: type === "mimeType" ? <FileIcon mimeType={mimeTypeByLabel[label as string]} /> : undefined,
          props: {
            className: `option-item ${selectedOption === label ? "selected" : ""}`,
            onClick() {
              filterGroup.forEach(([l]) => {
                if (l !== label) applyFilter(l as string, null);
              });
              applyFilter(label as string, fn as FilterPredicate);
            },
          },
        } as Option));

        return (
          <MenuButton
            key={type}
            label={FilterLabel[type]}
            selectedLabel={selectedOption}
            options={options}
            onClear={() => filterGroup.forEach(([label]) => applyFilter(label as string, null))}
          />
        );
      })}
    </div>
  );
}
