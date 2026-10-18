"use client";

import { getCldImageUrl } from "next-cloudinary";

/**
 * Avatar delivery helpers.
 *
 * Supports:
 * - Local images: /brand/rohit-avatar.jpg
 * - Full HTTP(S) image URLs
 * - Cloudinary public IDs
 *
 * Local images and full URLs bypass Cloudinary.
 */

const TRANSFORM = {
  width: 512,
  height: 512,
  crop: "thumb" as const,
  gravity: "face" as const,
  quality: "auto",
};

const config = {
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
  },
};

/**
 * Normalize an avatar source.
 */
function normalizeSrc(src: string): string {
  return src.trim();
}

/**
 * Check whether the source is a local public/ path.
 * Example: /brand/rohit-avatar.jpg
 */
function isLocalPath(src: string): boolean {
  return src.startsWith("/") && !src.startsWith("//");
}

/**
 * Check whether the source is a full HTTP(S) URL.
 */
function isPlainUrl(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

/**
 * Check whether Cloudinary is configured.
 */
function hasCloudinaryConfig(): boolean {
  return config.cloud.cloudName.length > 0;
}

/**
 * Generate an AVIF URL for a Cloudinary avatar ID.
 * Local paths and full URLs are returned unchanged.
 */
export function avatarAvifUrl(publicId: string): string {
  const src = normalizeSrc(publicId);

  if (isLocalPath(src) || isPlainUrl(src)) {
    return src;
  }

  if (!hasCloudinaryConfig()) {
    return src;
  }

  return getCldImageUrl(
    {
      src,
      format: "avif",
      ...TRANSFORM,
    },
    config,
  );
}

/**
 * Generate a WebP URL for a Cloudinary avatar ID.
 * Local paths and full URLs are returned unchanged.
 */
export function avatarWebpUrl(publicId: string): string {
  const src = normalizeSrc(publicId);

  if (isLocalPath(src) || isPlainUrl(src)) {
    return src;
  }

  if (!hasCloudinaryConfig()) {
    return src;
  }

  return getCldImageUrl(
    {
      src,
      format: "webp",
      ...TRANSFORM,
    },
    config,
  );
}

/**
 * Return the original avatar source without transformations.
 *
 * Local paths and full URLs are returned unchanged.
 * Cloudinary public IDs are converted into raw delivery URLs
 * when a Cloudinary cloud name is configured.
 */
export function avatarRawUrl(publicId: string): string {
  const src = normalizeSrc(publicId);

  if (isLocalPath(src) || isPlainUrl(src)) {
    return src;
  }

  if (!hasCloudinaryConfig()) {
    // Preserve the original source rather than crashing.
    // Update the demo profile to use a local image for reliable display.
    return src;
  }

  return `https://res.cloudinary.com/${config.cloud.cloudName}/image/upload/${src}`;
}

/**
 * Return avatar sources for a <picture> element.
 *
 * Local paths and full URLs are used directly.
 * Cloudinary IDs use AVIF first and WebP as a fallback when configured.
 */
export function avatarPictureSources(
  src: string,
): { srcSet: string; type: string }[] {
  const normalizedSrc = normalizeSrc(src);

  if (isLocalPath(normalizedSrc) || isPlainUrl(normalizedSrc)) {
    return [
      {
        srcSet: normalizedSrc,
        type: "image/*",
      },
    ];
  }

  if (!hasCloudinaryConfig()) {
    return [
      {
        srcSet: normalizedSrc,
        type: "image/*",
      },
    ];
  }

  return [
    {
      srcSet: avatarAvifUrl(normalizedSrc),
      type: "image/avif",
    },
    {
      srcSet: avatarWebpUrl(normalizedSrc),
      type: "image/webp",
    },
  ];
}