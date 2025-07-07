-- AlterTable
ALTER TABLE "files" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "folders" ADD COLUMN "deletedAt" DATETIME;
