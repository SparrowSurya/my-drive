"use client";

import React, { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import type { ContentData, FolderData } from "../../types";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import useMoveContent from "@/hooks/useMoveContent";
import useSnackbar from "@/hooks/useSnackbar";

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
  const root = useFetch<{ id: number }>('/api/folder/root', { immediate: true });
  const snackbar = useSnackbar();
  const { moveFile, moveFolder, isFileMoving, isFolderMoving, error: moveError } = useMoveContent();

  const [cache, setCache] = useState<Record<number, FolderData[]>>({});
  const [path, setPath] = useState<PathSegment[]>([ROOT_FOLDER]);
  const [active, setActive] = useState<number>(0);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [resolvedActiveId, setResolvedActiveId] = useState<number | null>(null);

  const {
    data: fetchedFolders,
    loading,
    error,
    refetch,
  } = useFetch<FolderData[]>(buildURL(active), { immediate: false });

  useEffect(() => {
    if (active === 0) {
      if (root.data) {
        setResolvedActiveId(root.data.id);
      }
    } else {
      setResolvedActiveId(active);
    }
  }, [active, root.data]);

  useEffect(() => {
    if (cache[active]) return;

    const currentActive = active;

    refetch(buildURL(currentActive)).then((data) => {
      if (data) {
        setCache((prev) => ({ ...prev, [currentActive]: data }));
      }
    });
  }, [active, refetch, cache]);

  const handleDoubleClick = (folder: FolderData) => {
    if (folder.id === undefined || loading) return;
    if (data.type === 'folder' && folder.id === data.id) return;

    setActive(folder.id);
    setPath((prev) => [...prev, { id: folder.id!, name: folder.name! }]);
    setSelectedFolderId(null);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (loading) return;

    const segment = path[index];
    setActive(segment.id);
    setPath((prev) => prev.slice(0, index + 1));
    setSelectedFolderId(null);
  };

  const isMoving = isFileMoving || isFolderMoving;
  const destinationId = selectedFolderId ?? resolvedActiveId;
  const currentParentId = data.type === 'file' ? (data.folderId) : (data.parentId);

  const isSameFolder = destinationId !== null && destinationId !== undefined && destinationId === currentParentId;
  const isMovingIntoDescendant = data.type === 'folder' && path.some(segment => segment.id === data.id);

  const canMove = !loading && !isMoving && !isSameFolder && !isMovingIntoDescendant && destinationId !== null;

  const handleMove = async () => {
    if (!canMove) return;

    const finalDestinationId = selectedFolderId ?? resolvedActiveId ?? active;

    let destinationName = "";
    if (selectedFolderId !== null) {
      const selectedFolder = folders?.find(f => f.id === selectedFolderId);
      destinationName = selectedFolder?.name ?? "Unknown folder";
    } else {
      destinationName = path[path.length - 1].name;
    }

    let success = false;
    if (data.type === "file" && data.id) {
      success = await moveFile(data.id, finalDestinationId);
    } else if (data.type === "folder" && data.id) {
      success = await moveFolder(data.id, finalDestinationId);
    }

    if (success) {
      snackbar.show({ message: `Moved ${data.type} "${data.name}" to folder "${destinationName}"` });
      closeModal(true);
    } else {
      snackbar.show({ message: moveError ?? "Failed to move item" });
    }
  };

  const folders = cache[active] ?? fetchedFolders;

  return (
    <div
      className="fixed inset-0 bg-crust/60 z-50 flex items-center justify-center px-4"
      onClick={() => closeModal(false)}
    >
      <div
        className="rounded-md p-8 bg-surface0 shadow-2xl shadow-crust w-full max-w-xl flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-semibold text-text">Move {`"${data.name}"`}</h3>

        <div className="flex items-center gap-2 text-sm text-subtext1 bg-base p-3 rounded-md overflow-x-auto whitespace-nowrap scrollbar-hide border border-surface1">
          {path.map((segment, index) => (
            <React.Fragment key={segment.id}>
              <button
                className={`hover:text-lavender transition-colors ${index === path.length - 1 ? 'font-bold text-text cursor-default' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={loading}
                onClick={() => index < path.length - 1 && handleBreadcrumbClick(index)}
              >
                {segment.name}
              </button>
              {index < path.length - 1 && <span className="text-surface2 opacity-50">{">"}</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-col bg-base rounded-md border border-surface1 overflow-hidden h-72">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {(loading && !cache[active]) ? (
              <div className="flex items-center justify-center h-full text-subtext0">
                 <div className="animate-pulse">Loading folders...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full text-red p-4 text-center">
                Failed to load folders.
              </div>
            ) : folders && folders.length > 0 ? (
              folders.map((folder) => {
                const isItemBeingMoved = data.type === 'folder' && folder.id === data.id;
                return (
                  <div
                    key={folder.id}
                    className={`px-4 py-3 transition-all flex items-center gap-3 border-b border-surface1
                      ${selectedFolderId === folder.id ? 'bg-lavender/10 text-lavender' : 'hover:bg-surface0 text-text'}
                      ${isItemBeingMoved ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    onClick={() => !isItemBeingMoved && setSelectedFolderId(folder.id!)}
                    onDoubleClick={() => !isItemBeingMoved && handleDoubleClick(folder)}
                  >
                    <Icon icon={faFolder} className={selectedFolderId === folder.id ? 'text-lavender' : 'text-subtext0'} />
                    <span className="truncate select-none font-medium">{folder.name}</span>
                    {isItemBeingMoved && <span className="text-xs italic text-subtext0 ml-auto">(Current)</span>}
                  </div>
                );
              })
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
            disabled={!canMove}
            onClick={handleMove}
            className="px-8 py-2.5 rounded-full bg-lavender text-base font-bold hover:bg-lavender/90 transition-all active:scale-95 shadow-lg shadow-lavender/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface2 disabled:shadow-none"
          >
            {isMoving ? "Moving..." : "Move"}
          </button>
        </div>
      </div>
    </div>
  );
}
