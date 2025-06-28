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
        (files === null) && (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <Image
              src="/assets/svg/cat.svg"
              alt="cat with a file"
              width="160"
              height="160"
            />
            <div className="text-2xl">A place for all of your files</div>
          </div>
        )
      }
      {
        files && (
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
