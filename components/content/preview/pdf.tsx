"use client";

import React from 'react';

export type PdfPreviewProps = {
  data: string; // base64
};

export default function PdfPreview({ data }: Readonly<PdfPreviewProps>) {
  return (
    <div className="w-full h-full max-w-6xl p-10 md:p-16">
      <iframe
        src={`data:application/pdf;base64,${data}`}
        className="w-full h-full rounded-lg shadow-2xl border-none bg-white"
        title="PDF Preview"
      />
    </div>
  );
}
