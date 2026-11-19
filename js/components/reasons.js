/**
 * Reasons jar: draws reasons in random order without repeats.
 * The list (and its button) stay hidden until every reason has been pulled.
 * Nothing is remembered, so he has to pull them all again on every visit.
 */

import { $, escapeHtml, replayAnimation } from "../utils/dom.js";
import { burstHearts } from "../utils/effects.js";

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export function initReasons(reasons) {
  const card = $("#reason-card");
  const num = $("#reason-num");
  const text = $("#reason-text");
  const progress = $("#jar-progress");
  const drawBtn = $("#reason-btn");
  const toggleBtn = $("#reason-all-btn");
  const list = $("#reasons-list");

  // Clean up the "unlocked" flag older versions of the site saved.
  try { localStorage.removeItem("reasonsListUnlocked"); } catch { /* ignore */ }

  let pool = [];
  let drawn = 0;
  let unlocked = false;

  const refill = () => {
    pool = shuffle(reasons.map((_, i) => i));
    drawn = 0;
  };
  const lockedHint = () => `${drawn} of ${reasons.length} pulled. Pull them all to unlock the full list 🔒`;

  refill();
  list.innerHTML = reasons.map((r) => `<li>${escapeHtml(r)}</li>`).join("");
  list.hidden = true;
  toggleBtn.hidden = true;
  progress.textContent = lockedHint();

  drawBtn.addEventListener("click", (e) => {
    if (!pool.length) refill();
    const i = pool.pop();
    drawn++;

    num.textContent = `reason #${i + 1}`;
    text.textContent = reasons[i];
    replayAnimation(card, "is-popping");
    burstHearts(e.clientX, e.clientY, 6);

    if (pool.length) {
      progress.textContent = unlocked ? `${drawn} of ${reasons.length} pulled. Keep going…` : lockedHint();
      drawBtn.textContent = "Another one 💌";
      return;
    }

    // Last one pulled.
    drawBtn.textContent = "Start again 💌";
    if (!unlocked) {
      unlocked = true;
      toggleBtn.hidden = false;
      progress.textContent = `You pulled all ${reasons.length}!! 🎉 The full list is unlocked.`;
      burstHearts(e.clientX, e.clientY, 20);
    } else {
      progress.textContent = `That's all ${reasons.length}… for now. I'll keep finding more. 💗`;
    }
  });

  toggleBtn.addEventListener("click", () => {
    const show = list.hidden;
    list.hidden = !show;
    toggleBtn.setAttribute("aria-expanded", String(show));
    toggleBtn.textContent = show ? "Hide the list" : "Show me all of them";
  });
}
