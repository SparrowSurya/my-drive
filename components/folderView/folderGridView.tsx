import FolderGridItem, { type FolderGridItemProps } from "./folderGridItem";

export type FolderGridViewProps = {
  folders: FolderGridItemProps[],
};

export default function FolderGridView({ folders }: Readonly<FolderGridViewProps>) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {
        folders.map(({ name }) => <FolderGridItem key={name} name={name} />)
      }
    </div>
  );
}
