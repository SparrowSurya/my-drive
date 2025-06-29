/*
  Warnings:

  - A unique constraint covering the columns `[name,folderId]` on the table `files` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `folders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `parentId` on table `folders` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_folders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT "folders_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "folders" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_folders" ("createdAt", "id", "name", "parentId", "updatedAt", "userId") SELECT "createdAt", "id", "name", "parentId", "updatedAt", "userId" FROM "folders";
DROP TABLE "folders";
ALTER TABLE "new_folders" RENAME TO "folders";
CREATE UNIQUE INDEX "folders_name_parentId_key" ON "folders"("name", "parentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "files_name_folderId_key" ON "files"("name", "folderId");
