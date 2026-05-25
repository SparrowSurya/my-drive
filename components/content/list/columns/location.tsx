import { faFolder, faHardDrive } from "@fortawesome/free-solid-svg-icons";
import { ListColumnContentBuilderProps, ListColumnHeadingBuilderProps } from "../types";
import Icon from "@/components/icon";


export function ListColumnLocationHeading({ headings }: Readonly<ListColumnHeadingBuilderProps>) {
  const heading = headings["location"] ?? "Location";

  return (
    <div className="flex items-center">
      { heading }
    </div>
  );
}


export function ListColumnLocationContent({ data }: Readonly<ListColumnContentBuilderProps>) {
  const icon = !!data.parent ? faFolder : faHardDrive;
  const location = !!data.parent ? data.parent : "My Drive";

  return (
    <div className="flex flex-row items-center">
      <Icon icon={icon} />
      <span className="ml-2 truncate">{ location }</span>
    </div>
  );
}