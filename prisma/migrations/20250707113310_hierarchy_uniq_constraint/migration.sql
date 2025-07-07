/*
  Warnings:

  - A unique constraint covering the columns `[parentId,folderId]` on the table `hierarchy` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "hierarchy_parentId_folderId_key" ON "hierarchy"("parentId", "folderId");
