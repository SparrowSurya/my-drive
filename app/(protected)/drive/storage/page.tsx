import { Metadata } from "next";
import StorageView from "./view";
import { getFilesData } from "./query";
import { storageUsed } from "../@navbar/query";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";


export const metadata: Metadata = {
  title: "Storage - Drive",
};

export default async function StoragePage() {
  const [files, storage] = await Promise.all([
    getFilesData(),
    storageUsed(),
  ]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-full">
      <div className="flex flex-row justify-between shrink-0 mb-4 ml-3">
        <div className="drivePageHeading">Storage</div>
        <div className="flex flex-row gap-2 items-center">
          <Icon icon={faInfoCircle} hover={true} />
        </div>
      </div>
      <StorageView data={files} storageUsed={storage} />
    </div>
  );
}
