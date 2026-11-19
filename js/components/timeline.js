/** Renders "Our story" chapters, with optional photos per chapter. */

import { escapeHtml, paragraphs } from "../utils/dom.js";
import { getPhotos } from "../data/photos.js";
import { openLightbox } from "./lightbox.js";

const photosHtml = (photos) => {
  if (!photos.length) return "";
  let modifier = "";
  if (photos.length >= 4) modifier = " timeline__photos--2 timeline__photos--4";
  else if (photos.length > 1) modifier = " timeline__photos--2";
  return `
    <div class="timeline__photos${modifier}">
      ${photos
        .map(
          (p, i) => `
        <button type="button" class="timeline__photo" data-photo="${i}" aria-label="View photo: ${escapeHtml(p.caption)}">
          <img src="${escapeHtml(p.src)}" alt="${escapeHtml(p.caption)}" loading="lazy" />
        </button>`
        )
        .join("")}
    </div>`;
};

export function renderTimeline(list, chapters) {
  list.innerHTML = chapters
    .map((chapter, i) => {
      const photos = getPhotos(chapter.photos);
      return `
      <li class="timeline__item reveal" data-chapter="${i}">
        <span class="timeline__dot" aria-hidden="true">${chapter.icon}</span>
        <div class="timeline__card">
          ${photosHtml(photos)}
          <span class="timeline__when">${escapeHtml(chapter.when)}</span>
          <h3>${escapeHtml(chapter.title)}</h3>
          ${paragraphs(chapter.body)}
          ${chapter.note ? `<p class="timeline__note">${escapeHtml(chapter.note)}</p>` : ""}
        </div>
      </li>`;
    })
    .join("");

  list.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-photo]");
    if (!btn) return;
    const chapter = chapters[btn.closest("[data-chapter]").dataset.chapter];
    openLightbox(getPhotos(chapter.photos), Number(btn.dataset.photo));
  });
}
