"use client";

import React from "react";
import Image, { type ImageProps } from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

type AvatarImageProps = {
  src: string | StaticImport,
  alt: string,
  size: number,
  className?: string,
  style?: React.CSSProperties,
  imageProps?: Omit<ImageProps, "src" | "alt" | "width" | "height">,
};

export default function AvatarImage({
  src,
  alt,
  size,
  imageProps,
}: Readonly<AvatarImageProps>) {
  return (
    <div className="flex justify-center items-center mt-8 mb-2 rounded-full cursor-pointer">
      <Image src={src} alt={alt} width={size} height={size} {...imageProps} />
    </div>
  );
}
