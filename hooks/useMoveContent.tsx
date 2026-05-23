"use client";

import { useState, useCallback } from "react";

type MoveFileResponse = { message: string } | { error: string };
type MoveFolderResponse = { message: string } | { error: string };

export default function useMoveContent() {
  const [isFileMoving, setIsFileMoving] = useState(false);
  const [isFolderMoving, setIsFolderMoving] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const moveFile = useCallback(async (fileId: number, targetFolderId: number): Promise<boolean> => {
    setIsFileMoving(true);
    setError(null);
    try {
      const response = await fetch("/api/move/file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, folderId: targetFolderId }),
      });

      const result: MoveFileResponse = await response.json();

      if (!response.ok) {
        throw new Error("error" in result ? result.error : "Failed to move file");
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.toString() : "Unknown error occurred");
      return false;
    } finally {
      setIsFileMoving(false);
    }
  }, []);

  const moveFolder = useCallback(async (folderId: number, targetFolderId: number): Promise<boolean> => {
    setIsFolderMoving(true);
    setError(null);
    try {
      const response = await fetch("/api/move/folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderId, targetFolderId }),
      });

      const result: MoveFolderResponse = await response.json();

      if (!response.ok) {
        throw new Error("error" in result ? result.error : "Failed to move folder");
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.toString() : "Unknown error occurred");
      return false;
    } finally {
      setIsFolderMoving(false);
    }
  }, []);

  return {
    isFileMoving,
    isFolderMoving,
    moveFile,
    moveFolder,
    error,
  };
}
