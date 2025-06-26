import React from "react";

export default function DriveHomeLayout({
  folderSuggestions,
  fileSuggestions,
}: Readonly<{
  folderSuggestions: React.ReactNode,
  fileSuggestions: React.ReactNode,
  children: React.ReactNode,
}>) {
  return (
    <>
      <div className="text-2xl mb-4">Welcome to Drive</div>
      <div className="min-h-0 overflow-y-auto scrollbar scrollbar-thumb-surface2">
        <div className="my-4">{ folderSuggestions }</div>
        <div className="my-4">{ fileSuggestions }</div>
      </div>
    </>
  );
}
