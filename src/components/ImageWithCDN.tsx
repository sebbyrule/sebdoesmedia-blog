import Image from 'next/image';
import type { ImageProps } from 'next/image';

const IMAGE_CDN_BASE = process.env.NEXT_PUBLIC_IMAGE_CDN_URL || 'https://res.cloudinary.com/demo/image/upload/';

type ImageWithCDNProps = Omit<ImageProps, 'src' | 'alt'> & {
  src: string;
  alt?: string;
};

export function ImageWithCDN({ src, alt, ...rest }: ImageWithCDNProps) {
  const fullSrc = src.startsWith('http') ? src : `${IMAGE_CDN_BASE}${src}`;

  return (
    <Image
      {...rest}
      src={fullSrc}
      alt={alt || 'Blog Image'}
      className={`rounded-lg ${rest.className || ''}`}
    />
  );
}

export default ImageWithCDN;