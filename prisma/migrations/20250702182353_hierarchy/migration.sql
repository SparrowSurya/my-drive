/*
  Warnings:

  - You are about to drop the column `parentId` on the `folders` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "hierarchy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "folderId" INTEGER NOT NULL,
    "parentId" INTEGER NOT NULL,
    CONSTRAINT "hierarchy_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "hierarchy_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "folders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_folders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "isRoot" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_folders" ("createdAt", "id", "name", "updatedAt", "userId") SELECT "createdAt", "id", "name", "updatedAt", "userId" FROM "folders";
DROP TABLE "folders";
ALTER TABLE "new_folders" RENAME TO "folders";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "hierarchy_folderId_key" ON "hierarchy"("folderId");
