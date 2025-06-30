import { FileTree } from "@/lib/query/folder";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildDirectory<T extends Record<string, any>>(files: (T & { path: string })[]): FileTree<T> {
  const tree: FileTree<T> = {};

  for (const file of files) {
    const segments = file.path.split('/') as string[];
    segments.pop(); // drop the filename
    let currTree = tree;

    for (const segment of segments) {
      if (!currTree[segment]) {
        currTree[segment] = {};
      }
      currTree = currTree[segment] as FileTree<T>;
    }

    if (!currTree['.']) {
      currTree['.'] = [];
    }

    (currTree['.'] as T[]).push({ ...file, path: undefined });
  }

  return tree;
}
