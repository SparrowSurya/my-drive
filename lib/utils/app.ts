
// Determines the folderId for given url (0 represents root foler and not the actual id of root folder)
export function getFolderIdByPathname(path: string): number {
  if (/^\/drive\/folder\/[0-9]+$/.test(path)) {
    const folderId = path.split("/")[3];
    try {
      return parseInt(folderId);
    } catch {
      return 0;
    }
  }
  return 0;
}