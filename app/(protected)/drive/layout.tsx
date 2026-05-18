import React from "react";
import FileUploadProvider from "@/contexts/fileUpload";
import ContentViewProvider from "@/contexts/contentView";


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
    <FileUploadProvider>
      <ContentViewProvider>
        <div className="h-svh flex flex-col overflow-hidden bg-crust">
          <header className="shrink-0">
            { topbar }
          </header>
          <div className="flex-1 flex flex-row overflow-hidden">
            <aside className="w-[20%] shrink-0 overflow-y-auto bg-crust">
              { navbar }
            </aside>
            <main className="flex-1 flex flex-col bg-mantle p-6 rounded-4xl mr-2 overflow-hidden">
              { children }
            </main>
          </div>
        </div>
      </ContentViewProvider>
    </FileUploadProvider>
  );
}
