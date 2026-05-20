"use client";

import React from 'react';
import FileIcon from '../fileIcon';

export type AudioPreviewProps = {
  data: string; // base64
  mimeType: string;
  name: string;
};

export default function AudioPreview({ data, mimeType, name }: Readonly<AudioPreviewProps>) {
  return (
    <div className="bg-surface0 p-12 rounded-3xl border border-surface1 shadow-2xl flex flex-col items-center gap-8 w-full max-w-md">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-blue/10 p-6 rounded-full">
          <FileIcon mimeType={mimeType} className="size-16" />
        </div>
        <span className="text-text font-medium text-lg truncate w-64 text-center" title={name}>
          {name}
        </span>
      </div>
      <audio
        controls
        autoPlay={false}
        src={`data:${mimeType};base64,${data}`}
        className="w-full"
      />
    </div>
  );
}
