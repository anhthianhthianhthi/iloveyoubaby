/**
 * Floating "our song" button.
 * - Hidden automatically if the mp3 can't be loaded.
 * - Starts playing when he clicks "Yes" on the intro (browsers only allow
 *   sound after a click), otherwise he can tap the button.
 */

import { escapeHtml } from "../utils/dom.js";
import { initLyrics } from "./lyrics.js";

const VOLUME = 0.6;
const FADE_MS = 1500;

export function initMusic({ src, title, artist, lyricsOffset = "auto" }) {
  const audio = new Audio();
  audio.src = src;
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "music";
  button.hidden = true; // shown once we know the file exists
  button.innerHTML = `
    <span class="music__disc" aria-hidden="true">♪</span>
    <span class="music__text">
      <b>${escapeHtml(title)}</b>
      <small>${escapeHtml(artist)} · <span data-state>tap to play</span></small>
    </span>`;
  document.body.appendChild(button);
  const stateEl = button.querySelector("[data-state]");

  let fadeTimer = null;
  const fadeTo = (target, done) => {
    clearInterval(fadeTimer);
    const step = (target - audio.volume) / (FADE_MS / 50);
    fadeTimer = setInterval(() => {
      const next = audio.volume + step;
      if ((step >= 0 && next >= target) || (step < 0 && next <= target)) {
        audio.volume = target;
        clearInterval(fadeTimer);
        done?.();
      } else {
        audio.volume = Math.min(1, Math.max(0, next));
      }
    }, 50);
  };

  const setPlaying = (playing) => {
    button.classList.toggle("is-playing", playing);
    button.setAttribute("aria-label", `${playing ? "Pause" : "Play"} the song that reminds me of you: ${title} by ${artist}`);
    stateEl.textContent = playing ? "playing ♡" : "tap to play";
  };

  const play = () =>
    audio
      .play()
      .then(() => {
        setPlaying(true);
        fadeTo(VOLUME);
      })
      .catch(() => setPlaying(false));

  const pause = () => {
    setPlaying(false);
    fadeTo(0, () => audio.pause());
  };

  audio.addEventListener("canplay", () => (button.hidden = false), { once: true });
  audio.addEventListener("error", () => button.remove());

  button.addEventListener("click", () => (audio.paused || !button.classList.contains("is-playing") ? play() : pause()));

  // The intro's "Yes" click counts as permission to play sound.
  document.addEventListener("intro:yes", play);

  setPlaying(false);
  initLyrics(audio, { title, artist, offset: lyricsOffset });
}
