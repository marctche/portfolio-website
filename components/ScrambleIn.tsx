"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { FRAME_MS, TYPE_MS, frame, prefersStill, scrambleDuration, settleTimes, typedCount } from "@/lib/scramble";

/** Text that's never animated: screen-reader copies, svg, and anything opted out. */
const SKIP = ".sr-only, script, style, svg, [data-no-scramble]";
/** Longer than this, text is typed instead of glitched (unless it's a heading). */
const GLITCH_MAX = 60;

/** Headings glitch; paragraphs, sentences and long text are typed; other short text glitches. */
function isTyped(node: Text) {
  const el = node.parentElement!;
  if (el.closest("h1, h2, h3")) return false;
  const text = node.nodeValue!.trim();
  return Boolean(el.closest("p")) || /[.?!]$/.test(text) && text.includes(" ") || text.length > GLITCH_MAX;
}

type GlitchJob = { node: Text; text: string; chars: string[]; settle: number[]; delay: number; duration: number; last: string; done: boolean };
type TypeJob = { node: Text; length: number; start: number; caret: HTMLElement };

/**
 * As an inner page opens (first load and each tab click), its text arrives two ways:
 * - Headings and short standalone text (titles, names, labels, years) glitch into place. Its text node is
 *   flickered and put back exactly; a node React rewrites mid-glitch is left to React.
 * - Paragraphs, sentences (like the project one-liners) and long text are typed by many
 *   cursors at once. The DOM text never changes:
 *   the untyped part is hidden in place with a CSS highlight (`::highlight(typing)`, so the
 *   layout doesn't move), and each line's blue cursor is an overlay on <body>, outside React.
 *   Browsers without the Highlight API just show the text.
 * Home is skipped (it has its own typed line), and so is reduced motion. <main> is aria-busy
 * meanwhile, so screen readers wait for the real text.
 */
export default function ScrambleIn() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/" || prefersStill()) return;
    const main = document.getElementById("content");
    if (!main) return;

    const canType = typeof CSS !== "undefined" && "highlights" in CSS && typeof Highlight === "function";
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) =>
        n.nodeValue?.trim() && !n.parentElement?.closest(SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
    });
    const glitches: GlitchJob[] = [];
    const types: TypeJob[] = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const node = n as Text;
      const text = node.nodeValue!;
      if (isTyped(node)) {
        if (!canType) continue;
        const caret = document.createElement("span");
        caret.className = "type-caret";
        caret.setAttribute("aria-hidden", "true");
        types.push({ node, length: text.length, start: Math.min(300, types.length * 35), caret });
        continue;
      }
      const chars = [...text];
      const duration = scrambleDuration(chars.length);
      // A small stagger in reading order, so the page settles from the top down.
      const delay = Math.min(260, glitches.length * 12);
      glitches.push({ node, text, chars, settle: settleTimes(chars.length, duration), delay, duration, last: text, done: false });
    }
    if (!glitches.length && !types.length) return;

    const hidden = canType && types.length ? new Highlight() : null;
    if (hidden) CSS.highlights.set("typing", hidden);
    for (const j of types) document.body.appendChild(j.caret);

    main.setAttribute("aria-busy", "true");
    const start = performance.now();
    let raf = 0;
    let lastGlitch = 0;
    const ours = (j: GlitchJob) => !j.done && j.node.isConnected && j.node.nodeValue === j.last;
    const put = (j: GlitchJob, value: string) => {
      j.node.nodeValue = value;
      j.last = value;
    };
    /** Place a cursor at character `k` of a text node, in page coordinates. */
    const place = (j: TypeJob, k: number) => {
      const r = document.createRange();
      const at = Math.min(k, j.length - 1);
      r.setStart(j.node, at);
      r.setEnd(j.node, at + 1);
      const box = r.getClientRects()[0] ?? r.getBoundingClientRect();
      const x = k >= j.length ? box.right : box.left;
      j.caret.style.transform = `translate(${x + window.scrollX}px, ${box.top + window.scrollY}px)`;
      j.caret.style.height = `${box.height}px`;
    };
    const finish = () => {
      for (const j of glitches) {
        if (ours(j)) put(j, j.text);
        j.done = true;
      }
      if (hidden) CSS.highlights.delete("typing");
      for (const j of types) j.caret.remove();
      main.removeAttribute("aria-busy");
    };
    const tick = (now: number) => {
      const t = now - start;
      let running = false;
      // Cursors move every frame; the glitch repaints at its own slower rate, so it reads as a
      // flicker rather than a blur.
      const glitchFrame = now - lastGlitch > FRAME_MS;
      if (glitchFrame) lastGlitch = now;
      {
        for (const j of glitches) {
          if (!glitchFrame) {
            if (!j.done) running = true;
            continue;
          }
          if (!ours(j)) {
            j.done = true;
            continue;
          }
          const local = t - j.delay;
          if (local < j.duration) {
            running = true;
            put(j, frame(j.chars, j.settle, Math.max(0, local)));
          } else {
            put(j, j.text);
            j.done = true;
          }
        }
        if (hidden) {
          hidden.clear();
          for (const j of types) {
            if (!j.node.isConnected || j.node.length !== j.length) {
              j.caret.remove();
              continue;
            }
            const local = t - j.start;
            const k = typedCount(j.length, local);
            if (local < TYPE_MS) {
              running = true;
              const r = document.createRange();
              r.setStart(j.node, k);
              r.setEnd(j.node, j.length);
              hidden.add(r);
              place(j, k);
            } else j.caret.remove();
          }
        }
        if (!running) {
          finish();
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    // Hide the untyped text before the first paint, so nothing flashes in full first.
    if (hidden) {
      for (const j of types) {
        const r = document.createRange();
        r.setStart(j.node, 0);
        r.setEnd(j.node, j.length);
        hidden.add(r);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      finish();
    };
  }, [pathname]);

  return null;
}
