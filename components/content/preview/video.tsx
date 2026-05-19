"use client";

import React from 'react';

export type VideoPreviewProps = {
  data: string; // base64
  mimeType: string;
};

export default function VideoPreview({ data, mimeType }: Readonly<VideoPreviewProps>) {
  return (
    <div className="flex justify-center items-center w-full h-full p-4">
      <video 
        controls 
        className="max-w-full max-h-full shadow-2xl rounded-lg"
        src={`data:${mimeType};base64,${data}`}
      />
    </div>
  );
}
