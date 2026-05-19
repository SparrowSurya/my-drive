"use client";

import Image from 'next/image';
import React from 'react';

export type ImagePreviewProps = {
  data: string;
  mimeType: string;
};

export default function ImagePreview({ data, mimeType }: Readonly<ImagePreviewProps>) {
  return (
    <div className="flex justify-center items-center w-full h-full p-4">
      <Image
        src={`data:${mimeType};base64,${data}`}
        alt="Preview"
        className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
      />
    </div>
  );
}
