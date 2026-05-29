-- CreateTable
CREATE TABLE "activities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "actorId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "fileId" INTEGER,
    "folderId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    -- Custom Constraint START
    CONSTRAINT "actvity_target_check" CHECK (
        (fileId IS NULL AND folderId IS NOT NULL) OR
        (fileId IS NOT NULL AND folderId IS NULL)
    ),
    -- Custom Constraint END
    CONSTRAINT "activities_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT "activities_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "activities_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
