import { getFolderContents } from "./query";

export default async function FolderPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>,
}>) {
  const id = parseInt((await params).id);
  const { files, folders } = await getFolderContents(id);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg">Files</h3>
      <ul>
        {
          files.map((file) => (
            <li key={file.id}>
              Name:&nbsp;{ file.name }
            </li>
          ))
        }
      </ul>
      <h3 className="text-lg">Folders</h3>
      <ul>
        {
          folders.map((folder) => (
            <li key={folder.id}>
                Name:&nbsp;{ folder.name }
            </li>
          ))
        }
      </ul>
    </div>
  );
}