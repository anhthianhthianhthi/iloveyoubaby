/**
 * Opening screen: "Are you the love of my life?"
 * The "No" button runs away, and "Yes" grows every time he tries.
 * Shown once per browser session.
 */

import { $ } from "../utils/dom.js";
import { burstHearts } from "../utils/effects.js";

const SESSION_KEY = "introDone";
const NO_MESSAGES = [
  "bro?? 😤",
  "wrong button, love",
  "that button is broken, try the other one",
  "are you ragebaiting me rn",
  "I'm telling Cookie 🧸",
  "the pink one, my loveee. the pink one.",
];

const alreadySeen = () => {
  try { return sessionStorage.getItem(SESSION_KEY) === "1"; } catch { return false; }
};
const markSeen = () => {
  try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* ignore */ }
};

export function initIntro() {
  const intro = $("#intro");
  if (!intro) return;
  if (alreadySeen()) {
    intro.remove();
    return;
  }

  const yes = $("#intro-yes");
  const no = $("#intro-no");
  const sub = $("#intro-sub");
  let dodges = 0;

  document.body.style.overflow = "hidden";

  /** Pick a random spot that's fully on screen and not on top of the Yes button. */
  function randomSpot(width, height) {
    const pad = 16;
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const maxX = Math.max(pad, vw - width - pad);
    const maxY = Math.max(pad, vh - height - pad);
    const yesBox = yes.getBoundingClientRect();

    let spot;
    for (let tries = 0; tries < 20; tries++) {
      spot = { x: pad + Math.random() * (maxX - pad), y: pad + Math.random() * (maxY - pad) };
      const overlapsYes =
        spot.x < yesBox.right + 12 && spot.x + width > yesBox.left - 12 &&
        spot.y < yesBox.bottom + 12 && spot.y + height > yesBox.top - 12;
      if (!overlapsYes) break;
    }
    return spot;
  }

  function runAway(e) {
    e.preventDefault();
    const { width, height } = no.getBoundingClientRect();

    // Move it out of the animated card so `position: fixed` is relative to the screen.
    if (!no.classList.contains("is-running")) {
      no.classList.add("is-running");
      intro.appendChild(no);
    }

    const { x, y } = randomSpot(width, height);
    no.style.left = `${x}px`;
    no.style.top = `${y}px`;

    sub.textContent = NO_MESSAGES[dodges % NO_MESSAGES.length];
    dodges++;
    yes.style.transform = `scale(${Math.min(1 + dodges * 0.12, 1.8)})`;
  }

  // Mouse users: it escapes before they can click. Touch users: it escapes on tap.
  no.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") runAway(e); });
  no.addEventListener("click", runAway);

  // If the window is resized, pull the button back on screen.
  window.addEventListener("resize", () => {
    if (!no.isConnected || !no.classList.contains("is-running")) return;
    const { width, height } = no.getBoundingClientRect();
    const { x, y } = randomSpot(width, height);
    no.style.left = `${x}px`;
    no.style.top = `${y}px`;
  });

  yes.addEventListener("click", (e) => {
    burstHearts(e.clientX, e.clientY, 24);
    document.dispatchEvent(new CustomEvent("intro:yes")); // lets the song start
    markSeen();
    intro.classList.add("is-leaving");
    document.body.style.overflow = "";
    setTimeout(() => intro.remove(), 700);
  });

  yes.focus();
}
