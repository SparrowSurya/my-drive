// "use client";

// import { useState } from "react";
// import { faCaretDown, faCaretRight, faCheck, faBars, faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
// import Icon from "@/components/icon";
// import { FileListView, FileGridView } from "@/components/fileView";
// import { type FileData } from "@/components/fileView/types";
// import { Avatar } from "@/components/avatar";
// import { filesData } from "@/data/files";

// const headings = [
//   "Name",
//   "Reason",
//   "Owner",
//   "",
// ];

// export default function FileSuggestions() {
//   const [show, setShow] = useState<boolean>(true);
//   const [showList, setShowList] = useState<boolean>(true);

//   const files = filesData.map((file) => ({
//     type: file.type,
//     name: file.name,
//     owner: file.owner,
//     reason: file.reason,
//     avatar: <Avatar char={file.owner[0].toUpperCase()} className={`${file.bg} text-base`} size="medium" />
//   })) as FileData[];

//   return (
//     <>
//       <div className="flex flex-row justify-between">
//         <button
//           className="flex flex-row items-center rounded-4xl px-3 py-1 font-medium hover:text-blue hover:bg-blue/25"
//           onClick={() => setShow(!show)}
//         >
//           <Icon icon={show ? faCaretDown : faCaretRight}  />
//           <span className="mx-3">Suggested files</span>
//         </button>
//         {show && (
//           <div className="flex flex-row border-1 rounded-4xl overflow-clip mx-3">
//             <div
//               className={`flex flex-row justify-center items-center gap-2 w-[64] ${showList && "bg-lavender text-base"}`}
//               onClick={() => setShowList(true)}
//             >
//               {showList && <Icon icon={faCheck} />}
//               <Icon icon={faBars} />
//             </div>
//             <div
//               className={`flex flex-row justify-center items-center gap-2 w-[64] ${!showList && "bg-lavender text-base"}`}
//               onClick={() => setShowList(false)}
//             >
//               {!showList && <Icon icon={faCheck} />}
//               <Icon icon={faTableCellsLarge} />
//             </div>
//           </div>
//         )}
//       </div>
//       {show && (
//         <>
//           { showList ? <FileListView headings={headings} files={files} /> : <FileGridView files={files} /> }
//           <button
//             className="flex flex-row gap-4 rounded-4xl px-5 py-1 my-4 font-semibold text-blue hover:bg-blue/25"
//           >View more</button>
//         </>
//       )}
//     </>
//   );
// }

export default function FileSuggestions() {
  return <h1 className="font-bol text-2xl">Files</h1>;
}