// The site's "glitch into place" text effect, shared by <Scramble> (one string that changes)
// and <ScrambleIn> (every text node on a page as it opens). Letters flicker through random
// letters of the same kind and settle roughly left to right; spaces and punctuation stay put.

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = LOWER.toUpperCase();
const DIGITS = "0123456789";

/** A random character of the same kind (lower, upper, digit); anything else stays put. */
export function noise(ch: string) {
  const set = /[a-z]/.test(ch) ? LOWER : /[A-Z]/.test(ch) ? UPPER : /[0-9]/.test(ch) ? DIGITS : "";
  return set ? set[Math.floor(Math.random() * set.length)] : ch;
}

/** How long a string of `length` characters takes to settle, in ms. */
export const scrambleDuration = (length: number) => Math.min(1050, 420 + length * 5);

/** When each character settles: mostly left to right, with some jitter. */
export function settleTimes(length: number, duration: number) {
  return Array.from({ length }, (_, i) => (i / Math.max(1, length)) * duration * 0.65 + Math.random() * duration * 0.35);
}

/** The string at time `t` ms into its scramble. */
export function frame(chars: string[], settle: number[], t: number) {
  return chars.map((ch, i) => (t >= settle[i] ? ch : noise(ch))).join("");
}

export const prefersStill = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Repaints are throttled to this, so the flicker reads as a glitch rather than a blur. */
export const FRAME_MS = 45;

// Multi-cursor typing, for longer text: every line types at once with its own cursor, and
// long lines type faster so they all land together.

/** How long typing takes, whatever the length, in ms. */
export const TYPE_MS = 1150;

/** How many of `length` characters are typed `t` ms after starting: quick start, gentle landing. */
export function typedCount(length: number, t: number) {
  const u = Math.max(0, Math.min(1, t / TYPE_MS));
  return Math.round((1 - (1 - u) ** 2) * length);
}
