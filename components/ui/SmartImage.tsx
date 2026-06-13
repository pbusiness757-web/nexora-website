'use client';

import Image from 'next/image';
import { useState } from 'react';

type SmartImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Renders a Next.js Image on top of a premium gradient placeholder.
 * If the image file is missing (load error), the gradient remains —
 * so the build and layout never break when assets are not yet present.
 */
export default function SmartImage({
  src,
  alt,
  className,
  sizes = '100vw',
  priority = false,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-blue-100 via-cyan-100 to-slate-100 ${className ?? ''}`}
    >
      {!failed && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
