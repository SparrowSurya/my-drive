import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faHardDrive, faShareNodes, faUserGroup, faClock, faStar, faTrash, faCloud, faHouseLaptop, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faPlus, faHome, faBell } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "@/components/icon";

const groupItems = [
  [
    { label: "Home", icon: faHome },
    { label: "Activity", icon: faBell },
    { label: "Workspace", icon: faHouseLaptop },
  ],
  [
    { label: "My Drive", icon: faHardDrive },
    { label: "Shared drive", icon: faShareNodes },
  ],
  [
    { label: "Shared with me", icon: faUserGroup },
    { label: "Recents", icon: faClock },
    { label: "Starred", icon: faStar },
  ],
  [
    { label: "Spam", icon: faTriangleExclamation },
    { label: "Trash", icon: faTrash },
    { label: "Storage", icon: faCloud },
  ],
];

function NavItem({
  icon,
  label,
}: Readonly<{
  icon: IconDefinition,
  label: string,
}>) {
  return (
    <div className="flex flex-row items-center cursor-pointer hover:bg-lavender hover:text-base rounded-2xl py-1">
      <Icon icon={icon} className="size-[20] cursor-pointer rounded-full mx-3" />
      <span className="">{label}</span>
    </div>
  );
}

function NavGroup({
  items,
}: Readonly<{
  items: { icon: IconDefinition, label: string }[],
}>) {
  return (
    <div className="flex flex-col">
      {
        items.map((item, index) => <NavItem key={index} label={item.label} icon={item.icon} />)
      }
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="px-3">
      <button
        className="flex flex-rpw justify-center items-center bg-lavender text-base hover:bg-text rounded-lg cursor-pointer my-2 p-1"
      >
        <Icon icon={faPlus} className="size-[42] cursor-pointer p-[8] rounded-full" />
        <span className="text-lg pr-2">New</span>
      </button>

      <div className="pl-2">
        <div className="flex flex-col gap-3">
          {
            groupItems.map((items, index) => <NavGroup key={index} items={items} />)
          }
        </div>
        <div className="text-subtext0 ml-2">1.03 GB used</div>
      </div>
    </nav>
  );
}
