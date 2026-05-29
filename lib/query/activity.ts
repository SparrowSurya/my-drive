import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";

export enum ActivityAction {
  created = "created",
  uploaded = "uploaded",
  opened = "opened",
  edited = "edited",
  moved = "moved",
  deleted = "deleted",
  restored = "restored",
  renamed = "renamed",
  starred = "starred",
  unstarred = "unstarred",
}

export type ContentType = "file" | "folder";

/**
 * Provide a queries interface for actual prisma queries.
 */
export default class ActivityQuery {

  /** Creates a single activity. */
  static async create<S extends Prisma.ActivitySelect>(
    actor: Prisma.UserWhereUniqueInput,
    action: ActivityAction,
    contentType: ContentType,
    id: number,
    select?: S,
  ): Promise<Prisma.ActivityGetPayload<{ select?: S }>> {
    const data = {
      name: action as string,
      actor: { connect: actor },
      file: contentType === "file" ? { connect: {id} } : undefined,
      folder: contentType === "folder" ? { connect: {id} } : undefined,
    };

    return await prisma.activity.create({ data, select });
  }

  /** Creates multiple activites for actor. */
  static async createMany(
    actor: Prisma.UserWhereUniqueInput,
    activities: Readonly<{
      action: ActivityAction,
      contentType: ContentType,
      id: number,
    }>[],
  ):Promise<Prisma.BatchPayload> {
    const user = await prisma.user.findUniqueOrThrow({ where: actor, select: { id: true } });

    const data = activities.map((activity) => ({
      name: activity.action as string,
      actorId: user.id,
      fileId: activity.contentType === "file" ? activity.id : null,
      folderId: activity.contentType === "folder" ? activity.id : null,
    }));

    return await prisma.activity.createMany({ data });
  }

  /** Read activities of a user. */
  static async readUserMany<S extends Prisma.ActivitySelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.ActivityWhereInput,
    select: S,
    options?: Readonly<{
      take?: number,
      skip?: number,
      orderBy?: Prisma.ActivityOrderByWithRelationInput | Prisma.ActivityOrderByWithRelationInput[],
    }>,
  ): Promise<Prisma.ActivityGetPayload<{ select: S }>[]> {
    return await prisma.activity.findMany({
      where: {
        ...where,
        actor: user,
      },
      select,
      ...options,
    })
  }

  /** Read activities on file. */
  static async readFileMany<S extends Prisma.ActivitySelect>(
    file: Prisma.FileWhereUniqueInput,
    where: Prisma.ActivityWhereInput,
    select: S,
    options?: Readonly<{
      take?: number,
      skip?: number,
      orderBy?: Prisma.ActivityOrderByWithRelationInput | Prisma.ActivityOrderByWithRelationInput[],
    }>,
  ): Promise<Prisma.ActivityGetPayload<{ select: S }>[]> {
    return await prisma.activity.findMany({
      where: { ...where, file },
      select,
      ...options,
    });
  }

  /** Read activities on folder. */
  static async readFolderMany<S extends Prisma.ActivitySelect>(
    folder: Prisma.FolderWhereUniqueInput,
    where: Prisma.ActivityWhereInput,
    select: S,
    options?: Readonly<{
      take?: number,
      skip?: number,
      orderBy?: Prisma.ActivityOrderByWithRelationInput | Prisma.ActivityOrderByWithRelationInput[],
    }>,
  ): Promise<Prisma.ActivityGetPayload<{ select: S }>[]> {
    return await prisma.activity.findMany({
      where: { ...where, folder },
      select,
      ...options,
    });
  }
}
