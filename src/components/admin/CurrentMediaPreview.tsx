"use client";

import { useField } from "@payloadcms/ui";

export function CurrentMediaPreview({ path }: { path: string }) {
  const { value } = useField<string>({ path });
  if (!value || !value.startsWith("/")) return null;

  const cleanPath = value.split(/[?#]/)[0].toLowerCase();
  const isVideo = cleanPath.endsWith(".mp4") || cleanPath.endsWith(".webm");
  const isDocument = cleanPath.endsWith(".pdf");

  return (
    <div className="behrouz-current-media">
      <div className="behrouz-current-media__header">
        <strong>فایل فعلی سایت</strong>
        <a href={value} rel="noreferrer" target="_blank">باز کردن فایل</a>
      </div>
      {isVideo ? (
        <video controls muted playsInline preload="metadata" src={value} />
      ) : isDocument ? (
        <a className="behrouz-current-media__document" href={value} rel="noreferrer" target="_blank">
          پیش‌نمایش PDF در پنجره جدید
        </a>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt="پیش‌نمایش فایل فعلی" loading="lazy" src={value} />
      )}
    </div>
  );
}
