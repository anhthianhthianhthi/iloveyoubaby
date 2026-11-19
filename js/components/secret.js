/** Password lock that reveals the secret letter. */

import { $, escapeHtml, replayAnimation } from "../utils/dom.js";
import { burstFrom } from "../utils/effects.js";

const WRONG_MESSAGES = ["nope 🙈", "try again, my love", "bro… really?", "that's not it… ragebait?", "think harder 😤", "so close (not really)"];

const letterHtml = ({ title, paragraphs }) => `
  <h3>${escapeHtml(title)}</h3>
  ${paragraphs
    .map((p) => {
      if (typeof p === "string") return `<p>${escapeHtml(p)}</p>`;
      if (p.big) return `<p class="secret-letter__big">${escapeHtml(p.big).replace(/\n/g, "<br>")}</p>`;
      if (p.sign) return `<p class="secret-letter__sign">${escapeHtml(p.sign)}</p>`;
      return "";
    })
    .join("")}`;

export function initSecret({ password, hint, letter }) {
  const lock = $("#lock");
  const form = $("#lock-form");
  const input = $("#lock-input");
  const error = $("#lock-error");
  const article = $("#secret-letter");
  let attempts = 0;

  $("#lock-hint").textContent = hint;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (input.value.trim().toLowerCase() === password.toLowerCase()) {
      lock.hidden = true;
      article.innerHTML = letterHtml(letter);
      article.hidden = false;
      burstFrom(article, 28);
      return;
    }

    error.textContent = WRONG_MESSAGES[attempts++ % WRONG_MESSAGES.length];
    replayAnimation(lock, "is-shaking");
    input.select();
  });
}
