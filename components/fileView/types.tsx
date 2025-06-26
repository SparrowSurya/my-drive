import { JSX } from "react";
import { type FileType } from "./fileIcon";

export type FileInfo = {
  name: string,
  type: FileType,
  owner: string,
  avatar: JSX.Element,
  reason: string,
};
