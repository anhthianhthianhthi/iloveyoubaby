/** Full-size photo viewer with prev/next (buttons, arrow keys, swipe). */

import { escapeHtml } from "../utils/dom.js";
import { openModal, setModalContent } from "./modal.js";

/**
 * @param {{src: string, caption: string}[]} photos
 * @param {number} startIndex
 */
export function openLightbox(photos, startIndex = 0) {
  let index = startIndex;
  const multiple = photos.length > 1;

  const render = () => {
    const photo = photos[index];
    return `
      <figure class="lightbox">
        <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.caption)}" />
        <figcaption class="lightbox__caption">${escapeHtml(photo.caption)}</figcaption>
        ${multiple ? `<span class="lightbox__count">${index + 1} / ${photos.length}</span>` : ""}
      </figure>
      ${multiple ? `
        <button type="button" class="lightbox__nav lightbox__nav--prev" data-step="-1" aria-label="Previous photo">‹</button>
        <button type="button" class="lightbox__nav lightbox__nav--next" data-step="1" aria-label="Next photo">›</button>` : ""}
    `;
  };

  const go = (step) => {
    index = (index + step + photos.length) % photos.length;
    setModalContent(render());
  };

  const onClick = (e) => {
    const btn = e.target.closest("[data-step]");
    if (btn) go(Number(btn.dataset.step));
  };
  const onKey = (e) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };
  let touchX = null;
  const onTouchStart = (e) => (touchX = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchX = null;
  };

  const modal = document.getElementById("modal");
  if (multiple) {
    modal.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    modal.addEventListener("touchstart", onTouchStart, { passive: true });
    modal.addEventListener("touchend", onTouchEnd);
  }

  openModal(render(), {
    onClose: () => {
      modal.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
      modal.removeEventListener("touchstart", onTouchStart);
      modal.removeEventListener("touchend", onTouchEnd);
    },
  });
}
