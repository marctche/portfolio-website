"use client";

import { useEffect, useRef, useState } from "react";
import { TYPE_MS, prefersStill, typedCount } from "@/lib/scramble";

/**
 * Text that's re-typed by its own cursor when it changes (multi-cursor typing: every
 * <TypeText> on screen types at once, and all land together). The first render is plain; the
 * page-level <ScrambleIn> covers the first appearance. The untyped rest keeps its space
 * (invisible), so nothing moves. Screen readers get the real text at once; reduced motion swaps.
 */
export default function TypeText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [k, setK] = useState(text.length);
  const [shownText, setShownText] = useState(text);
  const prev = useRef(text);

  useEffect(() => {
    if (prev.current === text) return;
    prev.current = text;
    setShownText(text);
    if (prefersStill() || !text) {
      setK(text.length);
      return;
    }
    setK(0);
    const start = performance.now() + delay;
    let raf = 0;
    const tick = (now: number) => {
      const t = now - start;
      const n = typedCount(text.length, Math.max(0, t));
      setK(n);
      if (t < TYPE_MS) raf = requestAnimationFrame(tick);
      else setK(text.length);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay]);

  const typing = k < shownText.length;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {shownText.slice(0, k)}
        {typing ? <span className="type-caret-inline" /> : null}
        {typing ? <span className="type-ghost">{shownText.slice(k)}</span> : null}
      </span>
    </>
  );
}
