"use client";

import React, { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import type { ContentData, FolderData } from "../../types";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";

export type OrganiseContentDialogProps = {
  data: ContentData,
  closeModal: (refresh: boolean) => void;
};

type PathSegment = {
  id: number;
  name: string;
};

const ROOT_FOLDER: PathSegment = { id: 0, name: "My Drive" };
const buildURL = (folderId: number) => `/api/folder/${folderId}/children`;

export default function OrganiseContentDialog({ data, closeModal }: Readonly<OrganiseContentDialogProps>) {
  const [path, setPath] = useState<PathSegment[]>([ROOT_FOLDER]);
  const [active, setActive] = useState<number>(0);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const { data: folders, loading, error, refetch } = useFetch<FolderData[]>(buildURL(active));

  useEffect(() => {
    refetch(buildURL(active));
  }, [active, refetch]);

  const handleDoubleClick = (folder: FolderData) => {
    if (folder.id === undefined) return;
    setActive(folder.id);
    setPath((prev) => [...prev, { id: folder.id!, name: folder.name! }]);
    setSelectedFolderId(null);
  };

  const handleBreadcrumbClick = (index: number) => {
    const segment = path[index];
    setActive(segment.id);
    setPath((prev) => prev.slice(0, index + 1));
    setSelectedFolderId(null);
  };

  const handleMove = () => {
    const destinationId = selectedFolderId ?? active;
    console.log(`Moving ${data.type} "${data.name}" (id: ${data.id}) to folder id: ${destinationId}`);
    closeModal(true);
  };

  return (
    <div
      className="fixed inset-0 bg-crust/60 z-50 flex items-center justify-center px-4"
      onClick={() => closeModal(false)}
    >
      <div
        className="rounded-3xl p-8 bg-surface0 shadow-2xl shadow-crust w-full max-w-xl flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-semibold text-text">Move {`"${data.name}"`}</h3>

        <div className="flex items-center gap-2 text-sm text-subtext1 bg-base p-3 rounded-xl overflow-x-auto whitespace-nowrap scrollbar-hide border border-surface1">
          {path.map((segment, index) => (
            <React.Fragment key={segment.id}>
              <button
                className={`hover:text-lavender transition-colors ${index === path.length - 1 ? 'font-bold text-text cursor-default' : ''}`}
                onClick={() => index < path.length - 1 && handleBreadcrumbClick(index)}
              >
                {segment.name}
              </button>
              {index < path.length - 1 && <span className="text-surface2 opacity-50">{">"}</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-col bg-base rounded-2xl border border-surface1 overflow-hidden h-72">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-full text-subtext0">
                 <div className="animate-pulse">Loading folders...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full text-red p-4 text-center">
                Failed to load folders.
              </div>
            ) : folders && folders.length > 0 ? (
              folders
                .filter(f => f.id !== data.id)
                .map((folder) => (
                <div
                  key={folder.id}
                  className={`px-4 py-3 cursor-pointer transition-all flex items-center gap-3 border-b border-surface1 ${selectedFolderId === folder.id ? 'bg-lavender/10 text-lavender' : 'hover:bg-surface0 text-text'}`}
                  onClick={() => setSelectedFolderId(folder.id!)}
                  onDoubleClick={() => handleDoubleClick(folder)}
                >
                  <Icon icon={faFolder} className={selectedFolderId === folder.id ? 'text-lavender' : 'text-subtext0'} />
                  <span className="truncate select-none font-medium">{folder.name}</span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-subtext0 italic p-4 text-center">
                No folders here
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end items-center gap-3 mt-2">
          <button
            type="button"
            onClick={() => closeModal(false)}
            className="px-6 py-2.5 rounded-full text-lavender font-semibold hover:bg-lavender/10 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleMove}
            className="px-8 py-2.5 rounded-full bg-lavender text-base font-bold hover:bg-lavender/90 transition-all active:scale-95 shadow-lg shadow-lavender/20"
          >
            Move
          </button>
        </div>
      </div>
    </div>
  );
}
