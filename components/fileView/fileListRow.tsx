import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import FileIcon from "./fileIcon";
import { type FileData } from "./types";

export type FileListRowProp = {
  file: FileData,
};

export default function FileListRow({ file }: Readonly<FileListRowProp>) {
  return (
    <tr className="h-12 hover:bg-surface1 border-b-2 border-surface0 cursor-pointer">
      <td>
        <div className="flex flex-row items-center h-12 pl-2">
          <FileIcon type={file.type} />
          <div className="">{ file.name }</div>
        </div>
      </td>
      <td>{ file.lastModified }</td>
      <td className={`${!file.size && "select-none"}`}>{ file.size ?? "—"}</td>
      <td className="w-12">
        <Icon icon={faEllipsisVertical} hover />
      </td>
    </tr>
  );
}
