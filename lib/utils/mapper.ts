import { Prisma } from "@/app/generated/prisma";
import { FileData, FolderData } from "@/components/content/types";
import { detectMimeTypeFromBuffer } from "../mime/detection";


/** Makes nested properties optional */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P];
};

type LooseFolder<S extends Prisma.FolderDefaultArgs> = DeepPartial<Prisma.FolderGetPayload<S>> & {
  user?: {
    email: string;
    name: string;
  } | null;
  parent?: {
    parentId: number;
  } | null;
  children?: Array<LooseFolder<S>> | null;
};

type LooseFile<S extends Prisma.FileDefaultArgs> = DeepPartial<Prisma.FileGetPayload<S>> & {
  folder?: {
    folderId: number;
    name: string;
    user?: {
      email: string,
      name: string,
    } | null;
  }
}

type ExtractType =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "undefined"
  | "function"
  | "symbol"
  | "bigint"
  | ArrayConstructor
  | DateConstructor
  | Uint8ArrayConstructor;


/** Extract the prop in obj with given type if matches type */
function extract<T>(obj: object | null | undefined, prop: string, type: ExtractType): T | undefined {
  if (obj === null  || obj === undefined || !(prop in obj)) return undefined;

  const value = (obj as Record<string, unknown>)[prop];
  const matches = type === Array
    ? Array.isArray(value)
    : typeof type === "function"
      ? value instanceof type
      : typeof value === type;

  return matches ? (value as T) : undefined
}

/** Maps prisma folder model to file data model */
export function map2FolderData<S extends Prisma.FolderDefaultArgs>(
  ownerEmail: string,
  folder: LooseFolder<S>,
): FolderData {
  const children = Array.isArray(folder.children)
    ? folder.children
    : undefined;

  return {
    type: "folder",
    reason: "in My Drive", // HARDCODE
    id: extract<number>(folder, "id", "number"),
    name: extract<string>(folder, "name", "string"),
    isMe: folder.user?.email === ownerEmail,
    owner: folder.user?.name ?? undefined,
    updatedAt: extract<Date>(folder, "updatedAt", Date),
    deletedAt: extract<Date>(folder, "deletedAt", Date),
    parentId: extract<number>(folder.parent, "parentId", "number"),
    children: children?.map((f) => map2FolderData(ownerEmail, f)),
  };
}

/** Maps prisma file model to file data model */
export function map2FileData<S extends Prisma.FileDefaultArgs>(
  ownerEmail: string,
  file: LooseFile<S>,
): FileData {
  const mimeType = extract<string>(file, "mimeType", "string") ?? "";
  const data = extract<Uint8Array>(file, "data", Uint8Array);

  return {
    type: "file",
    reason: "You uploaded", // HARDCODE
    id: extract<number>(file, "id", "number"),
    name: extract<string>(file, "name", "string"),
    size: extract<number>(file, "size", "number"),
    isMe: file.folder?.user?.email === ownerEmail,
    owner: file.folder?.user?.name ?? "Gabbar",
    updatedAt: extract<Date>(file, "updatedAt", Date),
    deletedAt: extract<Date>(file, "deletedAt", Date),
    folderId: extract<number>(file, "folderId", "number")
      ?? extract<number>(file.folder, "id", "number"),
    folderName: extract<string>(file.folder, "name", "string"),
    mimeType: mimeType === "" && !!data
      ? detectMimeTypeFromBuffer(data).mimeType
      : mimeType ?? "application/octet-stream",
  };
}
