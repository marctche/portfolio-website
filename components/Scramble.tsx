"use client";

import { useEffect, useRef, useState } from "react";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = LOWER.toUpperCase();
const DIGITS = "0123456789";

/** A random character of the same kind (lower, upper, digit); anything else stays put. */
function noise(ch: string) {
  const set = /[a-z]/.test(ch) ? LOWER : /[A-Z]/.test(ch) ? UPPER : /[0-9]/.test(ch) ? DIGITS : "";
  return set ? set[Math.floor(Math.random() * set.length)] : ch;
}

/**
 * Text that "glitches" into place when it changes: every letter flickers through random
 * letters and settles, roughly left to right, in about half a second. It shows the real text
 * on first render (so no-JS and the server render are plain), and only scrambles on a change.
 * Screen readers get the real text at once; reduced motion just swaps it.
 */
export default function Scramble({ text }: { text: string }) {
  const [shown, setShown] = useState(text);
  const prev = useRef(text);

  useEffect(() => {
    if (prev.current === text) return;
    prev.current = text;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      return;
    }
    const chars = [...text];
    const n = chars.length;
    const duration = Math.min(750, 300 + n * 5);
    // Each character settles at its own moment: mostly left to right, with some jitter.
    const settle = chars.map((_, i) => (i / Math.max(1, n)) * duration * 0.65 + Math.random() * duration * 0.35);
    const start = performance.now();
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      const t = now - start;
      if (t >= duration) {
        setShown(text);
        return;
      }
      if (now - last > 45) {
        last = now;
        setShown(chars.map((ch, i) => (t >= settle[i] ? ch : noise(ch))).join(""));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </>
  );
}
