/* eslint-disable @next/next/no-img-element */
"use client";

import React from 'react';

export type SvgPreviewProps = {
  data: string; // base64 encoded SVG content
};

/**
 * Safely renders an SVG file.
 *
 * NOTE: Using an <img> tag with a data URI is the safest way to render untrusted SVGs.
 * Browsers automatically disable script execution (XSS), external resource loading,
 * and event handlers within SVGs when they are loaded as an image source.
 */
export default function SvgPreview({ data }: Readonly<SvgPreviewProps>) {
  return (
    <div className="flex justify-center items-center w-full h-full p-8 bg-surface0/30 rounded-xl overflow-hidden border border-surface1">
      <img
        src={`data:image/svg+xml;base64,${data}`}
        alt="SVG Preview"
        className="max-w-full max-h-full object-contain shadow-sm"
      />
    </div>
  );
}
