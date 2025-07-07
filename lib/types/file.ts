import { fileTypes } from "@/lib/data/fileExtensions";


export type FileType = (typeof fileTypes)[number];

export type FileTree<T> = {
  [key: string]: T[] | FileTree<T>,
};
