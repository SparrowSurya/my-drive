import Image from "next/image";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { FileListView } from "@/components/fileView";
import { FileType } from "@/components/fileView/fileIcon";
import { FileInfo } from "@/components/fileView/types";
import { formatDate } from "@/lib/utils/date";

const headings = ["Name", "Last modified", "File size", ""];

async function getRootFolders(): Promise<FileInfo[] | null> {
  const session = await getServerSession();
  const { user: { email } } = session!;

  let folders = null;

  const user = await prisma.user.findFirst({ where: { email }, select: { id: true } });
  if (user === null) return null;

  const rootFolder = await prisma.folder.findFirst({
    where: { userId: user.id, parentId: null },
    select: { id: true },
  });
  if (rootFolder) {
    folders = await prisma.folder.findMany({
      where: { userId: user.id, parentId: rootFolder.id },
      select: { id: true, name: true, parentId: true, updatedAt: true },
    });
  }

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
