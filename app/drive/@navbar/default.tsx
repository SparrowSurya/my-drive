import { faPlus, faHome, faClock, faTrash, faCloud, faHardDrive, faUserGroup, faStar } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "@/components/icon";
import NavItem from "./item";


const navGroups = [
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

export default function Navbar() {
  return (
    <nav className="ml-5 mt-2">
      <button
        className="flex flex-rpw justify-center items-center bg-lavender text-base hover:bg-lavender/95 rounded-lg cursor-pointer p-2"
      >
        <Icon icon={faPlus} className="size-[16] cursor-pointer mx-2 rounded-full" />
        <span className="text-lg pr-2">New</span>
      </button>

      <div className="flex flex-col gap-3 mt-6">
        {
          navGroups.map((items, index) => (
            <div key={index} className="flex flex-col gap-1">
              {
                items.map((item, index) => <NavItem key={index} {...item} url={`/drive/${item.label.replaceAll(" ", "-").toLowerCase()}`} />)
              }
            </div>
          ))
        }
      </div>
      <div className="text-subtext0">1.03 GB used</div>
    </nav>
  );
}
