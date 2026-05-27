"use client";

import { faFolder, faHardDrive } from "@fortawesome/free-solid-svg-icons";
import { ListColumnContentBuilderProps, ListColumnHeadingBuilderProps } from "../types";
import Icon from "@/components/icon";
import useShowContent from "@/hooks/useShowContent";


import usePageView from "@/hooks/usePageView";


export function ListColumnLocationHeading({ headings }: Readonly<ListColumnHeadingBuilderProps>) {
  const page = usePageView();
  const heading = page === "trash" ? "Original Location" : headings["location"] ?? "Location";

  return (
    <div className="flex items-center">
      { heading }
    </div>
  );
}


export function ListColumnLocationContent({ data }: Readonly<ListColumnContentBuilderProps>) {
  const { showFolder } = useShowContent();

  const icon = !!data.parent ? faFolder : faHardDrive;
  const location = data.type === "file"
    ? data.location ?? "My Drive"
    : !!data.parent ? data.parent : "My Drive";

  return (
    <div
      className={`flex flex-row items-center`}
      onDoubleClick={(e) => {
        if (data.type === "file") {
          e.stopPropagation();
          showFolder(data.folderId);
        }
      }}
    >
      <Icon icon={icon} />
      <span className="ml-2 truncate">{ location }</span>
    </div>
  );
}