import Image from "next/image";
import { getServerSession } from "next-auth";
import { FileListView } from "@/components/fileView";
import { FileType, getFileType } from "@/components/fileView/fileIcon";
import { FileData } from "@/components/fileView/types";
import { formatDate } from "@/lib/utils/date";
import { getOrCreateRootFolder, getFolders } from "@/lib/query/folder";
import { getFiles } from "@/lib/query/file";
import { formatBytes } from "@/lib/utils/string";

const headings = ["Name", "Last modified", "File size", ""];

async function getFilesAndFolders(): Promise<FileData[]> {
  const session = await getServerSession();
  const { email } = session?.user ?? {};

  const root = await getOrCreateRootFolder({ email }, { id: true });
  const folders = await getFolders({ email }, { parentId: root.id }, { name: true, updatedAt: true });
  const files = await getFiles({ email }, { id: root.id }, undefined, { name: true, size: true, updatedAt: true });

  return [
    ...folders.map(f => ({
      name: f.name,
      type: "folder" as FileType,
      lastModified: formatDate(f.updatedAt),
      size: null,
    })),
    ...files.map(f => ({
      name: f.name,
      type: getFileType(f.name),
      lastModified: formatDate(f.updatedAt),
      size: formatBytes(f.size),
    })),
  ];
}

export default async function MyDrivePage() {
  const contents = await getFilesAndFolders();

  return (
    <>
      <div className="flex flex-row">
        <div className="text-2xl cursor-pointer">My Drive</div>
      </div>
      {
        (contents === null || contents.length == 0) && (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <hr
              className="absolute bg-overlay0 z-[20]"
              style={{
                transform: "translate(-5px, 8px)",
                width: "128px",
                height: "1px",
              }}
            />
            <Image
              src="/assets/svg/cat.svg"
              alt="cat with a file"
              width="160"
              height="160"
            />
            <div className="text-2xl mt-10">A place for all of your files</div>
            <div className="text-md text-subtext0 mt-2">Drag your files and folders here or use the &apos;New&apos; button to upload</div>
          </div>
        )
      }
      {
        contents && contents.length > 0 && (
          <>
            <div className="my-5">
              {/* TODO: filters */}
            </div>
            <FileListView headings={headings} files={contents} />
          </>
        )
      }
    </>
  );
}
