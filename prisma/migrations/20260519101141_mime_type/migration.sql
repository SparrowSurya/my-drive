-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_files" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "folderId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT '',
    "data" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "files_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_files" ("createdAt", "data", "deletedAt", "folderId", "id", "name", "size", "updatedAt") SELECT "createdAt", "data", "deletedAt", "folderId", "id", "name", "size", "updatedAt" FROM "files";
DROP TABLE "files";
ALTER TABLE "new_files" RENAME TO "files";
CREATE UNIQUE INDEX "files_name_folderId_key" ON "files"("name", "folderId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
