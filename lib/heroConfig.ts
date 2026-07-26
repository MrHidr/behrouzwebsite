// Hero copy lives in lib/i18n.ts (STR.hero); only the link target lives here.
export const HERO_LINK = "/about";

/**
 * The hero is a single 4s "intro" shot (not a loop): it plays once after the
 * loader releases and freezes on its final frame, which becomes the hero
 * still. `poster` is the video's exact FIRST frame — the loader shows it
 * blurred, so unblur → play is seamless.
 */
export const HERO_MEDIA = {
  poster: "/media/site/hero-poster.webp",
  introMp4: "/media/site/hero-intro.mp4",
  /** video time (s) at which the hero UI starts staggering in — 2.5s into
   *  the 4s shot, so the copy builds over the final 1.5s and settles as the
   *  video freezes on its last frame */
  uiAt: 2.5,
};
