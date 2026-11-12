"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * The home hero's second line. It renders `lines[0]`, then, a couple of seconds apart,
 * backspaces and retypes only the words that differ from the next line, and loops. Leaving
 * the link's line is a select-and-delete instead: its words get highlighted as if dragged
 * across, vanish at once, and the next line types in.
 * - `link`: once its line is fully typed, its word turns into a link (underline draws in).
 *   That line holds longer, and the loop waits while the pointer is on the link.
 *
 * - No JS, reduced motion: `lines[0]`, still. Screen readers always get `lines[0]`.
 * - Every line also sits invisibly in one grid cell, so the box is always as tall as the
 *   longest line at the current width. The typed text is laid over that box, so nothing
 *   around it moves while it types.
 * - Pauses while the tab is hidden.
 */

const FIRST_HOLD = 1800; // ms on the first line before anything moves
const HOLD = 1800; // ms on each line once it's finished
const LINK_HOLD = 4200; // ms on the line with the link
const ARRIVE = 420; // the caret sits at the edit point before it starts selecting
const SELECT = 14; // per character, as the selection grows backwards
const SELECTED = 420; // the selection holds before it's deleted
const BETWEEN = 260; // between deleting and typing, and between two edits
const DELETE = 28; // per character, backspacing
const TYPE = 55; // per character, plus up to TYPE_JITTER
const TYPE_JITTER = 45;

/** On screen: head, the caret, the selected text (if any), tail. */
type View = { head: string; sel: string; tail: string; caret: boolean };
type LineLink = { line: number; word: string; href: string };
type Step = View & { wait: number };
/** Turn `from` into `to`, with `before` and `after` on either side. */
type Edit = { before: string; from: string; to: string; after: string };

/** Words keep their trailing space. Punctuation is its own token, so "ottawa." and "fall." share the ".". */
function tokenize(s: string): string[] {
  return s.match(/[^\s.,;:!?]+\s*|[.,;:!?]+\s*|\s+/g) ?? [];
}

/** A space both sides share stays put instead of being deleted and retyped. */
function keepSharedSpace({ before, from, to, after }: Edit): Edit {
  while (from && to && from[0] === to[0] && /\s/.test(from[0])) {
    before += from[0];
    from = from.slice(1);
    to = to.slice(1);
  }
  while (from && to && from[from.length - 1] === to[to.length - 1] && /\s/.test(to[to.length - 1])) {
    after = to[to.length - 1] + after;
    from = from.slice(0, -1);
    to = to.slice(0, -1);
  }
  return { before, from, to, after };
}

/**
 * The edits that turn `a` into `b`. Words outside their longest common subsequence form
 * runs, and each run is one backspace-and-retype. Runs go left to right, the way you'd
 * read them, unless that would make the sentence longer midway than both `a` and `b`
 * (and so maybe a line taller than the box) and right to left wouldn't.
 */
function edits(a: string, b: string): Edit[] {
  const A = tokenize(a);
  const B = tokenize(b);
  const n = A.length;
  const m = B.length;
  const lcs = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = A[i] === B[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  // Token ranges A[a0, a1) and B[b0, b1) that differ.
  const runs: { a0: number; a1: number; b0: number; b1: number }[] = [];
  let i = 0;
  let j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && A[i] === B[j]) {
      i++;
      j++;
      continue;
    }
    const a0 = i;
    const b0 = j;
    while ((i < n || j < m) && !(i < n && j < m && A[i] === B[j])) {
      if (j < m && (i === n || lcs[i][j + 1] >= lcs[i + 1][j])) j++;
      else i++;
    }
    runs.push({ a0, a1: i, b0, b1: j });
  }

  const join = (t: string[], start: number, end?: number) => t.slice(start, end).join("");
  // Left to right, the text before a run is already b's and the text after it is still a's.
  const ltr = runs.map((r) => ({
    before: join(B, 0, r.b0),
    from: join(A, r.a0, r.a1),
    to: join(B, r.b0, r.b1),
    after: join(A, r.a1),
  }));
  // Right to left, the other way round.
  const rtl = [...runs].reverse().map((r) => ({
    before: join(A, 0, r.a0),
    from: join(A, r.a0, r.a1),
    to: join(B, r.b0, r.b1),
    after: join(B, r.b1),
  }));
  const peak = (list: Edit[]) =>
    Math.max(0, ...list.map((e) => e.before.length + e.to.length + e.after.length));
  const tooLong = peak(ltr) > Math.max(a.length, b.length);
  return (tooLong && peak(rtl) < peak(ltr) ? rtl : ltr).map(keepSharedSpace);
}

/**
 * Every frame from `a` to `b`, ending on `b` with the caret gone and held for `hold`.
 * `select`: remove the old words with a select-and-delete instead of backspacing.
 */
function steps(a: string, b: string, hold: number, select: boolean): Step[] {
  const out: Step[] = [];
  const pause = (wait: number) => {
    out[out.length - 1].wait = wait;
  };
  for (const { before, from, to, after } of edits(a, b)) {
    out.push({ head: before + from, sel: "", tail: after, caret: true, wait: ARRIVE });
    if (from && !select) {
      for (let k = from.length - 1; k >= 0; k--) {
        out.push({ head: before + from.slice(0, k), sel: "", tail: after, caret: true, wait: DELETE });
      }
      pause(BETWEEN);
    } else if (from) {
      // Select backwards, a character at a time, like a quick drag; hold; delete it all.
      for (let k = from.length - 1; k >= 0; k--) {
        out.push({ head: before + from.slice(0, k), sel: from.slice(k), tail: after, caret: true, wait: SELECT });
      }
      pause(SELECTED);
      out.push({ head: before, sel: "", tail: after, caret: true, wait: BETWEEN });
    }
    for (let k = 1; k <= to.length; k++) {
      out.push({
        head: before + to.slice(0, k),
        sel: "",
        tail: after,
        caret: true,
        wait: TYPE + Math.random() * TYPE_JITTER,
      });
    }
    pause(BETWEEN);
  }
  out.push({ head: b, sel: "", tail: "", caret: false, wait: hold });
  return out;
}

/** `line` with `link.word` as a link, if this is the link's line. */
function withLink(line: string, link: LineLink | undefined, lines: string[]) {
  if (!link || line !== lines[link.line]) return line;
  const at = line.indexOf(link.word);
  if (at < 0) return line;
  return (
    <>
      {line.slice(0, at)}
      {/* Out of the tab order: the hero is aria-hidden, and the projects tile is right below. */}
      <Link className="typed-link" href={link.href} tabIndex={-1}>
        {link.word}
      </Link>
      {line.slice(at + link.word.length)}
    </>
  );
}

export default function TypedLine({
  lines,
  link,
  className,
}: {
  lines: [string, ...string[]];
  link?: LineLink;
  className?: string;
}) {
  const [view, setView] = useState<View>({ head: lines[0], sel: "", tail: "", caret: false });
  const hovering = useRef(false);

  useEffect(() => {
    const rest: View = { head: lines[0], sel: "", tail: "", caret: false };
    // Start from the default line, even if the lines changed mid-edit.
    setView((v) => (v.head === rest.head && !v.sel && !v.tail && !v.caret ? v : rest));

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (lines.length < 2 || calm.matches) return;

    let timer = 0;
    let at = 0; // the line being typed toward (or on screen, between edits)
    let queue: Step[] = [];

    const tick = () => {
      if (calm.matches) {
        setView(rest); // reduced motion switched on mid-loop: settle on the default line
        return;
      }
      if (document.hidden) {
        document.addEventListener("visibilitychange", tick, { once: true });
        return;
      }
      if (hovering.current) {
        timer = window.setTimeout(tick, 300); // someone is about to click the link: wait
        return;
      }
      if (queue.length === 0) {
        const next = (at + 1) % lines.length;
        queue = steps(
          lines[at],
          lines[next],
          link && next === link.line ? LINK_HOLD : HOLD,
          Boolean(link && at === link.line),
        );
        at = next;
      }
      const { wait, ...shown } = queue.shift()!;
      setView(shown);
      timer = window.setTimeout(tick, wait);
    };

    timer = window.setTimeout(tick, FIRST_HOLD);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [lines, link]);

  const atRest = !view.caret && !view.sel && !view.tail;

  return (
    <p className={className}>
      <span className="sr-only">{lines[0]}</span>
      <span className="typed" aria-hidden="true">
        {lines.map((line, i) => (
          <span className="typed-ghost" key={i}>
            {line}
          </span>
        ))}
        <span
          className="typed-live"
          onPointerOver={(e) => {
            hovering.current = (e.target as HTMLElement).classList.contains("typed-link");
          }}
          onPointerLeave={() => {
            hovering.current = false;
          }}
        >
          {atRest ? withLink(view.head, link, lines) : view.head}
          <span className={view.caret ? "typed-caret on" : "typed-caret"} />
          {view.sel ? <span className="typed-sel">{view.sel}</span> : null}
          {view.tail}
        </span>
      </span>
    </p>
  );
}
