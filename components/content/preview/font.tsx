"use client";

import React, { useEffect } from 'react';

export type FontPreviewProps = {
  id: number;
  name: string;
  data: string;
  mimeType: string;
};

export default function FontPreview({ id, name, data, mimeType }: Readonly<FontPreviewProps>) {
  const fontFamily = `font-preview-${id}`;

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @font-face {
        font-family: '${fontFamily}';
        src: url(data:${mimeType};base64,${data});
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [fontFamily, data, mimeType]);

  const sampleText = "The quick brown fox jumps over the lazy dog.";
  const alphabetUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const alphabetLower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+=-[]{}\\|;:'\",.<>/?";

  return (
    <div className="flex flex-col items-center w-full h-full p-10 overflow-y-auto custom-scrollbar">
      <div
        className="bg-base border border-surface1 rounded-2xl p-12 shadow-2xl w-full max-w-4xl flex flex-col gap-12"
        style={{ fontFamily: `'${fontFamily}', sans-serif` }}
      >
        <div className="border-b border-surface1 pb-4 mb-2 flex justify-between items-end">
          <h3 className="text-subtext0 text-sm uppercase tracking-widest font-sans">Font Preview</h3>
          <span className="text-subtext1 text-xs font-sans">{name}</span>
        </div>

        <section className="flex flex-col gap-2">
          <span className="text-xs text-subtext0 font-sans mb-2">48px</span>
          <p className="text-5xl leading-tight wrap-break-word">{sampleText}</p>
        </section>

        <section className="flex flex-col gap-2">
          <span className="text-xs text-subtext0 font-sans mb-2">32px</span>
          <p className="text-3xl leading-tight wrap-break-word">{sampleText}</p>
        </section>

        <section className="flex flex-col gap-2">
          <span className="text-xs text-subtext0 font-sans mb-2">18px</span>
          <p className="text-lg leading-tight wrap-break-word">{sampleText}</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-surface1/50">
          <div className="flex flex-col gap-4">
             <div>
               <span className="text-xs text-subtext0 font-sans block mb-2">Uppercase</span>
               <p className="text-2xl break-all">{alphabetUpper}</p>
             </div>
             <div>
               <span className="text-xs text-subtext0 font-sans block mb-2">Lowercase</span>
               <p className="text-2xl break-all">{alphabetLower}</p>
             </div>
          </div>
          <div className="flex flex-col gap-4">
             <div>
               <span className="text-xs text-subtext0 font-sans block mb-2">Numbers</span>
               <p className="text-2xl">{numbers}</p>
             </div>
             <div>
               <span className="text-xs text-subtext0 font-sans block mb-2">Symbols</span>
               <p className="text-2xl break-all">{symbols}</p>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
