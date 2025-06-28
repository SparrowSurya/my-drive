import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import NavItem from "./item";
import MenuButton from "./button";
import { navGroups } from "./data";
import { Folder } from "@/app/generated/prisma";

export default async function Navbar() {

  async function createFolder(folderName: string): Promise<Folder | null> {
    "use server";

    const session = await getServerSession();
    if (!session) return null;
    const { email } = session.user;
    const user = await prisma.user.findFirst({ where: { email }, select: { id: true } });
    if (user === null) return null;

    const where = { parentId: null, user: { email } }
    const select = { children: true, id: true };
    let rootFolder = await prisma.folder.findFirst({ where, select });
    if (rootFolder === null) {
      rootFolder = await prisma.folder.create({ data: { name: null, userId: user.id }, select });
    }

    const childExists = rootFolder.children.filter(f => f.name == folderName).length !== 0;
    if (!childExists) {
      return await prisma.folder.create({ data: { userId: user?.id, name: folderName, parentId: rootFolder.id } });
    }
    return null;
  }

  return (
    <nav className="ml-5 mt-2">
      <MenuButton createFolder={createFolder} />
      <div className="flex flex-col gap-3 mt-6">
        {
          navGroups.map((items, index) => (
            <div key={index} className="flex flex-col gap-1">
              {
                items.map((item, index) => (
                  <NavItem key={index} {...item} url={`/drive/${item.label.replaceAll(" ", "-").toLowerCase()}`} />
                ))
              }
            </div>
          ))
        }
      </div>
      <div className="text-subtext0">1.03 GB used</div>
    </nav>
  );
}
