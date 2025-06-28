// "use client";

// import { useState } from "react";
// import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
// import { Icon } from "@/components/icon";
// import { FolderGridView } from "@/components/folderView";
// import { folders } from "@/data/folders";

// export default function FolderSuggestions() {
//   const [show, setShow] = useState<boolean>(true);

//   return (
//     <>
//       <button
//         className="flex flex-row items-center rounded-4xl px-3 py-1 font-medium hover:text-blue hover:bg-blue/25"
//         onClick={() => setShow(!show)}
//       >
//         <Icon icon={show ? faCaretDown : faCaretRight}  />
//         <span className="mx-3">Suggested folders</span>
//       </button>
//       {show && (
//         <div className="mx-5 my-4">
//           <FolderGridView folders={folders} />
//         </div>
//       )}
//     </>
//   );
// }

export default function FolderSuggestions() {
  return <h1 className="font-bol text-2xl">Folders</h1>;
}