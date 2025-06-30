import NavItem from "./item";
import MenuButton from "./menu-button";
import { navGroups } from "./data";
import { slugify } from "@/lib/utils/string";


export default async function Navbar() {
  return (
    <nav className="ml-5 mt-3 mr-2 flex flex-col items-start max-h-max">
      <MenuButton />
      <div className="flex-1 flex flex-col gap-3 mt-6 w-full min-h-0 overflow-y-auto">
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
        <div className="text-subtext0">1.03 GB used</div>
      </div>
    </nav>
  );
}
