/** Polaroid photo wall. Missing images turn into a pink placeholder. */

import { escapeHtml } from "../utils/dom.js";
import { openLightbox } from "./lightbox.js";

export function renderGallery(grid, photos) {
  const available = new Set(photos.map((_, i) => i));

  grid.innerHTML = photos
    .map(
      (p, i) => `
      <button type="button" class="polaroid reveal" data-index="${i}">
        <img src="${escapeHtml(p.src)}" alt="${escapeHtml(p.caption)}" loading="lazy" />
        <span class="polaroid__caption">${escapeHtml(p.caption)}</span>
      </button>`
    )
    .join("");

  grid.querySelectorAll(".polaroid img").forEach((img) => {
    img.addEventListener("error", () => {
      const card = img.closest(".polaroid");
      available.delete(Number(card.dataset.index));
      img.outerHTML = `
        <div class="polaroid__placeholder">
          <div><b>📷</b>photo missing<br><small>${escapeHtml(img.getAttribute("src"))}</small></div>
        </div>`;
    });
  });

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".polaroid");
    if (!card) return;
    const index = Number(card.dataset.index);
    if (!available.has(index)) return;

    // Only page through photos that actually loaded.
    const visible = photos.filter((_, i) => available.has(i));
    openLightbox(visible, visible.indexOf(photos[index]));
  });
}
