import { faHome, faClock, faTrash, faCloud, faHardDrive, faUserGroup, faStar } from "@fortawesome/free-solid-svg-icons";
import utils from "@/lib/utils";
import NewButton from "@/components/newButton";
import NavItem from "./item";
import { storageUsed } from "./query";


export const navGroups = [
  [
    { label: "Home", icon: faHome },
    { label: "Shared with me", icon: faUserGroup },
  ],
  [
    { label: "My Drive", icon: faHardDrive },
    { label: "Recent", icon: faClock },
    { label: "Starred", icon: faStar },
  ],
  [
    { label: "Trash", icon: faTrash },
    { label: "Storage", icon: faCloud },
  ]
];

export default async function Navbar() {
  const storageSize = await storageUsed();

  return (
    <nav className="ml-5 mt-3 mr-2 flex flex-col items-start max-h-max">
      <NewButton />
      <div className="flex-1 flex flex-col gap-3 mt-6 w-full min-h-0 overflow-y-auto">
        {
          navGroups.map((items, index) => (
            <div key={index} className="flex flex-col gap-1">
              {
                items.map((item, index) => (
                  <NavItem
                    key={index}
                    {...item}
                    url={`/drive/${utils.slugify(item.label)}`}
                  />
                ))
              }
            </div>
          ))
        }
        <div className="text-subtext0">{ utils.formatBytes(storageSize) } used</div>
      </div>
    </nav>
  );
}
