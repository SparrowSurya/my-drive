import NavItem from "./item";
import MenuButton from "./menu-button";
import { navGroups } from "./data";
import { slugify } from "@/lib/utils/string";


export default async function Navbar() {
  return (
    <nav className="ml-5 mt-2">
      <MenuButton />
      <div className="flex flex-col gap-3 mt-6">
        {
          navGroups.map((items, index) => (
            <div key={index} className="flex flex-col gap-1">
              {
                items.map((item, index) => (
                  <NavItem
                    key={index}
                    {...item}
                    url={`/drive/${slugify(item.label)}`}
                  />
                ))
              }
            </div>
          ))
        }
      </div>
      <div className="text-subtext0">1.03 GB used</div>
    </nav>
  );
}
