"use client";

import { useState } from "react";
import { faCaretDown, faCaretRight, faCheck, faBars, faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "@/components/icon";
import { FileListView, FileGridView } from "@/components/fileView";
import { type FileInfo } from "@/components/fileView/types";
import { Avatar } from "@/components/avatar";

const headings = [
  "Name",
  "Reason",
  "Owner",
  "",
];

const filesData = [
  {
    name: "Weekly Report.xlsx",
    type: "excel",
    owner: "Shelly",
    reason: "You modified",
    bg: "bg-lavender",
  },
  {
    name: "ProjectReport1.docx",
    type: "docx",
    owner: "Bea",
    reason: "Bea modified",
    bg: "bg-peach",
  },
  {
    type: "image",
    owner: "Shelly",
    name: "bird.png",
    reason: "You created",
    bg: "bg-lavender",
  },
  {
    type: "file",
    owner: "Shelly",
    name: "password.txt",
    reason: "You modified",
    bg: "bg-lavender",
  },
  {
    type: "excel",
    name: "TeamDetails.xlsx",
    owner: "Piper",
    reason: "Jessie modified",
    bg: "bg-pink",
  },
  {
    type: "excel",
    name: "Tasks.xlsx",
    owner: "Shelly",
    reason: "You created",
    bg: "bg-lavender",
  },
  {
    type: "file",
    name: "Training Plan",
    owner: "Crow",
    reason: "Crow modified",
    bg: "bg-yellow",
  },
  {
    type: "pdf",
    name: "computer networking.pdf",
    owner: "Shelly",
    reason: "You created",
    bg: "bg-lavender",
  },
  {
    type: "video",
    name: "memories.mp4",
    owner: "Shelly",
    reason: "You modified",
    bg: "bg-lavender",
  },
  {
    type: "file",
    name: "invoice",
    owner: "Shelly",
    reason: "You created",
    bg: "bg-lavender",
  },
  {
    type: "excel",
    name: "Monthly Report.xlsx",
    owner: "Shelly",
    reason: "You modified",
    bg: "bg-lavender",
  },
  {
    type: "docx",
    name: "ProjectReport.docx",
    owner: "Bea",
    reason: "Bea modified",
    bg: "bg-peach",
  },
];

export default function FileSuggestions() {
  const [show, setShow] = useState<boolean>(true);
  const [showList, setShowList] = useState<boolean>(true);

  const files = filesData.map((file) => ({
    type: file.type,
    name: file.name,
    owner: file.owner,
    reason: file.reason,
    avatar: <Avatar char={file.owner[0].toUpperCase()} className={`${file.bg} text-base`} size="medium" />
  })) as FileInfo[];

  return (
    <>
      <div className="flex flex-row justify-between">
        <button
          className="flex flex-row items-center rounded-4xl px-3 py-1 font-medium hover:text-blue hover:bg-blue/25"
          onClick={() => setShow(!show)}
        >
          <Icon icon={show ? faCaretDown : faCaretRight}  />
          <span className="mx-3">Suggested files</span>
        </button>
        {show && (
          <div className="flex flex-row border-1 rounded-4xl overflow-clip mx-3">
            <div
              className={`flex flex-row justify-center items-center gap-2 w-[64] ${showList && "bg-lavender text-base"}`}
              onClick={() => setShowList(true)}
            >
              {showList && <Icon icon={faCheck} />}
              <Icon icon={faBars} />
            </div>
            <div
              className={`flex flex-row justify-center items-center gap-2 w-[64] ${!showList && "bg-lavender text-base"}`}
              onClick={() => setShowList(false)}
            >
              {!showList && <Icon icon={faCheck} />}
              <Icon icon={faTableCellsLarge} />
            </div>
          </div>
        )}
      </div>
      {show && (
        <>
          { showList ? <FileListView headings={headings} files={files} /> : <FileGridView files={files} /> }
          <button
            className="flex flex-row gap-4 rounded-4xl px-5 py-1 my-4 font-semibold text-blue hover:bg-blue/25"
          >View more</button>
        </>
      )}
    </>
  );
}