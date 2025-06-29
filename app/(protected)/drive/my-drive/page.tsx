import Image from "next/image";
import { getServerSession } from "next-auth";
import { FileListView } from "@/components/fileView";
import { FileType } from "@/components/fileView/fileIcon";
import { FileData } from "@/components/fileView/types";
import { formatDate } from "@/lib/utils/date";
import { getOrCreateRootFolder, getFolders } from "@/lib/query/folder";

const headings = ["Name", "Last modified", "File size", ""];

async function getRootFolders(): Promise<FileData[] | null> {
  const session = await getServerSession();
  const { email } = session?.user ?? {};

  const root = await getOrCreateRootFolder({ email }, { id: true });
  const folders = await getFolders({ email }, { parentId: root.id }, { name: true, updatedAt: true });

  return folders?.map(f => ({
    name: f.name,
    type: "folder" as FileType,
    lastModified: formatDate(f.updatedAt),
    size: null,
  })) ?? null;
}

export default async function MyDrivePage() {
  const files = await getRootFolders();

  return (
    <>
      <div className="flex flex-row">
        <div className="text-2xl cursor-pointer">My Drive</div>
      </div>
      {
        (files === null || files.length == 0) && (
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
        files && files.length > 0 && (
          <>
            <div className="my-5">
              {/* TODO: filters */}
            </div>
            <FileListView headings={headings} files={files} />
          </>
        )
      }
    </>
  );
}
