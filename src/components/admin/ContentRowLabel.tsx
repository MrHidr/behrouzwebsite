"use client";

import { useRowLabel } from "@payloadcms/ui";

export function ContentRowLabel() {
  const { data, rowNumber } = useRowLabel<{
    adminLabel?: string;
    enabled?: boolean;
    title?: string;
    name?: string;
    label?: string;
  }>();
  const title = data?.adminLabel || data?.title || data?.name || data?.label;
  return (
    <span className="behrouz-row-label">
      {typeof data?.enabled === "boolean" && (
        <i className={`behrouz-row-label__status ${data.enabled ? "is-visible" : "is-hidden"}`} />
      )}
      {title || `مورد ${Number(rowNumber ?? 0) + 1}`}
      {data?.enabled === false && <small>پنهان</small>}
    </span>
  );
}
