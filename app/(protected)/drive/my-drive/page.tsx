import { Metadata } from "next";
import FileView from "./view";
import Breadcrumbs from "@/components/breadcrumbs";


export const metadata: Metadata = {
  title: "My Drive - Drive",
};

const segments = [{ name: "My Drive", url: "/drive/my-dive" }];

export default async function MyDrivePage() {
  return (
    <>
      <div className="flex flex-row">
        <Breadcrumbs
          className="text-2xl cursor-pointer"
          style={{ transform: "translateX(-12px)" }}
          data={segments}
        />
      </div>
      <FileView />
    </>
  );
}
