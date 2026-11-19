/** "Open when…" envelopes. Remembers which ones were already opened. */

import { escapeHtml, paragraphs } from "../utils/dom.js";
import { storage } from "../utils/storage.js";
import { burstHearts } from "../utils/effects.js";
import { openModal } from "./modal.js";

const STORAGE_KEY = "openedLetters";

export function renderLetters(grid, letters, signOff) {
  const opened = new Set(storage.get(STORAGE_KEY, []));

  grid.innerHTML = letters
    .map(
      (letter, i) => `
      <button type="button" class="envelope reveal${opened.has(i) ? " is-opened" : ""}" data-index="${i}">
        <span class="envelope__seal" aria-hidden="true">${letter.emoji}</span>
        <span class="envelope__label">open when ${escapeHtml(letter.label)}</span>
      </button>`
    )
    .join("");

  grid.addEventListener("click", (e) => {
    const envelope = e.target.closest(".envelope");
    if (!envelope) return;

    const index = Number(envelope.dataset.index);
    const letter = letters[index];

    opened.add(index);
    storage.set(STORAGE_KEY, [...opened]);
    envelope.classList.add("is-opened");
    burstHearts(e.clientX, e.clientY, 8);

    openModal(`
      <div class="letter-paper">
        <h3>${escapeHtml(letter.title)}</h3>
        ${paragraphs(letter.body)}
        <p class="letter-paper__sign">${escapeHtml(signOff)}</p>
      </div>`);
  });
}
