import { faFolder, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { Icon, IconButton } from "@/components/icon";

export type FolderGridItemProps = {
  name: string,
};

export default function FolderGridItem({ name }: Readonly<FolderGridItemProps>) {
  return (
    <div
      className="flex flex-row items-center gap-3 bg-surface2 rounded-xl py-2 px-4 cursor-pointer hover:bg-surface1"
    >
      <Icon icon={faFolder} />
      <div className="flex-1 text-poppins">{ name }</div>
      <IconButton icon={faEllipsisVertical}  />
    </div>
  );
}
