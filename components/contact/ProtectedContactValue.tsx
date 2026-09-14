"use client";

import { useEffect, useRef } from "react";

type ProtectedContactValueProps = {
  value: string;
  displayValue?: string;
  kind: "email" | "phone" | "copy";
  label: string;
  color?: string;
  fontSize?: number;
  className?: string;
};

/**
 * Keeps contact details out of ordinary text nodes and href attributes. This
 * reduces basic email/phone harvesting; it is deliberately not presented as a
 * replacement for rate limiting, Turnstile or a server-side contact form.
 */
export function ProtectedContactValue({
  value,
  displayValue = value,
  kind,
  label,
  color = "currentColor",
  fontSize = 14,
  className,
}: ProtectedContactValueProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !displayValue) return;

    const draw = () => {
      const context = canvas.getContext("2d");
      if (!context) return;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      context.font = `800 ${fontSize}px Montserrat, Arial, sans-serif`;
      const width = Math.ceil(context.measureText(displayValue).width + 4);
      const height = Math.ceil(fontSize * 1.65);
      canvas.width = width * scale;
      canvas.height = height * scale;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.scale(scale, scale);
      context.font = `800 ${fontSize}px Montserrat, Arial, sans-serif`;
      context.fillStyle = color;
      context.textAlign = "left";
      context.textBaseline = "middle";
      context.fillText(displayValue, 2, height / 2);
    };

    void document.fonts?.ready.then(draw);
    draw();
  }, [color, displayValue, fontSize]);

  const activate = async () => {
    if (kind === "email") window.location.assign(`mailto:${value}`);
    else if (kind === "phone") window.location.assign(`tel:${value}`);
    else await navigator.clipboard?.writeText(value);
  };

  return (
    <button type="button" onClick={activate} aria-label={label} className={className}>
      <canvas ref={canvasRef} aria-hidden="true" className="block max-w-full" />
    </button>
  );
}
