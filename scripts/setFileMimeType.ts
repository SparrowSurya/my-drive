import { PrismaClient } from "@/app/generated/prisma/client";
import { detectMimeTypeFromBuffer } from "../lib/mime/detection";

const prisma = new PrismaClient({
  log: ["error", "warn"],
});

/**
 * =========================================================
 * CONFIG & ARGUMENTS
 * =========================================================
 */

const BATCH_SIZE = 50; // Smaller batch size to be safe with large binary data
const MAX_RETRIES = 3;
const SLEEP_BETWEEN_BATCHES_MS = 500;

// Parse arguments
const args = process.argv.slice(2);
const FORCE_ALL = args.includes('--all') || args.includes('-a');

/**
 * =========================================================
 * HELPERS
 * =========================================================
 */

function sleep(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

async function retry<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.error(`[Retry ${attempt}/${retries}]`, error);
      await sleep(1000 * attempt);
    }
  }

  throw lastError;
}

/**
 * =========================================================
 * BUSINESS LOGIC
 * =========================================================
 */

async function processBatch(cursor?: number) {
  /**
   * Define filtering logic
   */
  const whereClause = {
    deletedAt: null,
    ...(!FORCE_ALL && {
      OR: [
        { mimeType: "" },
        { mimeType: "application/octet-stream" },
      ],
    }),
  };

  /**
   * Fetch batch
   */
  const files = await prisma.file.findMany({
    take: BATCH_SIZE,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
    where: whereClause,
    select: {
      id: true,
      name: true,
      data: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  if (files.length === 0) {
    return {
      done: true,
      nextCursor: undefined,
      processed: 0,
    };
  }

  /**
   * Process and update individually for better error tracking
   */
  for (const file of files) {
    const mimeResult = detectMimeTypeFromBuffer(file.data, file.name);
    const mimeTypeToSet = mimeResult.mimeType || "application/octet-stream";

    await retry(async () => {
      await prisma.file.update({
        where: { id: file.id },
        data: {
          mimeType: mimeTypeToSet
        },
      });
    });
  }

  return {
    done: false,
    nextCursor: files[files.length - 1].id,
    processed: files.length,
  };
}

/**
 * =========================================================
 * MAIN RUNNER
 * =========================================================
 */

async function main() {
  console.log("---------------------------------------------------------");
  console.log("MIME Type Backfill Migration");
  console.log(`Mode: ${FORCE_ALL ? 'Recalculate ALL files' : 'Update EMPTY/GENERIC only'}`);
  console.log("---------------------------------------------------------");

  const startedAt = Date.now();

  let totalProcessed = 0;
  let cursor: number | undefined;

  while (true) {
    const result = await processBatch(cursor);

    totalProcessed += result.processed;

    if (result.processed > 0) {
      console.log(`Processed ${totalProcessed} files...`);
    }

    if (result.done) {
      break;
    }

    cursor = result.nextCursor;
    await sleep(SLEEP_BETWEEN_BATCHES_MS);
  }

  const duration = ((Date.now() - startedAt) / 1000).toFixed(2);

  console.log(`\nMigration completed!`);
  console.log(`Total files updated: ${totalProcessed}`);
  console.log(`Duration: ${duration}s`);
}

/**
 * =========================================================
 * SAFE PROCESS EXIT
 * =========================================================
 */

main()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
