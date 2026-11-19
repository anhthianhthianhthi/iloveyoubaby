/**
 * Pumpkin hunt: tiny pumpkins hidden around the site.
 * (Because he never brought me the pumpkin his mom gave me.)
 * Progress is saved, so he can find them across visits.
 */

import { $, replayAnimation } from "../utils/dom.js";
import { storage } from "../utils/storage.js";
import { burstHearts } from "../utils/effects.js";
import { openModal, closeModal } from "./modal.js";

const STORAGE_KEY = "pumpkinsFound";

/** Where the pumpkins hide: an element + a CSS position inside it. */
const SPOTS = [
  { target: ".hero", style: "bottom: 14%; right: 9%;" },
  { target: '[data-chapter="5"] .timeline__card', style: "top: 12px; right: 12px;" }, // the dinner-with-your-mom chapter
  { target: "#gallery .section__head", style: "top: -8px; right: -4px;" },
  { target: "#reasons .jar", style: "bottom: -4px; right: -6px;" },
  { target: ".footer", style: "top: 8px; left: 12%;" },
];

export function initPumpkinHunt() {
  const total = SPOTS.length;
  const found = new Set(storage.get(STORAGE_KEY, []));

  const badge = document.createElement("button");
  badge.type = "button";
  badge.className = "pumpkin-badge";
  document.body.appendChild(badge);

  const updateBadge = () => {
    badge.textContent = `🎃 ${found.size}/${total}`;
    badge.setAttribute("aria-label", `Pumpkin hunt: ${found.size} of ${total} found`);
    badge.classList.toggle("is-complete", found.size === total);
  };

  const showRules = () =>
    openModal(`
      <div class="note-card">
        <div class="note-card__emoji">🎃</div>
        <h3>The great pumpkin hunt</h3>
        <p>Your mom gave me the biggest pumpkin she grew. You said you'd bring it next time. You never did. 🙂</p>
        <p>So now you have to make it up to me: there are ${total} pumpkins hidden around this website. Find them all, love.</p>
        <p class="note-card__small">${found.size}/${total} found so far</p>
      </div>`);

  const showReward = () => {
    openModal(`
      <div class="note-card">
        <div class="note-card__emoji">🎉🎃</div>
        <h3>You found all of them!</h3>
        <p>${total} tiny pumpkins don't make up for one giant one… but I'll allow it.</p>
        <p>Your reward: this counts as a coupon for one real pumpkin <em>or</em> one date of your choice. Pick wisely, my love.</p>
        <button type="button" class="btn btn--ghost" id="pumpkin-reset">Hide them again</button>
      </div>`);
    $("#pumpkin-reset").addEventListener("click", () => {
      storage.set(STORAGE_KEY, []);
      closeModal();
      location.reload();
    });
  };

  SPOTS.forEach((spot, i) => {
    if (found.has(i)) return;
    const host = $(spot.target);
    if (!host) return;
    if (getComputedStyle(host).position === "static") host.style.position = "relative";

    const pumpkin = document.createElement("button");
    pumpkin.type = "button";
    pumpkin.className = "pumpkin";
    pumpkin.textContent = "🎃";
    pumpkin.setAttribute("aria-label", "A hidden pumpkin!");
    pumpkin.style.cssText = spot.style;

    pumpkin.addEventListener("click", (e) => {
      e.stopPropagation();
      found.add(i);
      storage.set(STORAGE_KEY, [...found]);
      pumpkin.classList.add("is-found");
      setTimeout(() => pumpkin.remove(), 600);
      burstHearts(e.clientX, e.clientY, 8);
      updateBadge();
      replayAnimation(badge, "is-bumped");
      if (found.size === total) setTimeout(showReward, 700);
    });

    host.appendChild(pumpkin);
  });

  badge.addEventListener("click", () => (found.size === total ? showReward() : showRules()));
  updateBadge();
}
