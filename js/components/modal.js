/** One shared modal used by the letters and the photo lightbox. */

import { $ } from "../utils/dom.js";

const modal = $("#modal");
const body = $("#modal-body");
let lastFocused = null;
let cleanup = null;

/**
 * Show HTML inside the modal.
 * @param {string} html
 * @param {{ onClose?: () => void }} [options]
 */
export function openModal(html, { onClose } = {}) {
  if (!modal.classList.contains("is-open")) lastFocused = document.activeElement;
  if (cleanup) cleanup();
  cleanup = onClose || null;

  body.innerHTML = html;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $(".modal__close", modal).focus();
}

/** Replace the modal content without closing it (used for lightbox prev/next). */
export function setModalContent(html) {
  body.innerHTML = html;
}

export function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (cleanup) cleanup();
  cleanup = null;
  if (lastFocused) lastFocused.focus();
}

export const isModalOpen = () => modal.classList.contains("is-open");

export function initModal() {
  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isModalOpen()) closeModal();
  });
}
