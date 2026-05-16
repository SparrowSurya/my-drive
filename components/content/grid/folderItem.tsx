import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import Icon from "../../icon";
import FileIcon from "../fileIcon";
import { type FolderData } from "../types";


export type FolderGridItemProps = {
  folder: FolderData,
};


export default function FileGridItem({ folder }: Readonly<FolderGridItemProps>) {
  return (
    <div className="bg-surface2 hover:bg-surface1 px-2 py-3 rounded-2xl">
      <div className="flex flex-row items-center gap-3">
        <FileIcon type={"folder"} />
        <span className="flex-1">{ folder.name }</span>
        <Icon icon={faEllipsisVertical} hover />
      </div>
    </div>
  );
}
