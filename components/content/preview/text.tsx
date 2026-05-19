"use client";

import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import Icon from '../../icon';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';

export type TextPreviewProps = {
  data: string; // base64 encoded
};

export default function TextPreview({ data }: TextPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [width, setWidth] = useState(60);
  const isResizing = useRef(false);

  const text = useMemo(() => {
    if (!data) return "";
    try {
      const binaryString = atob(data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    } catch (e) {
      console.error("Failed to decode text preview:", e);
      return "Error decoding text content. The file might be corrupted or in an unsupported encoding.";
    }
  }, [data]);

  const lines = useMemo(() => text.split(/\r?\n/), [text]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;

    const centerX = window.innerWidth / 2;
    const distanceFromCenter = Math.abs(e.clientX - centerX);
    const newWidthPercent = (distanceFromCenter * 2 / window.innerWidth) * 100;

    const clampedWidth = Math.max(60, Math.min(90, newWidthPercent));
    setWidth(clampedWidth);
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
  }, [handleMouseMove]);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
  }, [handleMouseMove, stopResizing]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, [handleMouseMove, stopResizing]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="h-[calc(100%-3rem)] my-6 flex flex-col relative"
      style={{ width: `${width}%` }}
    >
      {/* Left Resize Handle - Moved outside the main border */}
      <div
        className="absolute -left-3 top-0 w-3 h-full cursor-col-resize hover:bg-blue/10 z-20 transition-colors rounded-l-md"
        onMouseDown={startResizing}
      />

      {/* Right Resize Handle - Moved outside the main border to avoid scrollbar conflict */}
      <div
        className="absolute -right-3 top-0 w-3 h-full cursor-col-resize hover:bg-blue/10 z-20 transition-colors rounded-r-md"
        onMouseDown={startResizing}
      />

      <div className="flex-1 bg-base rounded-lg border border-surface1 overflow-hidden flex flex-col relative shadow-2xl">
        <div className="absolute top-4 right-6 z-10">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center p-1.5 rounded-md border border-surface1 bg-surface0 hover:bg-surface1 transition-colors text-subtext0 hover:text-text shadow-sm"
            title="Copy to clipboard"
          >
            <Icon icon={copied ? faCheck : faCopy} className={`text-xs ${copied ? "text-green" : ""}`} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          <div className="flex flex-col min-w-full">
            {lines.map((line, i) => (
              <div key={i} className="flex flex-row group hover:bg-surface1/20 transition-colors">
                <div className="w-12 shrink-0 text-right pr-4 text-subtext0/60 font-mono text-xs leading-6 select-none border-r border-surface1 bg-surface0/5 pointer-events-none">
                  {i + 1}
                </div>
                <pre className="flex-1 pl-4 text-text font-mono text-sm leading-6 whitespace-pre-wrap wrap-break-word">
                  {line || " "}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
