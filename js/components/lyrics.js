/**
 * Synced lyrics: fetches timed lyrics from lrclib.net (free, no key needed)
 * and shows the current line in a small floating card while the song plays
 * (plus the next line, faded).
 *
 * LRC lines look like:  [01:23.45] some words
 */

const LRCLIB = "https://lrclib.net/api";

/** Look the song up on lrclib: exact match first, then a search. */
async function fetchSyncedLyrics(title, artist) {
  const params = new URLSearchParams({ track_name: title, artist_name: artist });
  try {
    const exact = await fetch(`${LRCLIB}/get?${params}`);
    if (exact.ok) {
      const song = await exact.json();
      if (song.syncedLyrics) return song;
    }
    const search = await fetch(`${LRCLIB}/search?${params}`);
    if (search.ok) {
      const results = await search.json();
      return results.find((s) => s.syncedLyrics) || null;
    }
  } catch {
    /* offline or blocked: just no lyrics */
  }
  return null;
}

/** Wait until the audio knows its duration. */
const audioDuration = (audio) =>
  new Promise((resolve) => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) return resolve(audio.duration);
    audio.addEventListener("loadedmetadata", () => resolve(audio.duration), { once: true });
  });

import { replayAnimation } from "../utils/dom.js";

const TIME_TAG = /\[(\d{1,2}):(\d{1,2}(?:\.\d{1,3})?)\]/g;

export function parseLrc(text) {
  const lines = [];
  for (const raw of text.split(/\r?\n/)) {
    const tags = [...raw.matchAll(TIME_TAG)];
    if (!tags.length) continue;
    const words = raw.replace(TIME_TAG, "").trim();
    for (const [, min, sec] of tags) lines.push({ time: Number(min) * 60 + Number(sec), text: words });
  }
  return lines.sort((a, b) => a.time - b.time);
}

export async function initLyrics(audio, { title, artist, offset = "auto" }) {
  const song = await fetchSyncedLyrics(title, artist);
  if (!song) {
    console.warn(`[lyrics] No synced lyrics found on lrclib for "${title}" by ${artist}.`);
    return;
  }
  const lines = parseLrc(song.syncedLyrics);
  if (!lines.length) return;

  // "auto": if our mp3 is longer than the official track (e.g. a video intro),
  // shift the lyrics by the difference.
  if (offset === "auto") {
    const extra = (await audioDuration(audio)) - (song.duration || 0);
    offset = song.duration && extra > 1 ? extra : 0;
  }
  console.info(`[lyrics] Loaded ${lines.length} lines, offset ${Number(offset).toFixed(1)}s. First line at ${(lines[0].time + offset).toFixed(1)}s.`);

  const box = document.createElement("div");
  box.className = "lyrics is-waiting";
  box.hidden = true;
  box.setAttribute("aria-live", "polite");
  box.innerHTML = `
    <button class="lyrics__close" type="button" aria-label="Hide lyrics">×</button>
    <p class="lyrics__line"></p>
    <p class="lyrics__next"></p>`;
  document.body.appendChild(box);

  const lineEl = box.querySelector(".lyrics__line");
  const nextEl = box.querySelector(".lyrics__next");
  let current = -2;
  let dismissed = false;
  let frame = null;

  const indexAt = (t) => {
    let found = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].time <= t) found = i;
      else break;
    }
    return found;
  };

  function render() {
    const i = indexAt(audio.currentTime - offset);
    if (i === current) return;
    current = i;
    const text = i >= 0 ? lines[i].text : "";
    // Intro / instrumental parts: keep the card visible with little notes.
    lineEl.textContent = text || "♪ ♪ ♪";
    nextEl.textContent = lines[i + 1]?.text || "";
    box.classList.toggle("is-waiting", !text);
    replayAnimation(lineEl, "is-entering");
  }

  const tick = () => {
    render();
    frame = requestAnimationFrame(tick);
  };

  const show = () => {
    if (dismissed) return;
    box.hidden = false;
    cancelAnimationFrame(frame);
    tick();
  };
  const hide = () => {
    box.hidden = true;
    cancelAnimationFrame(frame);
  };

  audio.addEventListener("play", () => {
    dismissed = false; // pressing play again brings the lyrics back
    show();
  });
  audio.addEventListener("pause", hide);
  box.querySelector(".lyrics__close").addEventListener("click", () => {
    dismissed = true;
    hide();
  });

  if (!audio.paused) show();
}
