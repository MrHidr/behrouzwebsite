import type { SVGProps } from "react";

export function ArrowDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="20" height="20" aria-hidden {...props}>
      <path
        d="M5 7.5 10 12.5 15 7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden {...props}>
      <path
        d="M5 4h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5V17a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FaxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden {...props}>
      <path
        d="M7 9V4h10v5M7 18H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v6H7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="m4 7 8 5 8-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function UpRightBox({ rtl = false, ...props }: SVGProps<SVGSVGElement> & { rtl?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="24" height="24" aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d={rtl ? "M15 15 9 9M9 9h5M9 9v5" : "M9 15 15 9M15 9H10M15 9V14"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowForward({ rtl = false, ...props }: SVGProps<SVGSVGElement> & { rtl?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="24" height="24" aria-hidden {...props}>
      <path
        d={rtl ? "M19 12H5M11 6l-6 6 6 6" : "M5 12h14M13 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowUpForward({ rtl = false, ...props }: SVGProps<SVGSVGElement> & { rtl?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="24" height="24" aria-hidden {...props}>
      <path
        d={rtl ? "M17 17 7 7M7 7h8M7 7v8" : "M7 17 17 7M17 7H9M17 7v8"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="24" height="24" aria-hidden {...props}>
      <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="24" height="24" aria-hidden {...props}>
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="24" height="24" aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5.4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden {...props}>
      <path d="M6.94 8.5H4.2V19h2.74V8.5ZM5.57 4.2a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2ZM19.8 19v-5.77c0-3.09-1.65-4.53-3.85-4.53-1.78 0-2.57.98-3.02 1.66V8.5H10.2c.04.77 0 10.5 0 10.5h2.73v-5.86c0-.26.02-.53.1-.72.2-.53.7-1.08 1.5-1.08 1.06 0 1.49.81 1.49 2v5.66h2.73Z" />
    </svg>
  );
}

export function AparatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="24" height="24" aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.8" />
      {[
        [19, 12],
        [15.5, 18.0622],
        [8.5, 18.0622],
        [5, 12],
        [8.5, 5.9378],
        [15.5, 5.9378],
      ].map(([cx, cy], index) => (
        <circle key={index} cx={cx} cy={cy} r="0.9" fill="currentColor" />
      ))}
    </svg>
  );
}

export function BarcodeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="24" height="24" aria-hidden {...props}>
      <path
        d="M4 6v12M7 6v12M10.5 6v12M13.5 6v12M17 6v12M20 6v12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WeightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="24" height="24" aria-hidden {...props}>
      <path
        d="M6 8h12l2 11a1 1 0 0 1-1 1.2H5A1 1 0 0 1 4 19L6 8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9.5 12.5 12 15l3-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="24" height="24" aria-hidden {...props}>
      <path
        d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M4 7.5 12 12l8-4.5M12 12v9" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="24" height="24" aria-hidden {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="24" height="24" aria-hidden {...props}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
