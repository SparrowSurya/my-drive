"use client";

import Image from 'next/image';
import React from 'react';

export type ImagePreviewProps = {
  data: string;
  mimeType: string;
};

export default function ImagePreview({ data, mimeType }: Readonly<ImagePreviewProps>) {
  return (
    <div className="flex justify-center items-center w-full h-full p-10 md:p-16">
      <div className="relative w-full h-full max-w-[90vw] max-h-[85vh]">
        <Image
          src={`data:${mimeType};base64,${data}`}
          alt="Preview"
          fill
          unoptimized
          priority
          className="object-contain shadow-2xl rounded-sm"
        />
      </div>
    </div>
  );
}
