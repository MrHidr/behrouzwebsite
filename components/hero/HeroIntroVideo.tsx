"use client";

import { useEffect, useRef } from "react";
import { HERO_MEDIA } from "@/lib/heroConfig";
import { useIntro } from "@/components/intro/IntroProvider";

/**
 * The hero background: a single 4s intro shot (NOT a loop).
 *
 * - While the loader is up it holds on its first frame (= the loader's poster)
 *   and reports readiness so the intro can't release before the first frame is
 *   actually downloaded.
 * - The moment the intro releases it plays, in parallel with the loader's
 *   0.5s unblur.
 * - When playback passes HERO_MEDIA.uiAt it tells the provider to stagger the
 *   hero UI in.
 * - It then runs to the end and freezes on the last frame — that frame IS the
 *   hero still. No loop, no reset.
 *
 * Mobile notes: we gate on `loadeddata` (first frame decoded), NOT
 * `canplaythrough` — mobile browsers routinely defer the latter forever. And
 * playback is made resilient to blocked autoplay (iOS Low Power Mode, etc.) by
 * falling back to the first user gesture.
 */
export function HeroIntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { phase, videoReady, uiReady } = useIntro();

  // Kick off download and report once the FIRST FRAME is paintable.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.readyState >= 2) {
      videoReady(); // HAVE_CURRENT_DATA already
      return;
    }
    const onData = () => videoReady();
    v.addEventListener("loadeddata", onData, { once: true });
    // Nudge the browser to actually fetch (mobile downgrades preload="auto").
    try {
      v.load();
    } catch {
      /* no-op */
    }
    return () => v.removeEventListener("loadeddata", onData);
  }, [videoReady]);

  // Play when the intro releases (or immediately on revisits), resilient to
  // autoplay being blocked → start on the first tap instead.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (phase === "loading") {
      v.pause();
      return;
    }

    let cancelled = false;
    const onGesture = () => v.play().catch(() => {});
    const armGesture = () => {
      window.addEventListener("pointerdown", onGesture, { once: true });
      window.addEventListener("touchend", onGesture, { once: true });
    };

    v.play().catch(() => {
      if (!cancelled) armGesture(); // autoplay blocked → wait for interaction
    });

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("touchend", onGesture);
    };
  }, [phase]);

  return (
    <div className="absolute inset-0">
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        poster={HERO_MEDIA.poster}
        muted
        playsInline
        preload="auto"
        onTimeUpdate={(e) => {
          if (e.currentTarget.currentTime >= HERO_MEDIA.uiAt) uiReady();
        }}
        onEnded={uiReady} // safety: never leave the UI hidden after the shot ends
      >
        <source src={HERO_MEDIA.introMp4} type="video/mp4" />
      </video>
    </div>
  );
}
