"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

/**
 * Intro/loading orchestration shared by the loader, the hero video, and the
 * hero copy. Runs on EVERY page (every pathname change) — the loader is never
 * skipped, it just gets a shorter "glance" hold on repeat navigations.
 *
 * Very first visit of the session, on the home page ("cinematic" variant):
 *
 *   loading ──► intro ──────────────► done
 *   (sauce      (loader shutters UP,  (hero UI staggers in;
 *    texture     hero video plays      video keeps playing and
 *    blooms      beneath)              freezes on its last frame)
 *    B&W→colour)
 *
 * - `loading` holds ≥ MIN_LOADING_MS and until fonts + window load + the hero
 *   video can play through (capped so nothing traps the user).
 * - `intro` → `done` is driven by the VIDEO CLOCK: the hero video reports
 *   playback time and we release the UI at HERO_MEDIA.uiAt (~3s), so the copy
 *   lands in the shot's final second. A wall-clock fallback covers autoplay
 *   failure.
 *
 * Every other navigation (any route after the first cinematic run, including
 * back to home) gets the "plain" variant: the same sauce-texture loader held
 * for a brief MIN_PLAIN_MS glance, then `done`. The minimum hold + the
 * shutter-up reveal always play out in full, even when everything is already
 * cached and ready instantly — no jump-cuts straight to the page.
 */
export type IntroPhase = "loading" | "intro" | "done";
export type IntroVariant = "cinematic" | "plain";

type IntroContextValue = {
  phase: IntroPhase;
  variant: IntroVariant;
  /** hero video calls this once its first frame is downloaded (cinematic gate) */
  videoReady: () => void;
  /** hero video calls this when playback passes HERO_MEDIA.uiAt */
  uiReady: () => void;
};

const IntroContext = createContext<IntroContextValue>({
  phase: "done",
  variant: "plain",
  videoReady: () => {},
  uiReady: () => {},
});
export const useIntro = () => useContext(IntroContext);
/** Convenience for components that only care about the phase. */
export const useIntroPhase = () => useContext(IntroContext).phase;

/** Minimum time the loader stays up on the very first visit of the session. */
const MIN_LOADING_MS = 2000;
/** Minimum "glance" hold on every later navigation (1–2s together with the reveal). */
const MIN_PLAIN_MS = 1000;
/** How long the loader's shutter-up reveal takes (keep in sync with Loader). */
export const REVEAL_MS = 700;
/** Never trap the user behind a stuck asset (fonts, video, …). */
const ASSET_CAP_MS = 6000;
/** If the video never plays (blocked autoplay), release the UI anyway. */
const UI_FALLBACK_MS = 3500;

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<IntroPhase>("loading");
  const [variant, setVariant] = useState<IntroVariant>("plain");
  const videoReadyRef = useRef<() => void>(() => {});

  const uiReady = useCallback(() => setPhase("done"), []);
  const videoReady = useCallback(() => videoReadyRef.current(), []);

  // Re-runs on every navigation (not just the first mount) so the loader
  // always plays — full cinematic treatment once per session on home, a
  // short branded glance on every other page load after that.
  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;
    const start = performance.now();
    const cinematic = pathname === "/" && !sessionStorage.getItem("behrouz:cinematicShown");

    setVariant(cinematic ? "cinematic" : "plain");
    setPhase("loading");

    const videoGate = cinematic
      ? new Promise<void>((r) => {
          videoReadyRef.current = r;
        })
      : Promise.resolve();

    const assetsReady = Promise.all([
      (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve(),
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true })),
      videoGate,
    ]);

    const capped = Promise.race([
      assetsReady.then(() => undefined),
      new Promise<void>((r) => window.setTimeout(r, ASSET_CAP_MS)),
    ]);

    capped.then(() => {
      if (cancelled) return;
      const min = cinematic ? MIN_LOADING_MS : MIN_PLAIN_MS;
      const wait = Math.max(0, min - (performance.now() - start));
      window.setTimeout(() => {
        if (cancelled) return;
        if (cinematic) {
          sessionStorage.setItem("behrouz:cinematicShown", "1");
          setPhase("intro"); // loader shutters up, video starts
          // Wall-clock fallback in case the video clock never reaches uiAt.
          window.setTimeout(() => {
            if (!cancelled) uiReady();
          }, UI_FALLBACK_MS);
        } else {
          setPhase("done");
        }
      }, wait);
    });

    return () => {
      cancelled = true;
    };
  }, [pathname, uiReady]);

  // Lock scroll while the loader is up.
  useEffect(() => {
    document.body.style.overflow = phase === "loading" ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  return (
    <IntroContext.Provider value={{ phase, variant, videoReady, uiReady }}>
      {children}
    </IntroContext.Provider>
  );
}
