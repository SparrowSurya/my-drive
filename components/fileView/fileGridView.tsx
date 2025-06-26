import FileGridItem, { type FileGridItemProps } from "./fileGridItem";

export type FileGridViewProps = {
  files: FileGridItemProps[],
};

export default function FileGridView({ files }: Readonly<FileGridViewProps>) {
  return (
    <div className="grid grid-cols-4 gap-3 p-3">
      {
        files.map((file, index) => <FileGridItem key={index} {...file} />)
      }
    </div>
  );
}