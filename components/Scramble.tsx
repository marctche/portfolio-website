"use client";

import { useEffect, useRef, useState } from "react";
import { FRAME_MS, frame, prefersStill, scrambleDuration, settleTimes } from "@/lib/scramble";

/**
 * Text that glitches into place when it changes (lib/scramble.ts). It shows the real text on
 * first render (so no-JS and the server render are plain), and only scrambles on a change;
 * the page-level <ScrambleIn> covers the first appearance. Screen readers get the real text
 * at once; reduced motion just swaps it.
 */
export default function Scramble({ text }: { text: string }) {
  const [shown, setShown] = useState(text);
  const prev = useRef(text);

  useEffect(() => {
    if (prev.current === text) return;
    prev.current = text;
    if (prefersStill()) {
      setShown(text);
      return;
    }
    const chars = [...text];
    const duration = scrambleDuration(chars.length);
    const settle = settleTimes(chars.length, duration);
    const start = performance.now();
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      const t = now - start;
      if (t >= duration) {
        setShown(text);
        return;
      }
      if (now - last > FRAME_MS) {
        last = now;
        setShown(frame(chars, settle, t));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" data-scramble-own>
        {shown}
      </span>
    </>
  );
}
