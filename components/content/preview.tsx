"use client";

import { useFetch } from "@/hooks/useFetch";

export type FilePreviewProps = {
  id: number,
  close: () => void;
};

type FileDataResponse = {
  id: number,
};

export default function FilePreview({ id, close }: Readonly<FilePreviewProps>) {
  const url = `/api/file/${id}`;
  const { loading, error, data } = useFetch<FileDataResponse>(url)

  console.log("Data:", data);

  return (
    <div className="w-screen h-screen" onClick={close}>
      <span>{ loading ? "loading..." : "" }</span>
      <span>{ error?.toString() }</span>
      <span>{ `File ID: ${id}` }</span>
    </div>
  );
}
