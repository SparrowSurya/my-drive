import React from "react";

export default function DriveLayout({
  children,
  topbar,
  navbar,
}: Readonly<{
  children: React.ReactNode,
  topbar: React.ReactNode,
  navbar: React.ReactNode,
}>) {
  return (
    <div className="h-svh grid grid-rows-[auto_1fr]">
      { topbar }
      <div className="grid grid-cols-10 bg-crust overflow-hidden">
        <div className="col-span-2 bg-crust">
          { navbar }
        </div>
        <main className="col-span-8 flex flex-col bg-base p-6 rounded-4xl ml-2 overflow-hidden">
          { children }
        </main>
      </div>
    </div>
  );
}
