"use client";

import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "@/components/icon";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export type NavItemProps = {
  label: string,
  url: string,
  icon: IconDefinition,
};

export default function NavItem({ label, icon, url }: Readonly<NavItemProps>) {
  const router = useRouter();
  const path = usePathname();

  const active = path.endsWith(label.toLowerCase());

  return (
    <div
      onClick={() => router.push(url)}
      className={`flex flex-row items-center cursor-pointer rounded-2xl py-1 ${active ? "bg-lavender text-base" : "hover:bg-lavender hover:text-base"}`}
    >
      <Icon icon={icon} className="size-[20] cursor-pointer rounded-full mx-3" />
      <span className="text-md font-medium">{label}</span>
    </div>
  );
}
