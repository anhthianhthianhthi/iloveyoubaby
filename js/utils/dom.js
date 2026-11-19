/** Small DOM helpers shared by every component. */

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escape text before putting it into innerHTML. */
export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

/** Turn an array of strings into <p> tags ("\n" becomes <br>). */
export const paragraphs = (lines, className = "") =>
  lines
    .map((line) => `<p${className ? ` class="${className}"` : ""}>${escapeHtml(line).replace(/\n/g, "<br>")}</p>`)
    .join("");

/** Restart a CSS animation class on an element. */
export const replayAnimation = (el, className) => {
  el.classList.remove(className);
  void el.offsetWidth; // force reflow
  el.classList.add(className);
};
