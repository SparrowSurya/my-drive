"use client";

import Image from 'next/image';
import React from 'react';

export type SvgPreviewProps = {
  data: string; // base64 encoded SVG content
};

export default function SvgPreview({ data }: Readonly<SvgPreviewProps>) {
  return (
    <div className="flex justify-center items-center w-full h-full p-10 md:p-16">
      <div className="relative w-full h-full max-w-[80vw] max-h-[80vh] p-8 bg-surface0/30 rounded-xl overflow-hidden border border-surface1 shadow-2xl">
        <Image
          src={`data:image/svg+xml;base64,${data}`}
          alt="SVG Preview"
          fill
          unoptimized
          priority
          className="object-contain p-8"
        />
      </div>
    </div>
  );
}
