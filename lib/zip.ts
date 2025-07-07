import { PassThrough } from "node:stream";
import archiver from "archiver";


/**
 * Creates zip archive from given file tree structure
 * @param files flat array having filepath (with name) and data
 * @returns Uint8Array
 */
export async function zipFiles<
  T extends { filepath: string; data: Uint8Array }
>(files: T[]): Promise<Uint8Array> {
  const archive = archiver("zip", { zlib: { level: 9 } });

  const chunks: Buffer[] = [];
  const passthrough = new PassThrough();
  passthrough.on("data", chunk => chunks.push(chunk));

  const done = new Promise<void>((resolve, reject) => {
    passthrough.on("finish", resolve);
    passthrough.on("error", reject);
    archive.on("error", reject);
  });

  archive.pipe(passthrough);

  for (const file of files) {
    archive.append(Buffer.from(file.data), { name: file.filepath });
  }

  archive.finalize();
  await done;

  return new Uint8Array(Buffer.concat(chunks));
}
