import FileGridItem from "./fileGridItem";
import { type FileData } from "./types";

export type FileGridViewProps = {
  files: FileData[],
};

export default function FileGridView({ files }: Readonly<FileGridViewProps>) {
  return (
    <div className="grid grid-cols-4 gap-3 p-3">
      {
        files.map((file, index) => <FileGridItem key={index} file={file} />)
      }
    </div>
  );
}