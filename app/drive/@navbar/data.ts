import { faHome, faClock, faTrash, faCloud, faHardDrive, faUserGroup, faStar } from "@fortawesome/free-solid-svg-icons";

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
