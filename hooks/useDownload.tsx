"use client";

export default function useDownload() {
  function download(type: "file" | "folder", id: number, name: string) {
    const a = document.createElement("a");
    a.href = `/api/download/${type}/${id}`;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadFolder = (id: number, name: string) => download("folder", id, name);
  const downloadFile = (id: number, name: string) => download("file", id, name);

  return { downloadFolder, downloadFile };
}
